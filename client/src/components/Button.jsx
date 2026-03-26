import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Button = styled.div`
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: min-content;
  padding: 14px 28px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadowMd};
  border: 1.5px solid ${({ theme }) => theme.primary};
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primaryDark} 100%);
  
  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 13px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.shadowLg};
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
  }

  ${({ type, theme }) =>
    type === "secondary"
      ? `
      background: linear-gradient(135deg, ${theme.secondary} 0%, ${theme.purple} 100%);
      border-color: ${theme.secondary};
      `
      : ``}

  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
    `}
    
  ${({ isLoading }) =>
    isLoading &&
    `
    opacity: 0.8;
    cursor: not-allowed;
  `}
  
  ${({ flex }) =>
    flex &&
    `
    flex: 1;
  `}

  ${({ small }) =>
    small &&
    `
    padding: 12px 24px;
    font-size: 14px;
  `}
  
  ${({ outlined, theme }) =>
    outlined &&
    `
    background: transparent;
    color: ${theme.primary};
    box-shadow: none;
    border: 2px solid ${theme.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.primaryLight};
      color: ${theme.primary};
    }
  `}
  
  ${({ full }) =>
    full &&
    `
    width: 100%;
  `}
`;

const button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  return (
    <Button
      onClick={() => !isDisabled && !isLoading && onClick()}
      isDisabled={isDisabled}
      type={type}
      isLoading={isLoading}
      flex={flex}
      small={small}
      outlined={outlined}
      full={full}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </Button>
  );
};

export default button;
