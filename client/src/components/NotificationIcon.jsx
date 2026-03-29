import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Notifications, Close } from "@mui/icons-material";
import { getAllNotifications, markNotificationAsSeen } from "../api/index.js";
import { useSelector } from "react-redux";

const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryLight};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.shadowMd};
  border-radius: 12px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadowLg};
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.shadowMd};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownTitle = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.shadowMd};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ isSeen, theme }) => 
    isSeen ? "transparent" : theme.primaryLight};

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  line-height: 1.5;
`;

const EmptyNotification = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
`;

const LoadingSpinner = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
`;

const Container = styled.div`
  position: relative;
`;

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      console.warn("No token available for notifications");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await getAllNotifications(token);
      console.log("Notifications API Response:", response);
      console.log("Response Data:", response.data);
      
      // Handle the response structure
      const notificationsArray = response.data?.notifications || response.data || [];
      const unseenNotifs = response.data?.unseenNotifications || 0;
      console.log("Notifications Array:", notificationsArray);
      console.log("Unseen count:", unseenNotifs);
      
      setNotifications(notificationsArray);
      setUnseenCount(unseenNotifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleNotificationClick = async (notification) => {
    // Mark notification as seen if not already seen
    if (!notification.seenBy.includes(currentUser?.id)) {
      try {
        await markNotificationAsSeen(token, notification._id);
        // Update notification to mark it as seen locally
        const updatedNotifications = notifications.map((notif) =>
          notif._id === notification._id
            ? { ...notif, seenBy: [...notif.seenBy, currentUser?.id] }
            : notif
        );
        setNotifications(updatedNotifications);
        setUnseenCount(Math.max(0, unseenCount - 1));
      } catch (err) {
        console.error("Error marking notification as seen:", err);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // No need to filter again, backend already filters for active status
  const displayNotifications = notifications;

  return (
    <Container>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Notifications sx={{ fontSize: "20px" }} />
        {unseenCount > 0 && (
          <Badge>{unseenCount}</Badge>
        )}
      </IconButton>

      <DropdownContainer isOpen={isOpen}>
        <DropdownHeader>
          <DropdownTitle>Notifications</DropdownTitle>
          <CloseButton onClick={() => setIsOpen(false)}>
            <Close sx={{ fontSize: "18px" }} />
          </CloseButton>
        </DropdownHeader>

        {loading ? (
          <LoadingSpinner>Loading notifications...</LoadingSpinner>
        ) : error ? (
          <EmptyNotification>{error}</EmptyNotification>
        ) : displayNotifications.length === 0 ? (
          <EmptyNotification>No notifications</EmptyNotification>
        ) : (
          displayNotifications.map((notification) => {
            const isSeen = notification.seenBy.includes(currentUser?.id);
            return (
              <NotificationItem 
                key={notification._id}
                isSeen={isSeen}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
              </NotificationItem>
            );
          })
        )}
      </DropdownContainer>
    </Container>
  );
};

export default NotificationIcon;
