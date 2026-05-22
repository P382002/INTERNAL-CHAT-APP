import React, {
  useEffect,
  useRef,
  useState,
} from "react";

function DirectChat({
  currentUser,
  selectedUser,
}) {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const messagesEndRef =
    useRef(null);

  // ======================
  // FORMAT TIME
  // ======================
  const formatTime = (date) => {
    return new Date(
      date
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================
  // AUTO SCROLL
  // ======================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [messages]);

  // ======================
  // SEND MESSAGE
  // ======================
  const sendMessage = () => {
    if (
      !message.trim()
    )
      return;

    const newMessage = {
      id: Date.now(),

      text: message,

      sender:
        currentUser._id,

      createdAt:
        new Date(),
    };

    setMessages(
      (prev) => [
        ...prev,
        newMessage,
      ]
    );

    setMessage("");
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection:
          "column",
        background:
          "#f5f7fb",
      }}
    >
      {/* ====================== */}
      {/* MESSAGES */}
      {/* ====================== */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "25px",
        }}
      >
        {messages.map((msg) => {
          const isMine =
            msg.sender ===
            currentUser._id;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent:
                  isMine
                    ? "flex-end"
                    : "flex-start",
                marginBottom:
                  "18px",
              }}
            >
              <div
                style={{
                  maxWidth:
                    "70%",
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  alignItems:
                    isMine
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {!isMine && (
                  <div
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#6b7280",
                      marginBottom:
                        "5px",
                      marginLeft:
                        "6px",
                    }}
                  >
                    {selectedUser.name ||
                      `${selectedUser.firstName} ${selectedUser.lastName}`}
                  </div>
                )}

                {/* BUBBLE */}
                <div
                  style={{
                    background:
                      isMine
                        ? "#4f46e5"
                        : "white",

                    color:
                      isMine
                        ? "white"
                        : "#111827",

                    padding:
                      "12px 16px",

                    borderRadius:
                      isMine
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",

                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.08)",

                    wordBreak:
                      "break-word",
                  }}
                >
                  {msg.text}
                </div>

                {/* TIME */}
                <div
                  style={{
                    fontSize:
                      "11px",

                    color:
                      "#9ca3af",

                    marginTop:
                      "5px",

                    padding:
                      "0 6px",
                  }}
                >
                  {formatTime(
                    msg.createdAt
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div
          ref={
            messagesEndRef
          }
        />
      </div>

      {/* ====================== */}
      {/* INPUT */}
      {/* ====================== */}
      <div
        style={{
          padding: "18px",
          background:
            "white",
          borderTop:
            "1px solid #ddd",

          display: "flex",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder={`Message ${
            selectedUser.name ||
            selectedUser.firstName
          }`}
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key ===
              "Enter"
            ) {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding:
              "14px 16px",

            borderRadius:
              "14px",

            border:
              "1px solid #d1d5db",

            outline:
              "none",

            fontSize:
              "15px",
          }}
        />

        <button
          onClick={
            sendMessage
          }
          style={{
            padding:
              "0 24px",

            border:
              "none",

            borderRadius:
              "14px",

            background:
              "#4f46e5",

            color:
              "white",

            fontWeight:
              "600",

            cursor:
              "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default DirectChat;