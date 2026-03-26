import React from "react";
import styled from "styled-components";
import { PieChart } from "@mui/x-charts/PieChart";

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

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  & > svg {
    max-width: 100%;
    height: auto;
  }
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const CategoryChart = ({ data }) => {
  const hasCategoryData = data?.pieChartData && data?.pieChartData?.length > 0;

  return (
    <Card>
      <Title>Exercise Categories</Title>
      {hasCategoryData ? (
        <ChartContainer>
          <PieChart
            series={[
              {
                data: data?.pieChartData,
                innerRadius: 30,
                outerRadius: 90,
                paddingAngle: 2,
                cornerRadius: 5,
              },
            ]}
            width={300}
            height={300}
            slotProps={{
              legend: { hidden: false, position: { vertical: 'bottom', horizontal: 'middle' } },
            }}
            margin={{ top: 10, bottom: 40, left: 10, right: 10 }}
          />
        </ChartContainer>
      ) : (
        <EmptyMessage>
          No workout data available. Add workouts to see breakdown by category.
        </EmptyMessage>
      )}
    </Card>
  );
};

export default CategoryChart;
