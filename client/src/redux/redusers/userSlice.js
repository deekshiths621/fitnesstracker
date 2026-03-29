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
      state.currentUser = {
        ...action.payload.user,
        token: action.payload.token,
      };
      localStorage.setItem("fittrack-app-token", action.payload.token);
      localStorage.setItem("fittrack-user-data", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("fittrack-app-token");
      localStorage.removeItem("fittrack-user-data");
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("fittrack-app-token");
      if (token) {
        // Try to decode and get user info from token if stored
        const userData = localStorage.getItem("fittrack-user-data");
        if (userData) {
          state.currentUser = {
            ...JSON.parse(userData),
            token,
          };
        }
      }
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

export const { loginSuccess, logout, toggleDarkMode, setDarkMode, updateProfile, setGoals, restoreSession } = userSlice.actions;

export default userSlice.reducer;
