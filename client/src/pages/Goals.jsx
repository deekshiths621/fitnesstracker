import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { GpsFixed, TrendingUp } from "@mui/icons-material";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { setGoals, getGoals } from "../api";
import { setGoals as setReduxGoals } from "../redux/redusers/userSlice";

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
  max-width: 800px;
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

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 16px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 100%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px ${({ theme }) => theme.shadowMd};
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GoalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ProgressValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.shadowMd};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  border-radius: 4px;
  width: ${({ progress }) => `${Math.min(progress * 100, 100)}%`};
  transition: width 0.3s ease;
`;

const StatGrid = styled.div`
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

const StatBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgLight};
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.shadowMd};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const Goals = () => {
  const { goals } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("fittrack-app-token");
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dailyCalories: goals?.dailyCalories || 2000,
    weeklyWorkouts: goals?.weeklyWorkouts || 5,
    maxWeight: goals?.maxWeight || 100,
  });

  const [currentStats] = useState({
    todayCalories: 1500,
    weekWorkouts: 3,
  });

  // Fetch goals from database on component mount
  useEffect(() => {
    const fetchGoalsFromDB = async () => {
      if (!token) {
        console.warn("No token available for fetching goals");
        setFetchLoading(false);
        return;
      }

      try {
        console.log("Fetching goals from database...");
        const response = await getGoals(token);
        console.log("Goals fetched successfully:", response.data);
        
        const goalsData = response.data?.goals || response.data;
        
        // Update formData with fetched goals
        setFormData({
          dailyCalories: goalsData.dailyCalories || 2000,
          weeklyWorkouts: goalsData.weeklyWorkouts || 5,
          maxWeight: goalsData.maxWeight || 100,
        });

        // Dispatch to Redux to store goals globally
        dispatch(setReduxGoals({
          dailyCalories: goalsData.dailyCalories || 2000,
          weeklyWorkouts: goalsData.weeklyWorkouts || 5,
          maxWeight: goalsData.maxWeight || 100,
        }));

        setError(null);
      } catch (err) {
        console.error("Error fetching goals:", err);
        console.error("Error response:", err.response?.data);
        setError("Failed to load goals. Using default values.");
        // Use default values on error
        setFormData({
          dailyCalories: 2000,
          weeklyWorkouts: 5,
          maxWeight: 100,
        });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchGoalsFromDB();
  }, [token, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSaveGoals = async () => {
    setLoading(true);
    try {
      console.log("Saving goals:", formData);
      const response = await setGoals(token, formData);
      console.log("Goals saved successfully:", response.data);
      
      dispatch(setReduxGoals(formData));
      setError(null);
      alert("Goals updated successfully!");
    } catch (err) {
      console.error("Error saving goals:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to save goals. Please try again.");
      alert("Failed to save goals");
    }
    setLoading(false);
  };

  const calorieProgress = currentStats.todayCalories / formData.dailyCalories;
  const workoutProgress = currentStats.weekWorkouts / formData.weeklyWorkouts;

  return (
    <Container>
      <Wrapper>
        <Title>Fitness Goals</Title>

        {error && (
          <Card style={{ backgroundColor: "rgba(255, 76, 76, 0.1)", borderColor: "#FF4C4C" }}>
            <div style={{ color: "#FF4C4C", fontSize: "14px" }}>⚠️ {error}</div>
          </Card>
        )}

        {fetchLoading && (
          <Card>
            <div style={{ textAlign: "center", padding: "20px" }}>Loading your goals...</div>
          </Card>
        )}

        {/* Daily Goals */}
        <Card>
          <CardTitle>
            <GpsFixed sx={{ fontSize: "24px", color: "inherit" }} />
            Daily Goals
          </CardTitle>
          
          <GoalRow>
            <ProgressContainer>
              <ProgressLabel>
                <ProgressText>Daily Calorie Burn</ProgressText>
                <ProgressValue>
                  {currentStats.todayCalories} / {formData.dailyCalories} kcal
                </ProgressValue>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill progress={calorieProgress} />
              </ProgressBar>
            </ProgressContainer>
            
            <ProgressContainer>
              <ProgressLabel>
                <ProgressText>Weekly Workouts</ProgressText>
                <ProgressValue>
                  {currentStats.weekWorkouts} / {formData.weeklyWorkouts} days
                </ProgressValue>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill progress={workoutProgress} />
              </ProgressBar>
            </ProgressContainer>
          </GoalRow>
        </Card>

        {/* Set Goals */}
        <Card>
          <CardTitle>
            <TrendingUp sx={{ fontSize: "24px", color: "inherit" }} />
            Set Your Goals
          </CardTitle>

          <GoalRow>
            <TextInput
              label="Daily Calorie Goal (kcal)"
              name="dailyCalories"
              type="number"
              value={formData.dailyCalories}
              handelChange={handleChange}
            />
            <TextInput
              label="Weekly Workout Goal (days)"
              name="weeklyWorkouts"
              type="number"
              value={formData.weeklyWorkouts}
              handelChange={handleChange}
            />
          </GoalRow>

          <TextInput
            label="Max Weight Lift Goal (kg)"
            name="maxWeight"
            type="number"
            value={formData.maxWeight}
            handelChange={handleChange}
          />

          <Button
            text="Save Goals"
            onClick={handleSaveGoals}
            isLoading={loading}
            isDisabled={loading}
          />

          <StatGrid>
            <StatBox>
              <StatLabel>This Week's Progress</StatLabel>
              <StatValue>{(workoutProgress * 100).toFixed(0)}%</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Today's Progress</StatLabel>
              <StatValue>{(calorieProgress * 100).toFixed(0)}%</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Goal Completion</StatLabel>
              <StatValue>
                {(((calorieProgress + workoutProgress) / 2) * 100).toFixed(0)}%
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Consistency Score</StatLabel>
              <StatValue>85/100</StatValue>
            </StatBox>
          </StatGrid>
        </Card>
      </Wrapper>
    </Container>
  );
};

export default Goals;
