import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { updateUserProfile, getUserStats } from "../api";
import { updateProfile } from "../redux/redusers/userSlice";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0px;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 24px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const ProfileCard = styled.div`
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 16px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 100%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px ${({ theme }) => theme.shadowMd};
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.shadowMd};
`;

const AvatarLarge = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;
  font-size: 40px !important;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const FormSection = styled.div`
  display: grid;
  gap: 16px;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.shadowMd};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgLight};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    memberSince: "N/A",
    totalWorkouts: 0,
    totalCalories: 0,
    streakDays: 0,
  });
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    height: currentUser?.height || "",
    weight: currentUser?.weight || "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const token = localStorage.getItem("fittrack-app-token");
        if (!token) {
          console.warn("No token available for fetching stats");
          setStatsLoading(false);
          return;
        }

        console.log("Fetching user stats...");
        const response = await getUserStats(token);
        console.log("User stats response:", response.data);
        
        if (response.data) {
          setStats({
            memberSince: response.data.memberSince || "N/A",
            totalWorkouts: response.data.totalWorkouts || 0,
            totalCalories: response.data.totalCalories || 0,
            streakDays: response.data.streakDays || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        console.error("Error response:", err.response?.data);
        // Use default values on error
        setStats({
          memberSince: "N/A",
          totalWorkouts: 0,
          totalCalories: 0,
          streakDays: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are required");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? Number(formData.age) : null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
      };
      
      const response = await updateUserProfile(token, dataToSend);
      dispatch(updateProfile(dataToSend));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      age: currentUser?.age || "",
      height: currentUser?.height || "",
      weight: currentUser?.weight || "",
    });
    setIsEditing(false);
  };

  return (
    <Container>
      <Wrapper>
        <Title>My Profile</Title>
        
        <ProfileCard>
          <AvatarSection>
            <AvatarLarge src={currentUser?.img}>
              {currentUser?.name?.[0]}
            </AvatarLarge>
            <UserInfo>
              <UserName>{currentUser?.name}</UserName>
              <UserEmail>{currentUser?.email}</UserEmail>
            </UserInfo>
          </AvatarSection>

          {!isEditing && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <strong>Age:</strong> {currentUser?.age || "Not set"} years
                </div>
                <div>
                  <strong>Height:</strong> {currentUser?.height || "Not set"} cm
                </div>
                <div>
                  <strong>Weight:</strong> {currentUser?.weight || "Not set"} kg
                </div>
              </div>
              <Button
                text="Edit Profile"
                leftIcon={<Edit sx={{ fontSize: "18px" }} />}
                onClick={() => setIsEditing(true)}
              />
            </>
          )}

          {isEditing && (
            <FormSection>
              <TextInput
                label="Name"
                name="name"
                value={formData.name}
                handelChange={handleChange}
              />
              <TextInput
                label="Email"
                name="email"
                value={formData.email}
                handelChange={handleChange}
              />
              <GridRow>
                <TextInput
                  label="Age (years)"
                  name="age"
                  type="number"
                  value={formData.age}
                  handelChange={handleChange}
                />
                <TextInput
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  handelChange={handleChange}
                />
              </GridRow>
              <TextInput
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                handelChange={handleChange}
              />
              <ButtonGroup>
                <Button
                  text="Save Changes"
                  leftIcon={<Save sx={{ fontSize: "18px" }} />}
                  onClick={handleSave}
                  isLoading={loading}
                  isDisabled={loading}
                  flex
                />
                <Button
                  text="Cancel"
                  leftIcon={<Close sx={{ fontSize: "18px" }} />}
                  onClick={handleCancel}
                  outlined
                  flex
                />
              </ButtonGroup>
            </FormSection>
          )}

          <StatsGrid>
            <StatCard>
              <StatLabel>Member Since</StatLabel>
              <StatValue>{statsLoading ? "..." : stats.memberSince}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Workouts</StatLabel>
              <StatValue>{statsLoading ? "..." : stats.totalWorkouts}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Calories</StatLabel>
              <StatValue>{statsLoading ? "..." : stats.totalCalories.toLocaleString()}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Streak Days</StatLabel>
              <StatValue>{statsLoading ? "..." : stats.streakDays}</StatValue>
            </StatCard>
          </StatsGrid>
        </ProfileCard>
      </Wrapper>
    </Container>
  );
};

export default Profile;
