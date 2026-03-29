import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAllWorkouts,
  createAdminWorkout,
  updateAdminWorkout,
  deleteAdminWorkout,
  getAllUsers,
} from "../api/index.js";
import { workoutCategories, exercisesByCategory } from "../Utils/data";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.primaryDark};
    }
  }
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0px 24px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const BackButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #10b981;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: #059669;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary}40;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  width: 100%;
  max-width: 400px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.background};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary}20;

  &:hover {
    background: ${({ theme }) => theme.background}50;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${({ color, theme }) => color || theme.primary};
  color: white;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary}40;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary}40;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary}40;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.background};
  }
`;

const AdminWorkouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    workoutName: "",
    category: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    caloriesBurned: "",
    date: new Date().toISOString().split("T")[0],
  });
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchWorkouts();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.token]);

  useEffect(() => {
    const filtered = workouts.filter(
      (workout) =>
        workout.workoutName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workout.user?.name && workout.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredWorkouts(filtered);
  }, [searchTerm, workouts]);

  // Update exercises list when category changes
  useEffect(() => {
    if (formData.category) {
      setExercises(exercisesByCategory[formData.category] || []);
    } else {
      setExercises([]);
    }
  }, [formData.category]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await getAllWorkouts(token);
      console.log("Workouts API response:", response);
      
      // Handle the response - axios wraps the response in .data
      let workoutList = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          workoutList = response.data;
        } else if (response.data.workouts && Array.isArray(response.data.workouts)) {
          workoutList = response.data.workouts;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          workoutList = response.data.data;
        }
      }
      
      console.log("Processed workouts:", workoutList);
      setWorkouts(workoutList);
      setFilteredWorkouts(workoutList);
    } catch (err) {
      console.error("Error fetching workouts - Full error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch workouts";
      console.error("Error message:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = currentUser?.token;
      if (!token) return;

      const response = await getAllUsers(token);
      if (response && response.data) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setFormData({
      userId: "",
      workoutName: "",
      category: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      caloriesBurned: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      userId: workout.user._id,
      workoutName: workout.workoutName,
      category: workout.category,
      sets: workout.sets || "",
      reps: workout.reps || "",
      weight: workout.weight || "",
      duration: workout.duration || "",
      caloriesBurned: workout.caloriesBurned || "",
      date: workout.date ? new Date(workout.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleSaveWorkout = async () => {
    try {
      if (!formData.userId || !formData.workoutName || !formData.category) {
        alert("Please fill in required fields: User, Workout Name, Category");
        return;
      }

      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const payload = {
        userId: formData.userId,
        workoutName: formData.workoutName,
        category: formData.category,
        sets: formData.sets ? parseInt(formData.sets) : undefined,
        reps: formData.reps ? parseInt(formData.reps) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : undefined,
        date: formData.date,
      };

      console.log("Payload being sent:", payload);
      console.log("Is editing?:", !!editingWorkout);

      if (editingWorkout) {
        // For updates, don't include userId
        const updatePayload = {
          workoutName: formData.workoutName,
          category: formData.category,
          sets: formData.sets ? parseInt(formData.sets) : undefined,
          reps: formData.reps ? parseInt(formData.reps) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : undefined,
          date: formData.date,
        };
        console.log("Update payload:", updatePayload);
        await updateAdminWorkout(token, editingWorkout._id, updatePayload);
        alert("Workout updated successfully");
      } else {
        console.log("Create payload:", payload);
        await createAdminWorkout(token, payload);
        alert("Workout created successfully");
      }

      setShowModal(false);
      fetchWorkouts();
    } catch (err) {
      console.error("Error saving workout:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to save workout");
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        const token = currentUser?.token;
        if (!token) {
          setError("No authentication token found");
          return;
        }

        await deleteAdminWorkout(token, workoutId);
        setWorkouts(workouts.filter((w) => w._id !== workoutId));
        setFilteredWorkouts(filteredWorkouts.filter((w) => w._id !== workoutId));
        alert("Workout deleted successfully");
      } catch (err) {
        console.error("Error deleting workout:", err);
        alert(err.response?.data?.message || "Failed to delete workout");
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Manage Workouts</Title>
          <div style={{ display: "flex", gap: "12px" }}>
            <AddButton onClick={handleAddWorkout}>+ Add Workout</AddButton>
            <BackButton onClick={() => navigate("/admin/dashboard")}>
              Back to Dashboard
            </BackButton>
          </div>
        </Header>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <SearchInput
          type="text"
          placeholder="Search by workout name, category, or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableContainer>
          {loading ? (
            <EmptyState>Loading workouts...</EmptyState>
          ) : filteredWorkouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Workout Name</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>Duration (min)</TableHeaderCell>
                  <TableHeaderCell>Calories</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredWorkouts.map((workout) => (
                  <TableRow key={workout._id}>
                    <TableCell>{workout.workoutName}</TableCell>
                    <TableCell>{workout.category}</TableCell>
                    <TableCell>{workout.user?.name || "N/A"}</TableCell>
                    <TableCell>{workout.duration || "-"}</TableCell>
                    <TableCell>{workout.caloriesBurned || "-"}</TableCell>
                    <TableCell>
                      {new Date(workout.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ActionButton
                        color="#3b82f6"
                        onClick={() => handleEditWorkout(workout)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        color="#ef4444"
                        onClick={() => handleDeleteWorkout(workout._id)}
                      >
                        Delete
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              {searchTerm ? "No workouts found matching your search." : "No workouts found."}
            </EmptyState>
          )}
        </TableContainer>
      </Wrapper>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              {editingWorkout ? "Edit Workout" : "Add New Workout"}
            </ModalHeader>

            <FormGroup>
              <Label>User *</Label>
              <Select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Category *</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                {workoutCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Workout Name *</Label>
              <Select
                name="workoutName"
                value={formData.workoutName}
                onChange={handleInputChange}
              >
                <option value="">Select workout name</option>
                {exercises.length > 0 ? (
                  exercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))
                ) : (
                  <option value="">Please select a category first</option>
                )}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Sets</Label>
              <Input
                type="number"
                name="sets"
                placeholder="Number of sets"
                value={formData.sets}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Reps</Label>
              <Input
                type="number"
                name="reps"
                placeholder="Number of reps"
                value={formData.reps}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                name="weight"
                placeholder="Weight used"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                name="duration"
                placeholder="Duration in minutes"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </FormGroup>

            {/* <FormGroup>
              <Label>Calories Burned</Label>
              <Input
                type="number"
                name="caloriesBurned"
                placeholder="Calories burned"
                value={formData.caloriesBurned}
                onChange={handleInputChange}
              />
            </FormGroup> */}

            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton onClick={() => setShowModal(false)}>
                Cancel
              </CancelButton>
              <SubmitButton onClick={handleSaveWorkout}>
                {editingWorkout ? "Update" : "Create"} Workout
              </SubmitButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminWorkouts;
