import React from "react";

const Groups = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  onlineUsers,
}) => {
  return (
    <div
      style={{
        width: "280px",
        background: "#202123",
        color: "#fff",
        padding: "15px",
        overflowY: "auto",
      }}
    >
      <h2>Teams</h2>

      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => setSelectedGroup(group)}
          style={{
            padding: "12px",
            marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "8px",
            background:
              selectedGroup?._id === group._id
                ? "#343541"
                : "transparent",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            {group.name}
          </div>

          <small>
            {onlineUsers.length} online • {group.members?.length || 0} members
          </small>
        </div>
      ))}
    </div>
  );
};

export default Groups;