import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  darkMode: localStorage.getItem("fittrack-darkmode") === "true" || false,
  goals: {
    dailyCalories: 2000,
    weeklyWorkouts: 5,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      localStorage.setItem("fittrack-app-token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("fittrack-app-token");
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("fittrack-darkmode", state.darkMode.toString());
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("fittrack-darkmode", action.payload.toString());
    },
    updateProfile: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setGoals: (state, action) => {
      state.goals = action.payload;
    },
  },
});

export const { loginSuccess, logout, toggleDarkMode, setDarkMode, updateProfile, setGoals } = userSlice.actions;

export default userSlice.reducer;
