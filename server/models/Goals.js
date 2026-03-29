const mongoose = require("mongoose");

const GoalsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dailyCalories: {
      type: Number,
      default: 2000,
      min: 500,
      max: 10000,
    },
    weeklyWorkouts: {
      type: Number,
      default: 5,
      min: 1,
      max: 7,
    },
    maxWeight: {
      type: Number,
      default: 100,
      min: 0,
      max: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goals", GoalsSchema);
