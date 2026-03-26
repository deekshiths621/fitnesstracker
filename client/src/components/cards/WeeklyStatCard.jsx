import React from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

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
  letter-spacing: -0.5px;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const WeeklyStatCard = ({ data }) => {
  return (
    <Card>
      <Title>Weekly Calories Burned</Title>
      {data?.totalWeeksCaloriesBurnt && (
        <BarChart
          xAxis={[
            { scaleType: "band", data: data?.totalWeeksCaloriesBurnt?.weeks },
          ]}
          series={[{ data: data?.totalWeeksCaloriesBurnt?.caloriesBurned }]}
          height={300}
        />
      )}
    </Card>
  );
};

export default WeeklyStatCard;
