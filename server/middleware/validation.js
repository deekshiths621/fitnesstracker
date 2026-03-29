const { createError } = require("../error.js");

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 chars)
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// User Registration Validation
const validateUserRegistration = (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if all required fields are present
  if (!email || !password || !name) {
    return next(createError(400, "Email, password, and name are required"));
  }

  // Trim strings
  req.body.email = email.trim().toLowerCase();
  req.body.name = name.trim();
  req.body.password = password.trim();

  // Validate email format
  if (!validateEmail(req.body.email)) {
    return next(createError(400, "Invalid email format"));
  }

  // Validate password length
  if (!validatePassword(req.body.password)) {
    return next(createError(400, "Password must be at least 6 characters long"));
  }

  // Validate name length
  if (req.body.name.length < 2) {
    return next(createError(400, "Name must be at least 2 characters long"));
  }

  if (req.body.name.length > 50) {
    return next(createError(400, "Name must not exceed 50 characters"));
  }

  next();
};

// User Login Validation
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Email and password are required"));
  }

  req.body.email = email.trim().toLowerCase();
  req.body.password = password.trim();

  if (!validateEmail(req.body.email)) {
    return next(createError(400, "Invalid email format"));
  }

  next();
};

// Update User Profile Validation
const validateUpdateProfile = (req, res, next) => {
  const { name, email, age, height, weight } = req.body;

  // At least one field should be provided
  if (!name && !email && !age && !height && !weight) {
    return next(
      createError(400, "At least one field is required for update")
    );
  }

  // Validate email if provided
  if (email) {
    req.body.email = email.trim().toLowerCase();
    if (!validateEmail(req.body.email)) {
      return next(createError(400, "Invalid email format"));
    }
  }

  // Validate name if provided
  if (name) {
    req.body.name = name.trim();
    if (req.body.name.length < 2) {
      return next(createError(400, "Name must be at least 2 characters long"));
    }
    if (req.body.name.length > 50) {
      return next(createError(400, "Name must not exceed 50 characters"));
    }
  }

  // Validate age if provided
  if (age !== undefined) {
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      return next(createError(400, "Age must be between 1 and 150"));
    }
  }

  // Validate height if provided
  if (height !== undefined) {
    const heightNum = Number(height);
    if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      return next(
        createError(400, "Height must be between 50 cm and 300 cm")
      );
    }
  }

  // Validate weight if provided
  if (weight !== undefined) {
    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum < 10 || weightNum > 500) {
      return next(
        createError(400, "Weight must be between 10 kg and 500 kg")
      );
    }
  }

  next();
};

// Validate Workout Update
const validateUpdateWorkout = (req, res, next) => {
  const { sets, reps, weight, duration } = req.body;

  // At least one field should be provided
  if (
    sets === undefined &&
    reps === undefined &&
    weight === undefined &&
    duration === undefined
  ) {
    return next(
      createError(400, "At least one field is required for update")
    );
  }

  // Validate sets if provided
  if (sets !== undefined) {
    const setsNum = Number(sets);
    if (isNaN(setsNum) || setsNum < 1 || setsNum > 100) {
      return next(createError(400, "Sets must be between 1 and 100"));
    }
  }

  // Validate reps if provided
  if (reps !== undefined) {
    const repsNum = Number(reps);
    if (isNaN(repsNum) || repsNum < 1 || repsNum > 1000) {
      return next(createError(400, "Reps must be between 1 and 1000"));
    }
  }

  // Validate weight if provided
  if (weight !== undefined) {
    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 1000) {
      return next(createError(400, "Weight must be between 0 and 1000 kg"));
    }
  }

  // Validate duration if provided
  if (duration !== undefined) {
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0 || durationNum > 1000) {
      return next(
        createError(400, "Duration must be between 0 and 1000 minutes")
      );
    }
  }

  next();
};

// Validate Add Workout
const validateAddWorkout = (req, res, next) => {
  const { workoutString } = req.body;

  if (!workoutString) {
    return next(createError(400, "Workout string is required"));
  }

  req.body.workoutString = workoutString.trim();

  if (req.body.workoutString.length === 0) {
    return next(createError(400, "Workout string cannot be empty"));
  }

  if (req.body.workoutString.length > 5000) {
    return next(
      createError(400, "Workout string exceeds maximum length (5000)")
    );
  }

  next();
};

// Validate Set Goals
const validateSetGoals = (req, res, next) => {
  const { dailyCalories, weeklyWorkouts, maxWeight } = req.body;

  if (
    dailyCalories === undefined &&
    weeklyWorkouts === undefined &&
    maxWeight === undefined
  ) {
    return next(
      createError(400, "At least one goal field is required")
    );
  }

  if (dailyCalories !== undefined) {
    const caloriesNum = Number(dailyCalories);
    if (isNaN(caloriesNum) || caloriesNum <= 0 || caloriesNum > 10000) {
      return next(
        createError(400, "Daily calories must be between 1 and 10000")
      );
    }
  }

  if (weeklyWorkouts !== undefined) {
    const workoutsNum = Number(weeklyWorkouts);
    if (isNaN(workoutsNum) || workoutsNum <= 0 || workoutsNum > 100) {
      return next(
        createError(400, "Weekly workouts must be between 1 and 100")
      );
    }
  }

  if (maxWeight !== undefined) {
    const weightNum = Number(maxWeight);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 500) {
      return next(
        createError(400, "Max weight must be between 0 and 500 kg")
      );
    }
  }

  next();
};

