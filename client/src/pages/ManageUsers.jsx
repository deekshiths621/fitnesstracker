import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllUsers, updateUser, deleteUserById } from "../api/index.js";

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

const SearchInput = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  width: 300px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 600px) {
    width: 100%;
  }
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

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      
      const response = await getAllUsers(token);
      console.log("Users response:", response);
      
      if (response && response.data && response.data.users) {
        const usersData = response.data.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          status: user.status || "active",
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = currentUser?.token;
        if (!token) {
          setError("No authentication token found");
          return;
        }
        
        await deleteUserById(token, userId);
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    const newName = prompt("Enter new name:", user.name);
    if (newName) {
      updateUserOnServer(userId, { name: newName });
    }
  };

  const updateUserOnServer = async (userId, data) => {
    try {
      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        return;
      }
      
      await updateUser(token, userId, data);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, ...data } : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === userId ? { ...user, ...data } : user
        )
      );
      alert("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const token = currentUser?.token;
      if (!token) {
        setError("No authentication token found");
        return;
      }
      
      const user = users.find((u) => u.id === userId);
      const newStatus = user.status === "active" ? "inactive" : "active";
      
      await updateUser(token, userId, { status: newStatus });
      
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      alert(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error("Error updating user status:", err);
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Manage Users</Title>
          <BackButton onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </BackButton>
        </Header>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <EmptyState>Loading users...</EmptyState>
        ) : (
          <>
            <SearchInput
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <TableContainer>
              {filteredUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Email</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Join Date</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                user.status === "active" ? "#10b981" : "#ef4444",
                              color: "white",
                              fontSize: "12px",
                            }}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <ActionButton
                            color="#3b82f6"
                            onClick={() => handleEditUser(user.id)}
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            color="#8b5cf6"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </ActionButton>
                          <ActionButton
                            color="#ef4444"
                            onClick={() => handleDeleteUser(user.id)}
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
                  {searchTerm ? "No users found matching your search." : "No users found."}
                </EmptyState>
              )}
            </TableContainer>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default ManageUsers;
