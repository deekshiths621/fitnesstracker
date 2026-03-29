const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createError } = require("../error.js");
const User = require("../models/User.js");
const Workout = require("../models/Workout.js");
const Notification = require("../models/Notification.js");
const Goals = require("../models/Goals.js");

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
      role: "user",
    });
    const createdUser = await user.save();
    const token = jwt.sign(
      { id: createdUser._id, role: "user" },
      process.env.JWT,
      {
        expiresIn: "9999 years",
      }
    );
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if credentials match admin credentials from .env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a virtual admin token
      const adminUser = {
        _id: "admin_000",
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        img: null,
      };
      const token = jwt.sign(
        { id: adminUser._id, role: "admin" },
        process.env.JWT,
        {
          expiresIn: "9999 years",
        }
      );
      return res.status(200).json({ token, user: adminUser });
    }

    // Regular user login
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT,
      {
        expiresIn: "9999 years",
      }
    );

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
      user: userId,
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
    for (const line of eachworkout) {
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
    }

    // Calculate calories burnt for each workout
    const createdWorkouts = [];
    for (const workout of parsedWorkouts) {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      
      // Check for duplicate workout for this user
      const existingWorkout = await Workout.findOne({
        user: userId,
        workoutName: workout.workoutName,
      });

      if (existingWorkout) {
        return next(
          createError(
            409,
            `Workout "${workout.workoutName}" already exists for you. Please use a different name or update the existing workout.`
          )
        );
      }

      const createdWorkout = await Workout.create({ ...workout, user: userId });
      createdWorkouts.push(createdWorkout);
    }

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: createdWorkouts,
    });
  } catch (err) {
    // Handle MongoDB E11000 duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      const value = err.keyValue?.[field] || err.keyValue?.workoutName;
      return next(
        createError(
          409,
          `Workout "${value}" already exists for you. Please use a different name or update the existing workout.`
        )
      );
    }
    // Handle other Mongoose validation errors
    if (err.name === "ValidationError") {
      return next(createError(400, err.message));
    }
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
    console.log("Total workouts for user", userId, ":", totalWorkouts);

    // Calculate total calories using proper ObjectId conversion
    const { Types: { ObjectId } } = require("mongoose");
    const userObjectId = new ObjectId(userId);
    
    const caloriesData = await Workout.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    const totalCalories = caloriesData.length > 0 ? caloriesData[0].totalCalories : 0;
    console.log("Total calories for user", userId, ":", totalCalories);

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
    console.log("Streak days for user", userId, ":", streakDays);

    // Format member since
    const memberSince = user.createdAt ? 
      user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 
      'N/A';

    const statsResponse = {
      memberSince,
      totalWorkouts,
      totalCalories: Math.round(totalCalories),
      streakDays,
    };

    console.log("User stats response:", statsResponse);

    return res.status(200).json(statsResponse);
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

    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }

    // Convert userId to ObjectId properly
    const { Types: { ObjectId } } = require("mongoose");
    const userObjectId = new ObjectId(userId);

    // Get personal records with additional details
    const personalRecords = await Workout.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: "$workoutName",
          maxWeight: { $max: "$weight" },
          maxReps: { $max: "$reps" },
          sets: { $first: "$sets" },
          category: { $first: "$category" },
          totalWorkouts: { $sum: 1 },
          lastDate: { $max: "$date" },
        },
      },
      {
        $sort: { maxWeight: -1 },
      },
      {
        $project: {
          _id: 0,
          workoutName: "$_id",
          maxWeight: 1,
          maxReps: 1,
          sets: 1,
          category: 1,
          totalWorkouts: 1,
          lastDate: 1,
        },
      },
    ]);

    console.log("Personal records aggregation result:", personalRecords);

    return res.status(200).json({
      personalRecords: personalRecords || [],
      count: personalRecords.length,
    });
  } catch (err) {
    console.error("Error in getPersonalRecords:", err);
    next(err);
  }
};

