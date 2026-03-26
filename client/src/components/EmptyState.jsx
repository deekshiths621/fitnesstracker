import React from "react";
import styled from "styled-components";
import { FitnessCenterRounded } from "@mui/icons-material";

const EmptyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 60px 24px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  color: ${({ theme }) => theme.primary}40;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const EmptyTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const EmptyMessage = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 400px;
`;

const EmptyState = ({ title = "No Workouts Yet", message = "Start your fitness journey by adding your first workout!" }) => {
  return (
    <EmptyContainer>
      <EmptyIcon>
        <FitnessCenterRounded sx={{ fontSize: "inherit" }} />
      </EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyMessage>{message}</EmptyMessage>
    </EmptyContainer>
  );
};

export default EmptyState;
