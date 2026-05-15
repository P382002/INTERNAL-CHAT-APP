import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Chat = ({ groupId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  // -----------------------------
  // AUTO SCROLL
  // -----------------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // -----------------------------
  // LOAD MESSAGES
  // -----------------------------
  useEffect(() => {
    if (!groupId) return;

    setMessages([]);

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${groupId}`
        );

        const data = await res.json();

        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadMessages();

    socket.emit("join_group", groupId);

    socket.off("receive_message");

    socket.on("receive_message", (msg) => {
      if (msg.groupId === groupId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [groupId]);

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send_message", {
      groupId,
      userId,
      text,
    });

    setText("");
  };

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!groupId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          color: "#777",
        }}
      >
        Select a group to start chatting
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#f5f7fb",
      }}
    >
      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {messages.map((m, index) => {
          const isMine = String(m.userId) === String(userId);

          return (
            <div
              key={m._id || index}
              style={{
                display: "flex",
                justifyContent: isMine
                  ? "flex-end"
                  : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  background: isMine
                    ? "#4f46e5"
                    : "#ffffff",
                  color: isMine
                    ? "white"
                    : "black",
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                {!isMine && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                      color: "#555",
                    }}
                  >
                    {m.userName}
                  </div>
                )}

                <div>{m.text}</div>

                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "5px",
                    textAlign: "right",
                    opacity: 0.7,
                  }}
                >
                  {new Date(
                    m.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          padding: "15px",
          borderTop: "1px solid #ddd",
          background: "white",
        }}
      >
        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;