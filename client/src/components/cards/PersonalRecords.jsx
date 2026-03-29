import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EmojiEvents } from "@mui/icons-material";
import { getPersonalRecords } from "../../api/index.js";
import { useSelector } from "react-redux";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 16px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 100%);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px ${({ theme }) => theme.shadowMd};
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.5px;
`;

const PRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PRItem = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.bgLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.shadowMd};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary}15;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExerciseName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const ExerciseDetails = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const PRValue = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  padding: 20px 0;
`;

const ErrorText = styled.div`
  text-align: center;
  color: #e74c3c;
  font-size: 14px;
  padding: 20px 0;
`;

const EmptyText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  padding: 20px 0;
  font-style: italic;
`;

const PersonalRecords = ({ data }) => {
  const [personalRecords, setPersonalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  useEffect(() => {
    const fetchPersonalRecords = async () => {
      if (!token) {
        console.warn("No token available for personal records");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching personal records with token:", token.substring(0, 20) + "...");
        const response = await getPersonalRecords(token);
        console.log("Personal Records Response:", response);
        console.log("Response Data:", response.data);
        
        const records = response.data?.personalRecords || [];
        console.log("Records fetched:", records);
        setPersonalRecords(records.slice(0, 5)); // Show top 5 PRs
      } catch (err) {
        console.error("Error fetching personal records:", err);
        console.error("Error message:", err.message);
        console.error("Error response:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load personal records");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalRecords();
  }, [token]);

  return (
    <Card>
      <Title>
        <EmojiEvents sx={{ fontSize: "22px", color: "inherit" }} />
        Personal Records
      </Title>
      <PRList>
        {loading ? (
          <LoadingText>Loading records...</LoadingText>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : personalRecords.length === 0 ? (
          <EmptyText>No personal records yet. Start working out!</EmptyText>
        ) : (
          personalRecords.map((pr, idx) => (
            <PRItem key={idx}>
              <ExerciseInfo>
                <ExerciseName>{pr.workoutName}</ExerciseName>
                <ExerciseDetails>
                  {pr.category} • {pr.totalWorkouts} {pr.totalWorkouts === 1 ? "workout" : "workouts"}
                </ExerciseDetails>
              </ExerciseInfo>
              <PRValue>{pr.maxWeight} kg</PRValue>
            </PRItem>
          ))
        )}
      </PRList>
    </Card>
  );
};

export default PersonalRecords;
