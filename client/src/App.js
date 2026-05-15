import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Login from "./components/Login";
import Groups from "./components/Groups";
import Chat from "./components/Chat";
import Admin from "./components/Admin";

const socket = io("http://localhost:5000");

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // --------------------
  // FETCH GROUPS
  // --------------------
  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/groups");

      const data = await res.json();

      setGroups(data);

      // auto-select first group
      if (!selectedGroup && data.length > 0) {
        setSelectedGroup(data[0]);
      }

      // keep selected group updated
      if (selectedGroup) {
        const updated = data.find(
          (g) => g._id === selectedGroup._id
        );

        if (updated) {
          setSelectedGroup(updated);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------
  // INITIAL LOAD
  // --------------------
  useEffect(() => {
    if (!token || !user) return;

    fetchGroups();

    // AUTO REFRESH GROUPS
    const interval = setInterval(fetchGroups, 2000);

    socket.emit("userOnline", user._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      clearInterval(interval);
      socket.off("onlineUsers");
    };
  }, []);

  if (!token) return <Login />;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* SIDEBAR */}
      <Groups
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        onlineUsers={onlineUsers}
      />

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "15px",
            borderBottom: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {selectedGroup?.name || "Select Group"}
          </h2>

          <small>
            {selectedGroup?.members?.length || 0} members •{" "}
            {onlineUsers.length} online
          </small>
        </div>

        {/* CHAT */}
        <Chat
          socket={socket}
          groupId={selectedGroup?._id}
          userId={user?._id}
          userName={user?.name}
        />
      </div>

      {/* ADMIN */}
      {user?.role === "admin" && <Admin />}
    </div>
  );
}

export default App;