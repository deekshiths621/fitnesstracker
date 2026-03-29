import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../api";

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ primary, theme }) => (primary ? theme.primary : "transparent")};
  color: ${({ primary, theme }) => (primary ? "white" : theme.primary)};
  border: ${({ primary, theme }) =>
    primary ? "none" : `2px solid ${theme.primary}`};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ primary, theme }) =>
      primary ? theme.primaryDark : theme.primary};
    color: white;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationItem = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  border-left: 4px solid ${({ theme, status }) =>
    status === "active" ? theme.primary : "#ef4444"};
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const NotificationDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const NotificationMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${({ color }) => color};
  color: white;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }
`;

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = localStorage.getItem("fittrack-app-token");
  
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      if (!token) return;
      const response = await getAllNotifications(token);
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNotification = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createNotification(token, formData);
      setFormData({ title: "", message: "" });
      setShowModal(false);
      alert("Notification created successfully");
      fetchNotifications();
    } catch (error) {
      alert("Failed to create notification");
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(token, id);
        fetchNotifications();
      } catch (error) {
        alert("Failed to delete notification");
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateNotification(token, id, { status: newStatus });
      fetchNotifications();
    } catch (error) {
      alert("Failed to update notification");
      console.error(error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Manage Notifications</Title>
          <ButtonGroup>
            <Button primary onClick={() => setShowModal(true)}>
              + Create Notification
            </Button>
            <Button onClick={() => navigate("/admin/dashboard")}>
              Back to Dashboard
            </Button>
          </ButtonGroup>
        </Header>

        <NotificationsList>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationItem key={notif._id} status={notif.status}>
                <NotificationContent>
                  <NotificationTitle>{notif.title}</NotificationTitle>
                  <NotificationDescription>{notif.message}</NotificationDescription>
                  <NotificationMeta>
                    📅 {new Date(notif.createdAt).toLocaleDateString()} • Status: {notif.status}
                  </NotificationMeta>
                </NotificationContent>
                <ActionButtons>
                  <ActionButton
                    color="#8b5cf6"
                    onClick={() => handleToggleStatus(notif._id, notif.status)}
                  >
                    {notif.status === "active" ? "Deactivate" : "Activate"}
                  </ActionButton>
                  <ActionButton
                    color="#ef4444"
                    onClick={() => handleDeleteNotification(notif._id)}
                  >
                    Delete
                  </ActionButton>
                </ActionButtons>
              </NotificationItem>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "${({ theme }) => theme.text_secondary}" }}>
              No notifications yet. Create one to get started!
            </div>
          )}
        </NotificationsList>
      </Wrapper>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Notification</ModalTitle>

            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter notification title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <TextArea
                name="message"
                placeholder="Enter notification message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </FormGroup>

            <ModalButtons>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button primary onClick={handleCreateNotification}>
                Create
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminNotifications;