// Set goals
const setGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { dailyCalories, weeklyWorkouts, maxWeight } = req.body;
    
    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }

    // Validate input
    if (dailyCalories && (dailyCalories < 500 || dailyCalories > 10000)) {
      return next(createError(400, "Daily calories must be between 500 and 10000"));
    }
    if (weeklyWorkouts && (weeklyWorkouts < 1 || weeklyWorkouts > 7)) {
      return next(createError(400, "Weekly workouts must be between 1 and 7"));
    }
    if (maxWeight && (maxWeight < 0 || maxWeight > 500)) {
      return next(createError(400, "Max weight must be between 0 and 500"));
    }

    // Create or update goals document
    const goalsData = {
      user: userId,
      dailyCalories: dailyCalories || 2000,
      weeklyWorkouts: weeklyWorkouts || 5,
      maxWeight: maxWeight || 100,
    };

    // Use findOneAndUpdate to create if not exists, update if exists
    const goals = await Goals.findOneAndUpdate(
      { user: userId },
      goalsData,
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Goals saved successfully:", goals);

    return res.status(200).json({ 
      message: "Goals set successfully", 
      goals: goals 
    });
  } catch (err) {
    console.error("Error setting goals:", err);
    next(err);
  }
};

// Get goals
const getGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }

    // Try to find existing goals for the user
    let goals = await Goals.findOne({ user: userId });

    // If no goals exist, create default goals
    if (!goals) {
      goals = await Goals.create({
        user: userId,
        dailyCalories: 2000,
        weeklyWorkouts: 5,
        maxWeight: 100,
      });
      console.log("Default goals created for user:", userId);
    }

    console.log("Goals retrieved:", goals);

    return res.status(200).json({
      message: "Goals retrieved successfully",
      goals: goals,
    });
  } catch (err) {
    console.error("Error getting goals:", err);
    next(err);
  }
};

