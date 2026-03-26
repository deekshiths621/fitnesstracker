import React, { useState } from "react";
import styled from "styled-components";
import { Delete, Edit } from "@mui/icons-material";
import Button from "./Button";
import TextInput from "./TextInput";

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
  position: relative;
  
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.shadowMd};
  padding-top: 12px;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${({ delete: isDelete, theme }) => isDelete ? theme.errorLight : theme.primaryLight};
  color: ${({ delete: isDelete, theme }) => isDelete ? theme.error : theme.primary};
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover {
    background: ${({ delete: isDelete, theme }) => isDelete ? theme.error : theme.primary};
    color: white;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const WorkoutCard = ({ workout, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    workoutName: workout?.workoutName,
    sets: workout?.sets,
    reps: workout?.reps,
    weight: workout?.weight,
    duration: workout?.duration,
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = () => {
    onEdit(workout._id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(workout._id);
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <ModalOverlay onClick={() => setIsEditing(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalTitle>Edit Workout</ModalTitle>
          <FormGrid>
            <TextInput
              label="Exercise Name"
              name="workoutName"
              value={editData.workoutName}
              handelChange={handleEditChange}
            />
            <TextInput
              label="Sets"
              name="sets"
              type="number"
              value={editData.sets}
              handelChange={handleEditChange}
            />
            <TextInput
              label="Reps"
              name="reps"
              type="number"
              value={editData.reps}
              handelChange={handleEditChange}
            />
            <TextInput
              label="Weight (kg)"
              name="weight"
              type="number"
              value={editData.weight}
              handelChange={handleEditChange}
            />
            <TextInput
              label="Duration (min)"
              name="duration"
              type="number"
              value={editData.duration}
              handelChange={handleEditChange}
            />
          </FormGrid>
          <ModalButtons>
            <Button text="Save" onClick={handleSaveEdit} flex />
            <Button text="Cancel" onClick={() => setIsEditing(false)} outlined flex />
          </ModalButtons>
        </Modal>
      </ModalOverlay>
    );
  }

  if (isDeleting) {
    return (
      <ModalOverlay onClick={() => setIsDeleting(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalTitle>Delete Workout?</ModalTitle>
          <div style={{ marginBottom: "20px", color: "#6B7280" }}>
            Are you sure you want to delete "{workout?.workoutName}"? This action cannot be undone.
          </div>
          <ModalButtons>
            <Button
              text="Delete"
              onClick={handleDelete}
              flex
            />
            <Button text="Cancel" onClick={() => setIsDeleting(false)} outlined flex />
          </ModalButtons>
        </Modal>
      </ModalOverlay>
    );
  }

  return (
    <Card>
      <Category>#{workout?.category}</Category>
      <Name>{workout?.workoutName}</Name>
      <Sets>
        {workout?.sets} sets × {workout?.reps} reps
      </Sets>
      <Flex>
        <Details>
          <span>💪</span> {workout?.weight} kg
        </Details>
        <Details>
          <span>⏱️</span> {workout?.duration} min
        </Details>
      </Flex>
      <ActionButtons>
        <ActionBtn onClick={() => setIsEditing(true)}>
          <Edit sx={{ fontSize: "14px" }} /> Edit
        </ActionBtn>
        <ActionBtn delete onClick={() => setIsDeleting(true)}>
          <Delete sx={{ fontSize: "14px" }} /> Delete
        </ActionBtn>
      </ActionButtons>
    </Card>
  );
};

export default WorkoutCard;
