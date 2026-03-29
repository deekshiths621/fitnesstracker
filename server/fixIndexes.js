const mongoose = require("mongoose");
const Workout = require("./models/Workout.js");
const dotenv = require("dotenv");

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Drop all indexes on workouts collection (except _id)
    await Workout.collection.dropIndexes();
    console.log("Dropped all indexes");

    // Delete all workouts to start fresh
    await Workout.deleteMany({});
    console.log("Cleared all workouts");

    // Recreate indexes from schema
    await Workout.syncIndexes();
    console.log("Recreated indexes from schema");

    // Get all indexes
    const indexes = await Workout.collection.getIndexes();
    console.log("Current indexes:", indexes);

    console.log("✅ Indexes fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
    process.exit(1);
  }
};

fixIndexes();
