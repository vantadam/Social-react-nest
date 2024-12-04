import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './notifications.css';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get('http://localhost:3500/notifications/' + userId)
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching notifications:', error);
      });
  }, [userId]);

  // Helper function to create custom messages based on notification type
  const getNotificationMessage = (type, user) => {
    switch (type) {
      case 'like':
        return `${user.username} liked your post!`;
      case 'comment':
        return `${user.username} commented on your post!`;
      case 'follow':
        return `${user.username} started following you!`;
      default:
        return 'You have a new notification!';
    }
  };

  // Function to calculate the relative time (time ago)
  const timeAgo = (createdDate) => {
    const now = Date.now();
    const postDate = new Date(createdDate).getTime();

    if (isNaN(postDate) || postDate > now) return "just now";

    const difference = now - postDate;
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleMarkAsRead = (id) => {
    axios.patch(`http://localhost:3500/notifications/mark-as-read/${id}`)
      .then(response => {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
      })
      .catch(error => {
        console.error('There was an error marking the notification as read:', error);
      });
  };

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id} style={{ backgroundColor: notification.isRead ? 'lightgrey' : 'white' }}>
              <div>
                <strong>{getNotificationMessage(notification.type, notification.user)}</strong>
                <br />
                <span>{timeAgo(notification.createdAt)}</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center',marginTop:-10}}>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={notification.isRead}
                  style={{ backgroundColor: notification.isRead ? 'grey' : '#5046e5', color: 'white' }}
                >
                  {notification.isRead ? 'Read' : 'Mark as Read'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
