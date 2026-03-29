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
} = require("../controllers/User.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const { requireAuth, requireAdmin } = require("../middleware/auth.js");
const {
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
} = require("../middleware/validation.js");

const router = express.Router();

router.post("/signup", validateUserRegistration, UserRegister);
router.post("/signin", validateUserLogin, UserLogin);

router.get("/dashboard", verifyToken, requireAuth, getUserDashboard);
router.get("/workout", verifyToken, requireAuth, validateDateQuery, getWorkoutsByDate);
router.post("/workout", verifyToken, requireAuth, validateAddWorkout, addWorkout);
router.delete("/workout/:id", verifyToken, requireAuth, validateObjectId, deleteWorkout);
router.put("/workout/:id", verifyToken, requireAuth, validateObjectId, validateUpdateWorkout, updateWorkout);

router.get("/profile", verifyToken, requireAuth, getUserProfile);
router.get("/stats", verifyToken, requireAuth, getUserStats);
router.put("/profile", verifyToken, requireAuth, validateUpdateProfile, updateUserProfile);

router.get("/personalrecords", verifyToken, requireAuth, getPersonalRecords);

router.get("/goals", verifyToken, requireAuth, getGoals);
router.post("/goals", verifyToken, requireAuth, validateSetGoals, setGoals);

// Admin routes
router.get("/admin/users", verifyToken, requireAdmin, getAllUsers);
router.get("/admin/user/:id", verifyToken, requireAdmin, validateObjectId, getUserById);
router.put("/admin/user/:id", verifyToken, requireAdmin, validateObjectId, validateUpdateProfile, updateUser);
router.delete("/admin/user/:id", verifyToken, requireAdmin, validateObjectId, deleteUser);
router.get("/admin/stats", verifyToken, requireAdmin, getAdminStats);
router.get("/admin/reports", verifyToken, requireAdmin, getSystemReports);

// Notification routes
router.get("/admin/notifications", verifyToken, getAllNotifications);
router.post("/admin/notifications", verifyToken, requireAdmin, validateNotification, createNotification);
router.put("/admin/notifications/:id", verifyToken, requireAdmin, validateObjectId, validateNotification, updateNotification);
router.delete("/admin/notifications/:id", verifyToken, requireAdmin, validateObjectId, deleteNotification);
router.put("/admin/notifications/:id/seen", verifyToken, validateObjectId, markNotificationAsSeen);

// Admin Workout Management routes
router.get("/admin/workouts", verifyToken, requireAdmin, getAllWorkouts);
router.get("/admin/workout/:id", verifyToken, requireAdmin, validateObjectId, getWorkoutById);
router.post("/admin/workout", verifyToken, requireAdmin, validateAdminCreateWorkout, adminCreateWorkout);
router.put("/admin/workout/:id", verifyToken, requireAdmin, validateObjectId, validateAdminUpdateWorkout, adminUpdateWorkout);
router.delete("/admin/workout/:id", verifyToken, requireAdmin, validateObjectId, adminDeleteWorkout);

module.exports = router;
