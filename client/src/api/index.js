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
