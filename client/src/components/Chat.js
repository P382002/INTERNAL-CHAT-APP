import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

const socket = io(
  "http://localhost:5000",
  {
    transports: ["websocket"],
  }
);

const Chat = ({
  groupId,
  userId,
}) => {
  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const fileInputRef =
    useRef(null);

  // -----------------------------
  // LOAD + SOCKET JOIN
  // -----------------------------
  useEffect(() => {
    if (!groupId) return;

    setMessages([]);

    // LOAD OLD MESSAGES
    const loadMessages =
      async () => {
        try {
          const res =
            await fetch(
              `http://localhost:5000/api/messages/${groupId}`
            );

          if (!res.ok) return;

          const data =
            await res.json();

          setMessages(data);
        } catch (err) {
          console.error(
            "Fetch messages error:",
            err
          );
        }
      };

    loadMessages();

    // JOIN ROOM
    socket.emit(
      "join_group",
      groupId
    );

    socket.off(
      "receive_message"
    );

    socket.on(
      "receive_message",
      (msg) => {
        if (
          msg.groupId ===
          groupId
        ) {
          setMessages((prev) => [
            ...prev,
            msg,
          ]);
        }
      }
    );

    return () => {
      socket.off(
        "receive_message"
      );
    };
  }, [groupId]);

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage = () => {
    if (
      !text.trim() ||
      !groupId
    )
      return;

    socket.emit(
      "send_message",
      {
        groupId,
        userId,
        text,
      }
    );

    setText("");
  };

  // -----------------------------
  // FILE PICKER
  // -----------------------------
  const openFilePicker =
    () => {
      fileInputRef.current.click();
    };

  // -----------------------------
  // FILE SELECT
  // -----------------------------
  const handleFileSelect =
    (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      alert(
        `Selected File: ${file.name}`
      );

      // FUTURE:
      // upload file to backend
    };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div
      style={{
        display: "flex",
        flexDirection:
          "column",
        height: "100%",
      }}
    >
      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection:
            "column",
          gap: "14px",
        }}
      >
        {messages.map((m) => {
          const isMine =
            m.userId ===
            userId;

          return (
            <div
              key={
                m._id ||
                Math.random()
              }
              style={{
                display: "flex",
                justifyContent:
                  isMine
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding:
                    "12px 16px",
                  borderRadius:
                    "18px",

                  background:
                    isMine
                      ? "#4f46e5"
                      : "white",

                  color: isMine
                    ? "white"
                    : "#111827",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {!isMine && (
                  <div
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "600",
                      marginBottom:
                        "5px",
                      color:
                        "#6366f1",
                    }}
                  >
                    {m.userName}
                  </div>
                )}

                <div>
                  {m.text}
                </div>

                <div
                  style={{
                    fontSize:
                      "11px",
                    marginTop:
                      "6px",
                    opacity: 0.7,
                    textAlign:
                      "right",
                  }}
                >
                  {new Date(
                    m.createdAt
                  ).toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT AREA */}
      <div
        style={{
          padding: "15px",
          borderTop:
            "1px solid #ddd",
          background:
            "white",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* FILE BUTTON */}
        <button
          onClick={
            openFilePicker
          }
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            border: "none",
            background:
              "#eef2ff",
            cursor: "pointer",
            fontSize: "18px",
          }}
          title="Attach File"
        >
          📎
        </button>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          style={{
            display: "none",
          }}
          onChange={
            handleFileSelect
          }
        />

        {/* MESSAGE INPUT */}
        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding:
              "14px 18px",
            borderRadius:
              "14px",
            border:
              "1px solid #d1d5db",
            outline: "none",
            fontSize: "15px",
          }}
          onKeyDown={(e) => {
            if (
              e.key ===
              "Enter"
            ) {
              sendMessage();
            }
          }}
        />

        {/* SEND */}
        <button
          onClick={
            sendMessage
          }
          style={{
            background:
              "#4f46e5",
            color: "white",
            border: "none",
            padding:
              "12px 22px",
            borderRadius:
              "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;