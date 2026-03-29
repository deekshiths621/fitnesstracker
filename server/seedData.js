const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User.js");
const Workout = require("./models/Workout.js");
const Notification = require("./models/Notification.js");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing data");

    // Create dummy users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const dummyUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        age: 28,
        height: 180,
        weight: 75,
        role: "user",
        status: "active",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        age: 26,
        height: 165,
        weight: 62,
        role: "user",
        status: "active",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        age: 32,
        height: 185,
        weight: 85,
        role: "user",
        status: "active",
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        password: hashedPassword,
        age: 24,
        height: 170,
        weight: 65,
        role: "user",
        status: "active",
      },
      {
        name: "Tom Brown",
        email: "tom@example.com",
        password: hashedPassword,
        age: 35,
        height: 178,
        weight: 78,
        role: "user",
        status: "inactive",
      },
    ];

    const createdUsers = await User.insertMany(dummyUsers);
    console.log(`Created ${createdUsers.length} dummy users`);

    // Create dummy workouts
    const dummyWorkouts = [
      {
        user: createdUsers[0]._id,
        category: "Strength",
        workoutName: "Bench Press",
        sets: 4,
        reps: 8,
        weight: 100,
        duration: 30,
        caloriesBurned: 150,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[0]._id,
        category: "Cardio",
        workoutName: "Running",
        sets: 1,
        reps: 1,
        weight: 0,
        duration: 45,
        caloriesBurned: 450,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[1]._id,
        category: "Flexibility",
        workoutName: "Yoga",
        sets: 1,
        reps: 1,
        weight: 0,
        duration: 60,
        caloriesBurned: 200,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[1]._id,
        category: "Strength",
        workoutName: "Squats",
        sets: 5,
        reps: 5,
        weight: 120,
        duration: 35,
        caloriesBurned: 200,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[2]._id,
        category: "Cardio",
        workoutName: "Cycling",
        sets: 1,
        reps: 1,
        weight: 0,
        duration: 50,
        caloriesBurned: 500,
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[2]._id,
        category: "Strength",
        workoutName: "Deadlift",
        sets: 3,
        reps: 5,
        weight: 140,
        duration: 40,
        caloriesBurned: 250,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[3]._id,
        category: "Sports",
        workoutName: "Tennis",
        sets: 2,
        reps: 3,
        weight: 0,
        duration: 60,
        caloriesBurned: 350,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[3]._id,
        category: "Strength",
        workoutName: "Pull-ups",
        sets: 5,
        reps: 10,
        weight: 0,
        duration: 25,
        caloriesBurned: 180,
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[4]._id,
        category: "Cardio",
        workoutName: "Swimming",
        sets: 1,
        reps: 1,
        weight: 0,
        duration: 55,
        caloriesBurned: 480,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: createdUsers[0]._id,
        category: "Strength",
        workoutName: "Shoulder Press",
        sets: 3,
        reps: 10,
        weight: 60,
        duration: 25,
        caloriesBurned: 120,
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
      },
    ];

    const createdWorkouts = await Workout.insertMany(dummyWorkouts);
    console.log(`Created ${createdWorkouts.length} dummy workouts`);

    // Create dummy notifications
    const dummyNotifications = [
      {
        title: "Welcome to FitTrack!",
        message: "Start tracking your workouts and achieve your fitness goals",
        status: "active",
      },
      {
        title: "Weekly Challenge",
        message: "Complete 5 workouts this week to earn a badge",
        status: "active",
      },
      {
        title: "Maintenance Update",
        message: "System maintenance scheduled for Sunday 2:00 AM",
        status: "active",
      },
      {
        title: "New Feature Available",
        message: "Check out our new workout analytics dashboard",
        status: "active",
      },
      {
        title: "Congratulations!",
        message: "You've completed 100 workouts! Great achievement!",
        status: "inactive",
      },
    ];

    const createdNotifications = await Notification.insertMany(dummyNotifications);
    console.log(`Created ${createdNotifications.length} dummy notifications`);

    console.log("\n✅ Database seeded successfully!");
    console.log(`Total Users: ${createdUsers.length}`);
    console.log(`Total Workouts: ${createdWorkouts.length}`);
    console.log(`Total Notifications: ${createdNotifications.length}`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
