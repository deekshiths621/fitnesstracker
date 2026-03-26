import { CloseRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  padding: 0px 4px;
  text-transform: capitalize;
  ${({ error, theme }) =>
    error &&
    `
    color: ${theme.error};
  `}
  ${({ small }) =>
    small &&
    `
    font-size: 11px;
  `}
  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  `}
`;

const OutlinedInput = styled.div`
  border-radius: 10px;
  border: 1.5px solid ${({ theme }) => theme.shadowMd};
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  outline: none;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.card};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryLight};
  }
  
  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.error};
    background-color: ${theme.errorLight};
    
    &:focus-within {
      box-shadow: 0 0 0 3px ${theme.errorLight};
    }
  `}

  ${({ chipableInput, height, theme }) =>
    chipableInput &&
    `
    background: ${theme.card};
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-height: ${height}
  `}

  ${({ small }) =>
    small &&
    `
    border-radius: 8px;
    padding: 10px 12px;
  `}

  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  border: 1.5px solid ${theme.popup_text_secondary + 60};
  background: ${theme.popup};
  `}
`;

const Input = styled.input`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text_primary};
  
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
  
  &:focus {
    outline: none;
  }
  
  ${({ small }) =>
    small &&
    `
    font-size: 12px;
  `}

  ${({ popup, theme }) =>
    popup &&
    `
  color: ${theme.popup_text_secondary};
  `}
`;

const Error = styled.p`
  font-size: 12px;
  margin: 0px 4px;
  color: ${({ theme }) => theme.error};
  font-weight: 500;
  ${({ small }) =>
    small &&
    `
    font-size: 10px;
  `}
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

const Chip = styled.div`
  padding: 6px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.primaryLight};
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const TextInput = ({
  label,
  placeholder,
  name,
  value,
  error,
  handelChange,
  textArea,
  rows,
  columns,
  chipableInput,
  chipableArray,
  removeChip,
  height,
  small,
  popup,
  password,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container small={small}>
      <Label small={small} popup={popup} error={error}>
        {label}
      </Label>
      <OutlinedInput
        small={small}
        popup={popup}
        error={error}
        chipableInput={chipableInput}
        height={height}
      >
        {chipableInput ? (
          <ChipWrapper>
            {chipableArray.map((chip, index) => (
              <Chip key={index}>
                <span>{chip}</span>
                <CloseRounded
                  sx={{ fontSize: "14px" }}
                  onClick={() => removeChip(name, index)}
                />
              </Chip>
            ))}
            <Input
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={(e) => handelChange(e)}
            />
          </ChipWrapper>
        ) : (
          <>
            <Input
              popup={popup}
              small={small}
              as={textArea ? "textarea" : "input"}
              name={name}
              rows={rows}
              columns={columns}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handelChange(e)}
              type={password && !showPassword ? "password" : type}
            />
            {password && (
              <>
                {showPassword ? (
                  <>
                    <Visibility onClick={() => setShowPassword(false)} />
                  </>
                ) : (
                  <>
                    <VisibilityOff onClick={() => setShowPassword(true)} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </OutlinedInput>
      {error && (
        <Error small={small} popup={popup}>
          {error}
        </Error>
      )}
    </Container>
  );
};

export default TextInput;
