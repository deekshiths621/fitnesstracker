import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 16px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  background: linear-gradient(135deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 100%);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px ${({ theme }) => theme.shadowMd};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 600px) {
    gap: 6px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
const Value = styled.div`
  font-weight: 700;
  font-size: 36px;
  display: flex;
  align-items: end;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 26px;
  }
`;
const Unit = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Span = styled.div`
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  @media (max-width: 600px) {
    font-size: 12px;
  }

  ${({ positive, theme }) =>
    positive
      ? `
  color: ${theme.success};`
      : `
  color: ${theme.error};`}
`;
const Icon = styled.div`
  height: fit-content;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 28px;
  transition: all 0.3s ease;
  ${({ color, bg }) => `
  background: ${bg};
  color: ${color};
  `}
`;

const Desc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_tertiary};
  margin-bottom: 0;
  @media (max-width: 600px) {
    font-size: 11px;
  }
`;

const CountsCard = ({ item, data }) => {
  return (
    <Card>
      <Left>
        <Title>{item.name}</Title>
        <Value>
          {data && data[item.key].toFixed(2)}
          <Unit>{item.unit}</Unit>
          <Span positive={true}>(+10%)</Span>
        </Value>
        <Desc>{item.desc}</Desc>
      </Left>
      <Icon color={item.color} bg={item.lightColor}>
        {item.icon}
      </Icon>
    </Card>
  );
};

export default CountsCard;
