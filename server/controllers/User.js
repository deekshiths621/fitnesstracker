const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createError } = require("../error.js");
const User = require("../models/User.js");
const Workout = require("../models/Workout.js");

dotenv.config();

const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesBurnt.push(
        weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
      );
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysWorkouts = await Workout.find({
      userId: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) {
      return next(createError(400, "Workout string is missing"));
    }
    // Split workoutString into lines
    const eachworkout = workoutString.split(";").map((line) => line.trim());
    // Check if any workouts start with "#" to indicate categories
    const categories = eachworkout.filter((line) => line.startsWith("#"));
    if (categories.length === 0) {
      return next(createError(400, "No categories found in workout string"));
    }

    const parsedWorkouts = [];
    let currentCategory = "";
    let count = 0;

    // Loop through each line to parse workout details
    await eachworkout.forEach((line) => {
      count++;
      if (line.startsWith("#")) {
        const parts = line?.split("\n").map((part) => part.trim());
        console.log(parts);
        if (parts.length < 5) {
          return next(
            createError(400, `Workout string is missing for ${count}th workout`)
          );
        }

        // Update current category
        currentCategory = parts[0].substring(1).trim();
        // Extract workout details
        const workoutDetails = parseWorkoutLine(parts);
        if (workoutDetails == null) {
          return next(createError(400, "Please enter in proper format "));
        }

        if (workoutDetails) {
          // Add category to workout details
          workoutDetails.category = currentCategory;
          parsedWorkouts.push(workoutDetails);
        }
      } else {
        return next(
          createError(400, `Workout string is missing for ${count}th workout`)
        );
      }
    });

    // Calculate calories burnt for each workout
    await parsedWorkouts.forEach(async (workout) => {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      await Workout.create({ ...workout, user: userId });
    });

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: parsedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Calculate total workouts
    const totalWorkouts = await Workout.countDocuments({ user: userId });

    // Calculate total calories
    const caloriesData = await Workout.aggregate([
      { $match: { user: new require("mongoose").Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    const totalCalories = caloriesData.length > 0 ? caloriesData[0].totalCalories : 0;

    // Calculate streak days (consecutive days with workouts)
    const allWorkouts = await Workout.find({ user: userId })
      .sort({ date: -1 })
      .select("date");

    let streakDays = 0;
    if (allWorkouts.length > 0) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (const workout of allWorkouts) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        
        const diffTime = currentDate - workoutDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === streakDays) {
          streakDays++;
          currentDate = new Date(workoutDate);
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Format member since
    const memberSince = user.createdAt ? 
      user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 
      'N/A';

    return res.status(200).json({
      memberSince,
      totalWorkouts,
      totalCalories: Math.round(totalCalories),
      streakDays,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    next(err);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { name, email, age, height, weight } = req.body;
    
    // Convert numeric fields
    const updateData = {
      name,
      email,
      age: age ? Number(age) : undefined,
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    next(err);
  }
};

// Delete workout
const deleteWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user?.id;
    
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }
    
    if (workout.user.toString() !== userId) {
      return next(createError(403, "Unauthorized to delete this workout"));
    }
    
    await Workout.findByIdAndDelete(workoutId);
    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Update workout
const updateWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user?.id;
    const { sets, reps, weight, duration } = req.body;
    
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }
    
    if (workout.user.toString() !== userId) {
      return next(createError(403, "Unauthorized to update this workout"));
    }
    
    workout.sets = sets || workout.sets;
    workout.reps = reps || workout.reps;
    workout.weight = weight || workout.weight;
    workout.duration = duration || workout.duration;
    workout.caloriesBurned = calculateCaloriesBurnt(workout);
    
    await workout.save();
    return res.status(200).json({ message: "Workout updated successfully", workout });
  } catch (err) {
    next(err);
  }
};

// Get personal records
const getPersonalRecords = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    const personalRecords = await Workout.aggregate([
      { $match: { user: new require("mongoose").Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$workoutName",
          maxWeight: { $max: "$weight" },
        },
      },
      { $sort: { maxWeight: -1 } },
    ]);
    
    return res.status(200).json(personalRecords);
  } catch (err) {
    next(err);
  }
};

// Set goals
const setGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { dailyCalories, weeklyWorkouts } = req.body;
    
    // Create or update a goals document
    const goalsData = {
      user: userId,
      dailyCalories,
      weeklyWorkouts,
    };
    
    return res.status(200).json({ message: "Goals set successfully", goals: goalsData });
  } catch (err) {
    next(err);
  }
};

// Get goals
const getGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    // Return default goals if none exist
    const goals = {
      dailyCalories: 2000,
      weeklyWorkouts: 5,
    };
    
    return res.status(200).json(goals);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  UserRegister,
  UserLogin,
  getUserDashboard,
  getWorkoutsByDate,
  addWorkout,
  parseWorkoutLine,
  calculateCaloriesBurnt,
  getUserProfile,
  getUserStats,
  updateUserProfile,
  deleteWorkout,
  updateWorkout,
  getPersonalRecords,
  setGoals,
  getGoals,
};
