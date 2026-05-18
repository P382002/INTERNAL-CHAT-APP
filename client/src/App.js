import React, {
  useEffect,
  useState,
} from "react";

import Login from "./components/Login";
import Groups from "./components/Groups";
import Chat from "./components/Chat";
import Admin from "./components/Admin";

function App() {
  const [groups, setGroups] =
    useState([]);

  const [selectedGroup, setSelectedGroup] =
    useState(null);

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // -----------------------------
  // FETCH GROUPS
  // -----------------------------
  const fetchGroups = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/groups"
      );

      const data =
        await res.json();

      setGroups(data);

      // AUTO SELECT FIRST GROUP
      if (
        !selectedGroup &&
        data.length > 0
      ) {
        setSelectedGroup(data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token]);

  // -----------------------------
  // SIDEBAR BUTTON STYLE
  // -----------------------------
  const sidebarButtonStyle = (
    active
  ) => ({
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",

    background: active
      ? "#4f46e5"
      : "transparent",

    color: "white",

    transition: "0.2s",
  });

  // -----------------------------
  // LOGIN
  // -----------------------------
  if (!token) {
    return <Login />;
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f3f4f6",
        fontFamily:
          "Segoe UI, sans-serif",
      }}
    >
      {/* LEFT NAVIGATION */}
      <div
        style={{
          width: "80px",
          background: "#1f2937",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "#4f46e5",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "35px",
          }}
        >
          IC
        </div>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "22px",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* CHATS */}
          <button
            onClick={() =>
              alert("Chats Module")
            }
            style={sidebarButtonStyle(
              true
            )}
            title="Chats"
          >
            💬
          </button>

          {/* TEAMS */}
          <button
            onClick={() =>
              alert(
                "Teams Module Coming Soon"
              )
            }
            style={{
              ...sidebarButtonStyle(
                false
              ),
              opacity: 0.7,
            }}
            title="Teams"
          >
            👥
          </button>

          {/* CALENDAR */}
          <button
            onClick={() =>
              alert(
                "Calendar Module Coming Soon"
              )
            }
            style={{
              ...sidebarButtonStyle(
                false
              ),
              opacity: 0.7,
            }}
            title="Calendar"
          >
            📅
          </button>

          {/* NOTIFICATIONS */}
          <button
            onClick={() =>
              alert(
                "Notifications Module Coming Soon"
              )
            }
            style={{
              ...sidebarButtonStyle(
                false
              ),
              opacity: 0.7,
            }}
            title="Notifications"
          >
            🔔
          </button>

          {/* SETTINGS */}
          <button
            onClick={() =>
              alert(
                "Settings Module Coming Soon"
              )
            }
            style={{
              ...sidebarButtonStyle(
                false
              ),
              opacity: 0.7,
            }}
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        {/* PROFILE */}
        <div
          style={{
            marginTop: "auto",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#6366f1",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      {/* GROUP PANEL */}
      <Groups
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={
          setSelectedGroup
        }
      />

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(to bottom, #eef2ff, #f8fafc)",
        }}
      >
        {/* TOP HEADER */}
        <div
          style={{
            height: "72px",
            background: "white",
            borderBottom:
              "1px solid #ddd",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            padding: "0 25px",
          }}
        >
          {/* LEFT */}
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              {selectedGroup?.name ||
                "Select Group"}
            </h2>

            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "3px",
              }}
            >
              Internal Collaboration
              Platform
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* ONLINE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#16a34a",
                fontWeight: "500",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    "#16a34a",
                }}
              />

              Online
            </div>

            {/* USER */}
            <div
              style={{
                background: "#4f46e5",
                color: "white",
                padding:
                  "8px 14px",
                borderRadius:
                  "999px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {user?.name}
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div style={{ flex: 1 }}>
          <Chat
            key={selectedGroup?._id}
            groupId={
              selectedGroup?._id
            }
            userId={user?._id}
          />
        </div>
      </div>

      {/* ADMIN */}
      {user?.role === "admin" && (
        <Admin />
      )}
    </div>
  );
}

export default App;