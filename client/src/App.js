import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Login from "./components/Login";
import Chat from "./components/Chat";
import Admin from "./components/Admin";
import DirectChat from "./components/DirectChat";
import CalendarPage from "./components/CalendarPage";
import LeaveRequest from "./components/LeaveRequest";
import HRPanel from "./components/HRPanel";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function App() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // =========================
  // NOTIFICATION STATE
  // =========================
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // SHOW NOTIFICATION BANNER
  // =========================
  const showNotification = (message, color = "#4f46e5") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, color }]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // =========================
  // FETCH GROUPS
  // =========================
  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/groups");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data.filter((u) => u._id !== user._id));
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchUsers();
    }
  }, [token]);

  // =========================
  // SOCKET
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("userOnline", user._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("refresh_groups", () => {
      fetchGroups();
    });

    socket.on("receive_message", (msg) => {
      if (selectedGroup?._id !== msg.groupId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.groupId]: (prev[msg.groupId] || 0) + 1,
        }));
      }
    });

    // =========================
    // EMPLOYEE NOTIFICATION
    // =========================
    socket.on("employee-notification", (data) => {
      if (data.employeeId === user._id) {
        showNotification(`🔔 ${data.message}`, "#4f46e5");
      }
    });

    // =========================
    // HR ALERT
    // =========================
    socket.on("hr-alert", (data) => {
      if (user.role === "hr" || user.role === "admin") {
        showNotification(`⚠️ ${data.message}`, "#ef4444");
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("refresh_groups");
      socket.off("receive_message");
      socket.off("employee-notification");
      socket.off("hr-alert");
    };
  }, [user, selectedGroup]);

  // =========================
  // OPEN GROUP
  // =========================
  const openGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    setUnreadCounts((prev) => ({ ...prev, [group._id]: 0 }));
  };

  if (!token) {
    return <Login />;
  }

  // =========================
  // SEARCH FILTER
  // =========================
  let filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  let filteredUsers = users.filter((u) =>
    (u.name || `${u.firstName || ""} ${u.lastName || ""}`)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (activeTab === "groups") filteredUsers = [];
  if (activeTab === "dms") filteredGroups = [];
  if (activeTab === "unread") {
    filteredGroups = filteredGroups.filter((g) => unreadCounts[g._id] > 0);
    filteredUsers = [];
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f3f4f6",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* =========================
          NOTIFICATION BANNERS
      ========================= */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background: n.color,
              color: "white",
              padding: "14px 20px",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              fontSize: "14px",
              fontWeight: "600",
              maxWidth: "360px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              animation: "slideIn 0.3s ease",
            }}
          >
            <span>{n.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) => prev.filter((x) => x.id !== n.id))
              }
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                padding: "2px 8px",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* =========================
          SIDEBAR
      ========================= */}
      <div
        style={{
          width: "75px",
          background: "#1f2937",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "#4f46e5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "35px",
          }}
        >
          IC
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button
            onClick={() => setSidebarTab("chat")}
            style={iconStyle(sidebarTab === "chat")}
          >
            💬
          </button>

          <button
            onClick={() => setSidebarTab("calendar")}
            style={iconStyle(sidebarTab === "calendar")}
          >
            📅
          </button>

          <button
            onClick={() => setSidebarTab("leave")}
            style={iconStyle(sidebarTab === "leave")}
          >
            🏖️
          </button>

          {(user.role === "hr" || user.role === "admin") && (
            <button
              onClick={() => setSidebarTab("hr")}
              style={iconStyle(sidebarTab === "hr")}
            >
              🧑‍💼
            </button>
          )}
        </div>

        <div style={{ marginTop: "auto", marginBottom: "20px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#6366f1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {(user?.firstName || user?.name)?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      {sidebarTab === "calendar" && (
        <div style={{ flex: 1 }}>
          <CalendarPage />
        </div>
      )}

      {/* LEAVE */}
      {sidebarTab === "leave" && (
        <div style={{ flex: 1 }}>
          <LeaveRequest user={user} />
        </div>
      )}

      {/* HR */}
      {sidebarTab === "hr" && (
        <div style={{ flex: 1 }}>
          <HRPanel />
        </div>
      )}

      {/* CHAT */}
      {sidebarTab === "chat" && (
        <>
          {/* LEFT PANEL */}
          <div
            style={{
              width: "360px",
              background: "white",
              borderRight: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "20px", fontSize: "24px", fontWeight: "700" }}>
              Chats
            </div>

            <div style={{ display: "flex", gap: "10px", padding: "0 15px 15px" }}>
              <TabButton
                text="All"
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
              />
              <TabButton
                text="Groups"
                active={activeTab === "groups"}
                onClick={() => setActiveTab("groups")}
              />
              <TabButton
                text="DMs"
                active={activeTab === "dms"}
                onClick={() => setActiveTab("dms")}
              />
            </div>

            <div style={{ padding: "0 15px 15px" }}>
              <input
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredGroups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => openGroup(group)}
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    background:
                      selectedGroup?._id === group._id ? "#eef2ff" : "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{group.name}</span>
                  {unreadCounts[group._id] > 0 && (
                    <span
                      style={{
                        background: "#4f46e5",
                        color: "white",
                        borderRadius: "999px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {unreadCounts[group._id]}
                    </span>
                  )}
                </div>
              ))}

              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setSelectedUser(u);
                    setSelectedGroup(null);
                  }}
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    background:
                      selectedUser?._id === u._id ? "#eef2ff" : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* ONLINE DOT */}
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: onlineUsers.includes(u._id)
                        ? "#22c55e"
                        : "#d1d5db",
                      flexShrink: 0,
                    }}
                  />
                  <span>{u.name || `${u.firstName} ${u.lastName}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex: 1 }}>
            {selectedUser ? (
              <DirectChat currentUser={user} selectedUser={selectedUser} />
            ) : (
              <Chat
                key={selectedGroup?._id}
                groupId={selectedGroup?._id}
                userId={user?._id}
              />
            )}
          </div>
        </>
      )}

      {user?.role === "admin" && <Admin />}
    </div>
  );
}

const iconStyle = (active) => ({
  width: "50px",
  height: "50px",
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  fontSize: "22px",
  background: active ? "#4f46e5" : "transparent",
  color: "white",
});

const TabButton = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: "999px",
      border: "none",
      cursor: "pointer",
      background: active ? "#4f46e5" : "#eef2ff",
      color: active ? "white" : "#374151",
      fontWeight: "600",
    }}
  >
    {text}
  </button>
);

export default App;