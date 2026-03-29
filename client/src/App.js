import { ThemeProvider, styled } from "styled-components";
import { lightTheme, darkTheme } from "./Utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreSession } from "./redux/redusers/userSlice";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import AdminReports from "./pages/AdminReports";
import AdminNotifications from "./pages/AdminNotifications";
import AdminWorkouts from "./pages/AdminWorkouts";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, ${({ theme }) => theme.bg} 0%, ${({ theme }) => theme.bgDark} 100%);
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.3s ease;
`;

function App() {
  const dispatch = useDispatch();
  const { currentUser, darkMode } = useSelector((state) => state.user);
  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Restore user session from localStorage on app startup
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} />
            <Routes>
              {currentUser?.role === "admin" ? (
                <>
                  <Route path="/" exact element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" exact element={<AdminDashboard />} />
                  <Route path="/admin/manage-users" exact element={<ManageUsers />} />
                  <Route path="/admin/reports" exact element={<AdminReports />} />
                  <Route path="/admin/notifications" exact element={<AdminNotifications />} />
                  <Route path="/admin/workouts" exact element={<AdminWorkouts />} />
                </>
              ) : (
                <>
                  <Route path="/" exact element={<Dashboard />} />
                  <Route path="/workouts" exact element={<Workouts />} />
                  <Route path="/profile" exact element={<Profile />} />
                  <Route path="/goals" exact element={<Goals />} />
                </>
              )}
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
