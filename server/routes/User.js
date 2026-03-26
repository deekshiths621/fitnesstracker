const express = require("express");
const {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
  getUserProfile,
  getUserStats,
  updateUserProfile,
  deleteWorkout,
  updateWorkout,
  getPersonalRecords,
  setGoals,
  getGoals,
} = require("../controllers/User.js");
const { verifyToken } = require("../middleware/verifyToken.js");

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
router.delete("/workout/:id", verifyToken, deleteWorkout);
router.put("/workout/:id", verifyToken, updateWorkout);

router.get("/profile", verifyToken, getUserProfile);
router.get("/stats", verifyToken, getUserStats);
router.put("/profile", verifyToken, updateUserProfile);

router.get("/personalrecords", verifyToken, getPersonalRecords);

router.get("/goals", verifyToken, getGoals);
router.post("/goals", verifyToken, setGoals);

module.exports = router;
