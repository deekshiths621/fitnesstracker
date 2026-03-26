import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import { workoutCategories, exercisesByCategory } from "../Utils/data";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 16px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 18px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-transform: capitalize;
`;

const SelectInput = styled.select`
  padding: 12px 14px;
  border: 1.5px solid ${({ theme }) => theme.shadowMd};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.card};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryLight};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  option {
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    padding: 10px;
  }
`;

const NumericInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid ${({ theme }) => theme.shadowMd};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.card};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryLight};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CaloriesDisplay = styled.div`
  padding: 14px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}15 0%, ${({ theme }) => theme.primary}08 100%);
  border: 1.5px solid ${({ theme }) => theme.primary}40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CaloriesLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
`;

const CaloriesValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const AddWorkout = ({ addNewWorkout, buttonLoading }) => {
  const [category, setCategory] = useState("");
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("0");
  const [duration, setDuration] = useState("10");
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  
  const [exercises, setExercises] = useState([]);

  // Calculate calories whenever weight or duration changes
  useEffect(() => {
    const weightNum = parseFloat(weight) || 0;
    const durationNum = parseFloat(duration) || 0;
    const caloriesBurntPerMinute = 5; // from backend calculation
    const calories = weightNum * durationNum * caloriesBurntPerMinute;
    setCalculatedCalories(Math.round(calories));
  }, [weight, duration]);

  // Update exercises list when category changes
  useEffect(() => {
    if (category) {
      setExercises(exercisesByCategory[category] || []);
      setExercise(""); // Reset exercise when category changes
    } else {
      setExercises([]);
    }
  }, [category]);

  // Format workout data for backend
  const handleAddWorkout = () => {
    if (!category || !exercise) {
      alert("Please select category and exercise");
      return;
    }

    const workoutString = `#${category}
-${exercise}
-${sets} setsX${reps} reps
-${weight} kg
-${duration} min`;

    // Pass the formatted string to parent
    addNewWorkout(workoutString);
    
    // Reset form
    setCategory("");
    setExercise("");
    setSets("3");
    setReps("10");
    setWeight("0");
    setDuration("10");
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      
      <FormGroup>
        <Label>Category *</Label>
        <SelectInput
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {workoutCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </SelectInput>
      </FormGroup>

      <FormGroup>
        <Label>Exercise *</Label>
        <SelectInput
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          disabled={!category}
        >
          <option value="">
            {category ? "Select an exercise" : "Select category first"}
          </option>
          {exercises.map((ex, idx) => (
            <option key={idx} value={ex}>
              {ex}
            </option>
          ))}
        </SelectInput>
      </FormGroup>

      <GridContainer>
        <FormGroup>
          <Label>Sets</Label>
          <NumericInput
            type="number"
            placeholder="3"
            value={sets}
            onChange={(e) => setSets(e.target.value || "0")}
            min="0"
          />
        </FormGroup>
        <FormGroup>
          <Label>Reps</Label>
          <NumericInput
            type="number"
            placeholder="10"
            value={reps}
            onChange={(e) => setReps(e.target.value || "0")}
            min="0"
          />
        </FormGroup>
      </GridContainer>

      <GridContainer>
        <FormGroup>
          <Label>Weight (kg)</Label>
          <NumericInput
            type="number"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value || "0")}
            min="0"
            step="0.5"
          />
        </FormGroup>
        <FormGroup>
          <Label>Duration (min)</Label>
          <NumericInput
            type="number"
            placeholder="10"
            value={duration}
            onChange={(e) => setDuration(e.target.value || "0")}
            min="0"
          />
        </FormGroup>
      </GridContainer>

      <Button
        text="Add Workout"
        onClick={() => handleAddWorkout()}
        isLoading={buttonLoading}
        isDisabled={buttonLoading || !category || !exercise}
        full
      />
    </Card>
  );
};

export default AddWorkout;
