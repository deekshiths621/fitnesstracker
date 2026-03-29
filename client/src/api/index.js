import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Workout Management
export const deleteWorkout = async (token, workoutId) =>
  await API.delete(`/user/workout/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateWorkout = async (token, workoutId, data) =>
  await API.put(`/user/workout/${workoutId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Personal Records
export const getPersonalRecords = async (token) =>
  await API.get(`/user/personalrecords`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// User Profile
export const getUserProfile = async (token) =>
  await API.get(`/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserStats = async (token) =>
  await API.get(`/user/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserProfile = async (token, data) =>
  await API.put(`/user/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Goals
export const getGoals = async (token) =>
  await API.get(`/user/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const setGoals = async (token, data) =>
  await API.post(`/user/goals`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateGoals = async (token, data) =>
  await API.put(`/user/goals`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin Endpoints
export const getAllUsers = async (token) =>
  await API.get(`/user/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserById = async (token, userId) =>
  await API.get(`/user/admin/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = async (token, userId, data) =>
  await API.put(`/user/admin/user/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUserById = async (token, userId) =>
  await API.delete(`/user/admin/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAdminStats = async (token) =>
  await API.get(`/user/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSystemReports = async (token) =>
  await API.get(`/user/admin/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Notifications
export const getAllNotifications = async (token) =>
  await API.get(`/user/admin/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createNotification = async (token, data) =>
  await API.post(`/user/admin/notifications`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateNotification = async (token, id, data) =>
  await API.put(`/user/admin/notifications/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteNotification = async (token, id) =>
  await API.delete(`/user/admin/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationAsSeen = async (token, id) =>
  await API.put(`/user/admin/notifications/${id}/seen`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin Workout Management APIs
export const getAllWorkouts = async (token) =>
  await API.get(`/user/admin/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkoutById = async (token, workoutId) =>
  await API.get(`/user/admin/workout/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createAdminWorkout = async (token, data) =>
  await API.post(`/user/admin/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdminWorkout = async (token, workoutId, data) =>
  await API.put(`/user/admin/workout/${workoutId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAdminWorkout = async (token, workoutId) =>
  await API.delete(`/user/admin/workout/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
