import { useEffect, useState } from "react";
import api from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await api.put("/notifications/read-all");
    fetchNotifications();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Notifications</h2>
        <button onClick={markAllAsRead}>Mark all as read</button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li key={n._id} className={n.isRead ? "read" : "unread"} onClick={() => !n.isRead && markAsRead(n._id)}>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
