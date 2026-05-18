import React from "react";

const Groups = ({
  groups,
  selectedGroup,
  setSelectedGroup,
}) => {
  return (
    <div
      style={{
        width: "320px",
        background: "white",
        borderRight:
          "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          borderBottom:
            "1px solid #eee",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: "15px",
          }}
        >
          Teams
        </h2>

        {/* SEARCH */}
        <input
          placeholder="Search groups..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border:
              "1px solid #ddd",
            outline: "none",
            background:
              "#f9fafb",
            fontSize: "14px",
          }}
        />
      </div>

      {/* GROUP LIST */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        }}
      >
        {groups.map((group) => {
          const isSelected =
            selectedGroup?._id ===
            group._id;

          return (
            <div
              key={group._id}
              onClick={() =>
                setSelectedGroup(
                  group
                )
              }
              style={{
                padding: "14px",
                borderRadius: "16px",
                marginBottom: "12px",
                cursor: "pointer",

                background:
                  isSelected
                    ? "#e0e7ff"
                    : "white",

                border: isSelected
                  ? "1px solid #6366f1"
                  : "1px solid #eee",

                transition: "0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                {/* LEFT */}
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "12px",
                  }}
                >
                  {/* AVATAR */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius:
                        "14px",
                      background:
                        "#4f46e5",
                      color: "white",
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      fontWeight:
                        "bold",
                      fontSize: "18px",
                    }}
                  >
                    {group.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  {/* DETAILS */}
                  <div>
                    <div
                      style={{
                        fontWeight:
                          "bold",
                        fontSize:
                          "15px",
                      }}
                    >
                      {group.name}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#6b7280",
                        marginTop:
                          "3px",
                      }}
                    >
                      {group.members
                        ?.length || 0}{" "}
                      members
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    gap: "6px",
                  }}
                >
                  {/* ONLINE DOT */}
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius:
                        "50%",
                      background:
                        "#22c55e",
                    }}
                  />

                  {/* UNREAD */}
                  <div
                    style={{
                      minWidth: "20px",
                      height: "20px",
                      borderRadius:
                        "999px",
                      background:
                        "#4f46e5",
                      color: "white",
                      fontSize: "11px",
                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      padding:
                        "0 6px",
                    }}
                  >
                    2
                  </div>
                </div>
              </div>

              {/* LAST MESSAGE */}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Start chatting with
                your team...
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Groups;