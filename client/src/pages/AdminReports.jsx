import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSystemReports } from "../api/index.js";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.primaryDark};
    }
  }
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0px 24px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const BackButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReportCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReportTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary}20;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
`;

const BarChart = styled.div`
  width: 30px;
  background: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const DownloadButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newUsersThisMonth: 0,
    },
    workoutStats: {
      totalWorkouts: 0,
      workoutsThisMonth: 0,
      averageWorkoutDuration: 0,
      mostPopularCategory: "N/A",
    },
    systemStats: {
      totalCaloriesBurned: 0,
      totalDuration: 0,
      averageCaloriesPerWorkout: 0,
      systemUptime: "99.9%",
    },
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await getSystemReports(token);
      console.log("Reports response:", response);

      if (response && response.data) {
        setReports({
          userStats: response.data.userStats || {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            newUsersThisMonth: 0,
          },
          workoutStats: response.data.workoutStats || {
            totalWorkouts: 0,
            workoutsThisMonth: 0,
            averageWorkoutDuration: 0,
            mostPopularCategory: "N/A",
          },
          systemStats: response.data.systemStats || {
            totalCaloriesBurned: 0,
            totalDuration: 0,
            averageCaloriesPerWorkout: 0,
            systemUptime: "99.9%",
          },
        });

        // Format chart data from monthly trend
        if (response.data.monthlyTrend && Array.isArray(response.data.monthlyTrend)) {
          const formattedChart = response.data.monthlyTrend.map((item) => ({
            label: item.label || item.date.slice(-2),
            value: item.workouts,
          }));
          setChartData(formattedChart);
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportType) => {
    alert(`Downloading ${reportType} report...`);
    // In a real app, generate and download CSV/PDF
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>System Reports</Title>
          <BackButton onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </BackButton>
        </Header>

        {error && (
          <div
            style={{
              padding: "16px",
              marginBottom: "20px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>
            Loading reports...
          </div>
        ) : (
          <>
            <ReportsGrid>
          <ReportCard>
            <ReportTitle>👥 User Analytics</ReportTitle>
            <StatRow>
              <StatLabel>Total Users</StatLabel>
              <StatValue>{reports.userStats.totalUsers}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Active Users</StatLabel>
              <StatValue>{reports.userStats.activeUsers}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Inactive Users</StatLabel>
              <StatValue>{reports.userStats.inactiveUsers}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>New This Month</StatLabel>
              <StatValue>{reports.userStats.newUsersThisMonth}</StatValue>
            </StatRow>
            {/* <DownloadButton
              onClick={() => handleDownloadReport("User Analytics")}
            >
              📥 Download Report
            </DownloadButton> */}
          </ReportCard>

          <ReportCard>
            <ReportTitle>🏋️ Workout Statistics</ReportTitle>
            <StatRow>
              <StatLabel>Total Workouts</StatLabel>
              <StatValue>{reports.workoutStats.totalWorkouts}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>This Month</StatLabel>
              <StatValue>{reports.workoutStats.workoutsThisMonth}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Avg Duration (min)</StatLabel>
              <StatValue>{reports.workoutStats.averageWorkoutDuration}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Popular Category</StatLabel>
              <StatValue>{reports.workoutStats.mostPopularCategory}</StatValue>
            </StatRow>
            {/* <DownloadButton
              onClick={() => handleDownloadReport("Workout Statistics")}
            >
              📥 Download Report
            </DownloadButton> */}
          </ReportCard>

          <ReportCard>
            <ReportTitle>⚙️ System Statistics</ReportTitle>
            <StatRow>
              <StatLabel>Total Calories Burned</StatLabel>
              <StatValue>{reports.systemStats.totalCaloriesBurned}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Total Duration (min)</StatLabel>
              <StatValue>{reports.systemStats.totalDuration}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Avg Calories/Workout</StatLabel>
              <StatValue>{reports.systemStats.averageCaloriesPerWorkout}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>System Uptime</StatLabel>
              <StatValue>{reports.systemStats.systemUptime}</StatValue>
            </StatRow>
            {/* <DownloadButton
              onClick={() => handleDownloadReport("System Statistics")}
            >
              📥 Download Report
            </DownloadButton> */}
          </ReportCard>
        </ReportsGrid>

        <ReportCard style={{ marginTop: "24px" }}>
          <ReportTitle>📈 Monthly Workout Trends</ReportTitle>
          <ChartContainer>
            {chartData.map((data, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
                <BarChart style={{ height: `${data.value * 1.5}px` }} />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {data.label}
                </span>
              </div>
            ))}
          </ChartContainer>
          {/* <DownloadButton onClick={() => handleDownloadReport("Trends Report")}>
            📥 Download Trends Report
          </DownloadButton> */}
        </ReportCard>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default AdminReports;