// Validate Notification Creation/Update
const validateNotification = (req, res, next) => {
  const { title, message, status } = req.body;

  if (!title || !message) {
    return next(createError(400, "Title and message are required"));
  }

  req.body.title = title.trim();
  req.body.message = message.trim();

  if (req.body.title.length === 0) {
    return next(createError(400, "Title cannot be empty"));
  }

  if (req.body.title.length > 100) {
    return next(createError(400, "Title exceeds maximum length (100)"));
  }

  if (req.body.message.length === 0) {
    return next(createError(400, "Message cannot be empty"));
  }

  if (req.body.message.length > 500) {
    return next(createError(400, "Message exceeds maximum length (500)"));
  }

  if (status) {
    req.body.status = status.trim().toLowerCase();
    if (!["active", "inactive"].includes(req.body.status)) {
      return next(createError(400, "Status must be either 'active' or 'inactive'"));
    }
  }

  next();
};

// Validate Admin Create Workout (structured format)
const validateAdminCreateWorkout = (req, res, next) => {
  const { userId, category, workoutName, sets, reps, weight, duration } = req.body;

  if (!userId) {
    return next(createError(400, "User ID is required"));
  }

  if (!category) {
    return next(createError(400, "Category is required"));
  }

  if (!workoutName) {
    return next(createError(400, "Workout name is required"));
  }

  // Trim string fields
  req.body.category = category.trim();
  req.body.workoutName = workoutName.trim();

  // Validate category length
  if (req.body.category.length === 0) {
    return next(createError(400, "Category cannot be empty"));
  }

  if (req.body.workoutName.length === 0) {
    return next(createError(400, "Workout name cannot be empty"));
  }

  if (req.body.workoutName.length > 100) {
    return next(createError(400, "Workout name exceeds maximum length (100)"));
  }

  // Validate numeric fields
  if (sets !== undefined) {
    const setsNum = Number(sets);
    if (isNaN(setsNum) || setsNum <= 0 || setsNum > 100) {
      return next(createError(400, "Sets must be between 1 and 100"));
    }
  }

  if (reps !== undefined) {
    const repsNum = Number(reps);
    if (isNaN(repsNum) || repsNum <= 0 || repsNum > 1000) {
      return next(createError(400, "Reps must be between 1 and 1000"));
    }
  }

  if (weight !== undefined) {
    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 500) {
      return next(createError(400, "Weight must be between 0 and 500 kg"));
    }
  }

  if (duration !== undefined) {
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum < 0 || durationNum > 1000) {
      return next(createError(400, "Duration must be between 0 and 1000 minutes"));
    }
  }

  next();
};

// Validate Admin Update Workout (allows category and workoutName changes)
const validateAdminUpdateWorkout = (req, res, next) => {
  const { category, workoutName, sets, reps, weight, duration } = req.body;

  // At least one field should be provided
  if (
    category === undefined &&
    workoutName === undefined &&
    sets === undefined &&
    reps === undefined &&
    weight === undefined &&
    duration === undefined
  ) {
    return next(
      createError(400, "At least one field is required for update")
    );
  }

  // Validate category if provided
  if (category !== undefined) {
    const catStr = String(category).trim();
    if (catStr.length === 0) {
      return next(createError(400, "Category cannot be empty"));
    }
  }

  // Validate workoutName if provided
  if (workoutName !== undefined) {
    const nameStr = String(workoutName).trim();
    if (nameStr.length === 0) {
      return next(createError(400, "Workout name cannot be empty"));
    }
    if (nameStr.length > 100) {
      return next(createError(400, "Workout name exceeds maximum length (100)"));
    }
  }

  // Validate sets if provided
  if (sets !== undefined) {
    const setsNum = Number(sets);
    if (isNaN(setsNum) || setsNum < 1 || setsNum > 100) {
      return next(createError(400, "Sets must be between 1 and 100"));
    }
  }

  // Validate reps if provided
  if (reps !== undefined) {
    const repsNum = Number(reps);
    if (isNaN(repsNum) || repsNum < 1 || repsNum > 1000) {
      return next(createError(400, "Reps must be between 1 and 1000"));
    }
  }

  // Validate weight if provided
  if (weight !== undefined) {
    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 1000) {
      return next(createError(400, "Weight must be between 0 and 1000 kg"));
    }
  }

  // Validate duration if provided
  if (duration !== undefined) {
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0 || durationNum > 1000) {
      return next(
        createError(400, "Duration must be between 0 and 1000 minutes")
      );
    }
  }

  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  const ObjectId = require("mongoose").Types.ObjectId;

  if (!ObjectId.isValid(id)) {
    return next(createError(400, "Invalid ID format"));
  }

  next();
};

// Validate Query Date Parameter
const validateDateQuery = (req, res, next) => {
  if (req.query.date) {
    const date = new Date(req.query.date);
    if (isNaN(date.getTime())) {
      return next(createError(400, "Invalid date format. Use YYYY-MM-DD or valid date string"));
    }
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUpdateProfile,
  validateUpdateWorkout,
  validateAdminUpdateWorkout,
  validateAddWorkout,
  validateAdminCreateWorkout,
  validateSetGoals,
  validateNotification,
  validateObjectId,
  validateDateQuery,
};
