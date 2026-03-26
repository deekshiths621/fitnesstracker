import React from "react";
import styled from "styled-components";
import { EmojiEvents } from "@mui/icons-material";

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

const ExerciseName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const PRValue = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const PersonalRecords = ({ data }) => {
  const personalRecords = [
    { name: "Bench Press", weight: "100 kg", date: "2024-03-20" },
    { name: "Squat", weight: "150 kg", date: "2024-03-18" },
    { name: "Deadlift", weight: "200 kg", date: "2024-03-15" },
    { name: "Lat Pulldown", weight: "120 kg", date: "2024-03-10" },
  ];

  return (
    <Card>
      <Title>
        <EmojiEvents sx={{ fontSize: "22px", color: "inherit" }} />
        Personal Records
      </Title>
      <PRList>
        {personalRecords.map((pr, idx) => (
          <PRItem key={idx}>
            <ExerciseName>{pr.name}</ExerciseName>
            <PRValue>{pr.weight}</PRValue>
          </PRItem>
        ))}
      </PRList>
    </Card>
  );
};

export default PersonalRecords;
