// src/components/Toast.jsx
export default function Toast({ notification }) {
  if (!notification) return null;

  return (
    <div className="toast-container">
      <div className="toast">{notification.text}</div>
    </div>
  );
}