// Admin: Get all users
const getAllUsers = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const users = await User.find().select("-password");
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ role: "user" });
    
    return res.status(200).json({
      totalUsers,
      activeUsers,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get user by ID
const getUserById = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Admin: Update user
const updateUser = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const userId = req.params.id;
    const { name, email, age, height, weight, role } = req.body;
    
    const updateData = {
      name,
      email,
      age: age ? Number(age) : undefined,
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      role,
    };
    
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete user
const deleteUser = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const userId = req.params.id;
    
    // Don't allow deleting users that don't exist
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Delete user's workouts first
    await Workout.deleteMany({ user: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    return res.status(200).json({ message: "User and associated data deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Admin: Get system stats
const getAdminStats = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    
    const caloriesData = await Workout.aggregate([
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$caloriesBurned" },
        },
      },
    ]);
    
    const totalCalories = caloriesData.length > 0 ? caloriesData[0].totalCalories : 0;
    
    // Get category breakdown
    const categoryBreakdown = await Workout.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalCalories: { $sum: "$caloriesBurned" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      totalUsers,
      totalWorkouts,
      totalCalories: Math.round(totalCalories),
      categoryBreakdown,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get system reports
const getSystemReports = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    // Overall statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const inactiveUsers = await User.countDocuments({ status: "inactive" });
    const totalWorkouts = await Workout.countDocuments();

    // Monthly statistics
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyWorkouts = await Workout.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyNewUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Total calories burned (all time)
    const totalCaloriesResult = await Workout.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$caloriesBurned" },
        },
      },
    ]);
    const totalCaloriesBurned = totalCaloriesResult.length > 0 ? Math.round(totalCaloriesResult[0].total) : 0;

    // Monthly calories
    const monthlyCaloriesResult = await Workout.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$caloriesBurned" },
        },
      },
    ]);
    const monthlyCalories = monthlyCaloriesResult.length > 0 ? Math.round(monthlyCaloriesResult[0].total) : 0;

    // Average duration per workout
    const avgDurationResult = await Workout.aggregate([
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);
    const averageWorkoutDuration = avgDurationResult.length > 0 ? Math.round(avgDurationResult[0].avgDuration) : 0;

    // Total duration
    const totalDurationResult = await Workout.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$duration" },
        },
      },
    ]);
    const totalDuration = totalDurationResult.length > 0 ? totalDurationResult[0].total : 0;

    // Average calories per workout
    const averageCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCaloriesBurned / totalWorkouts) : 0;

    // Most popular category
    const categoryStats = await Workout.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    const mostPopularCategory = categoryStats.length > 0 ? categoryStats[0]._id || "N/A" : "N/A";

    // Weekly/Monthly trend (last 7 days)
    const monthlyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

      const dayWorkouts = await Workout.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
      });

      monthlyTrend.push({
        date: dayStart.toISOString().split("T")[0],
        label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayStart.getDay()],
        workouts: dayWorkouts,
      });
    }

    return res.status(200).json({
      userStats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsersThisMonth: monthlyNewUsers,
      },
      workoutStats: {
        totalWorkouts,
        workoutsThisMonth: monthlyWorkouts,
        averageWorkoutDuration,
        mostPopularCategory,
      },
      systemStats: {
        totalCaloriesBurned,
        totalDuration,
        averageCaloriesPerWorkout,
        systemUptime: "99.9%",
      },
      monthlyTrend,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all notifications
const getAllNotifications = async (req, res, next) => {
  try {
    // Allow all authenticated users to fetch notifications
    const userId = req.user?.id;
    const notifications = await Notification.find({ status: "active" }).sort({ createdAt: -1 });
    const activeNotifications = await Notification.countDocuments({
      status: "active",
    });

    // Count unseen notifications for this user
    const unseenNotifications = notifications.filter(
      (notif) => !notif.seenBy.includes(userId)
    ).length;

    return res.status(200).json({
      notifications,
      activeNotifications,
      unseenNotifications,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create notification
const createNotification = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { title, message } = req.body;

    if (!title || !message) {
      return next(createError(400, "Title and message are required"));
    }

    const notification = new Notification({
      title,
      message,
      status: "active",
    });

    const savedNotification = await notification.save();

    return res.status(201).json({
      message: "Notification created successfully",
      notification: savedNotification,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update notification
const updateNotification = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { id } = req.params;
    const { title, message, status } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { title, message, status },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return next(createError(404, "Notification not found"));
    }

    return res.status(200).json({
      message: "Notification updated successfully",
      notification,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return next(createError(404, "Notification not found"));
    }

    return res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Mark notification as seen by user
const markNotificationAsSeen = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return next(createError(401, "User not authenticated"));
    }

    // Check if notification exists
    const notification = await Notification.findById(id);
    if (!notification) {
      return next(createError(404, "Notification not found"));
    }

    // Add user to seenBy array if not already there
    if (!notification.seenBy.includes(userId)) {
      notification.seenBy.push(userId);
      await notification.save();
    }

    return res.status(200).json({
      message: "Notification marked as seen",
      notification,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all workouts
const getAllWorkouts = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const workouts = await Workout.find()
      .populate("user", "name email")
      .sort({ date: -1 });

    const totalWorkouts = await Workout.countDocuments();

    return res.status(200).json({
      workouts,
      totalWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get workout by ID
const getWorkoutById = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { id } = req.params;
    const workout = await Workout.findById(id).populate("user", "name email");

    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    return res.status(200).json(workout);
  } catch (err) {
    next(err);
  }
};

// Admin: Create workout for any user
const adminCreateWorkout = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { userId, category, workoutName, sets, reps, weight, duration, caloriesBurned, date } = req.body;

    if (!userId || !category || !workoutName) {
      return next(createError(400, "User ID, category, and workout name are required"));
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const newWorkout = new Workout({
      user: userId,
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      caloriesBurned,
      date: date || new Date(),
    });

    await newWorkout.save();
    await newWorkout.populate("user", "name email");

    return res.status(201).json({
      message: "Workout created successfully",
      workout: newWorkout,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update workout
const adminUpdateWorkout = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { id } = req.params;
    const { category, workoutName, sets, reps, weight, duration, caloriesBurned, date } = req.body;

    const workout = await Workout.findById(id);
    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    // Update fields
    if (category) workout.category = category;
    if (workoutName) workout.workoutName = workoutName;
    if (sets) workout.sets = sets;
    if (reps) workout.reps = reps;
    if (weight) workout.weight = weight;
    if (duration) workout.duration = duration;
    if (caloriesBurned) workout.caloriesBurned = caloriesBurned;
    if (date) workout.date = date;

    await workout.save();
    await workout.populate("user", "name email");

    return res.status(200).json({
      message: "Workout updated successfully",
      workout,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete workout
const adminDeleteWorkout = async (req, res, next) => {
  try {
    // Check if user has admin role from JWT
    if (req.user?.role !== "admin") {
      return next(createError(403, "Unauthorized: Admin role required"));
    }

    const { id } = req.params;

    const workout = await Workout.findByIdAndDelete(id);

    if (!workout) {
      return next(createError(404, "Workout not found"));
    }

    return res.status(200).json({
      message: "Workout deleted successfully",
    });
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminStats,
  getSystemReports,
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsSeen,
  getAllWorkouts,
  getWorkoutById,
  adminCreateWorkout,
  adminUpdateWorkout,
  adminDeleteWorkout,
};
