import { FitnessCenterRounded, TimelapseRounded } from "@mui/icons-material";
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 14px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 100%);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px ${({ theme }) => theme.shadowMd};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Category = styled.div`
  width: fit-content;
  font-size: 12px;
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  background: ${({ theme }) => theme.primaryLight};
  padding: 6px 12px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const Name = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 700;
  letter-spacing: -0.3px;
`;
const Sets = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  display: flex;
  gap: 6px;
`;
const Flex = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
`;
const Details = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const WorkoutCard = ({ workout }) => {
  return (
    <Card>
      <Category>#{workout?.category}</Category>
      <Name>{workout?.workoutName}</Name>
      <Sets>
        {workout?.sets} sets × {workout?.reps} reps
      </Sets>
      <Flex>
        <Details>
          <FitnessCenterRounded sx={{ fontSize: "18px", color: "inherit" }} />
          {workout?.weight} kg
        </Details>
        <Details>
          <TimelapseRounded sx={{ fontSize: "18px", color: "inherit" }} />
          {workout?.duration} min
        </Details>
      </Flex>
    </Card>
  );
};

export default WorkoutCard;
