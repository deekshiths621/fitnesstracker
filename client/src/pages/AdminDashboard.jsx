import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAdminStats, getAllNotifications } from "../api";

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
  gap: 32px;
  padding: 0px 24px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AdminCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const CardDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = localStorage.getItem("fittrack-app-token");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) return;

        const response = await getAdminStats(token);
        
        // Get total workouts from the response
        const totalWorkouts = response.data.totalWorkouts || 0;
        const totalUsers = response.data.totalUsers || 0;

        // Fetch active notifications count
        let notificationsCount = 0;
        try {
          const notificationsResponse = await getAllNotifications(token);
          notificationsCount = notificationsResponse.data.activeNotifications || 0;
        } catch (err) {
          console.log("Could not fetch notifications");
        }

        setStats({
          totalUsers,
          totalWorkouts,
          totalNotifications: notificationsCount,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const adminFeatures = [
    {
      id: 1,
      icon: "👥",
      title: "Manage Users",
      description: "View, edit, and manage all user accounts",
      path: "/admin/manage-users",
    },
    {
      id: 2,
      icon: "📊",
      title: "View Reports",
      description: "Track system statistics and user analytics",
      path: "/admin/reports",
    },
    {
      id: 3,
      icon: "🔔",
      title: "Manage Notifications",
      description: "Create and manage system notifications",
      path: "/admin/notifications",
    },
  ];

  return (
    <Container>
      <Wrapper>
        <Title>Admin Dashboard</Title>

        <StatsContainer>
          <StatCard>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalWorkouts}</StatValue>
            <StatLabel>Total Workouts</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalNotifications}</StatValue>
            <StatLabel>Active Notifications</StatLabel>
          </StatCard>
        </StatsContainer>

        <div>
          <Title style={{ fontSize: "20px", marginBottom: "16px" }}>
            Management Tools
          </Title>
          <AdminGrid>
            {adminFeatures.map((feature) => (
              <AdminCard
                key={feature.id}
                onClick={() => navigate(feature.path)}
              >
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </AdminCard>
            ))}
          </AdminGrid>
        </div>
      </Wrapper>
    </Container>
  );
};

export default AdminDashboard;
