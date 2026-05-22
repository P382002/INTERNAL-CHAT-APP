import React, {
  useEffect,
  useState,
} from "react";

function HRPanel() {
  const [requests, setRequests] =
    useState([]);

  // ======================
  // LOAD REQUESTS
  // ======================
  const loadRequests =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/leave/all"
          );

        const data =
          await res.json();

        setRequests(data);
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    loadRequests();

    // AUTO REFRESH
    const interval =
      setInterval(() => {
        loadRequests();
      }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  // ======================
  // UPDATE STATUS
  // ======================
  const updateStatus =
    async (id, status) => {
      try {
        const res =
          await fetch(
            `http://localhost:5000/api/leave/update/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status,
              }),
            }
          );

        const data =
          await res.json();

        if (data.success) {
          loadRequests();
        }
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div
      style={{
        padding: "25px",
        height: "100vh",
        overflowY: "auto",
        background: "#f3f4f6",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        HR Leave Requests
      </h2>

      {requests.length ===
      0 ? (
        <div>
          No leave requests
        </div>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            style={{
              background: "white",

              padding: "20px",

              borderRadius:
                "14px",

              marginBottom:
                "18px",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* EMPLOYEE */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              Employee:{" "}
              {req.employeeId
                ?.name ||
                `${req.employeeId?.firstName || ""} ${req.employeeId?.lastName || ""}`}
            </div>

            {/* TYPE */}
            <div
              style={{
                marginBottom:
                  "8px",
              }}
            >
              <b>Type:</b>{" "}
              {req.type}
            </div>

            {/* REASON */}
            <div
              style={{
                marginBottom:
                  "8px",
              }}
            >
              <b>Reason:</b>{" "}
              {req.reason}
            </div>

            {/* DATES */}
            <div
              style={{
                marginBottom:
                  "8px",
              }}
            >
              <b>From:</b>{" "}
              {new Date(
                req.fromDate
              ).toLocaleDateString()}
            </div>

            <div
              style={{
                marginBottom:
                  "8px",
              }}
            >
              <b>To:</b>{" "}
              {new Date(
                req.toDate
              ).toLocaleDateString()}
            </div>

            {/* STATUS */}
            <div
              style={{
                marginBottom:
                  "15px",
              }}
            >
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    req.status ===
                    "APPROVED"
                      ? "#10b981"
                      : req.status ===
                        "REJECTED"
                      ? "#ef4444"
                      : "#f59e0b",

                  fontWeight:
                    "700",
                }}
              >
                {req.status}
              </span>
            </div>

            {/* BUTTONS */}
            {req.status ===
              "PENDING" && (
              <div
                style={{
                  display:
                    "flex",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() =>
                    updateStatus(
                      req._id,
                      "APPROVED"
                    )
                  }
                  style={{
                    background:
                      "#10b981",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px 18px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "600",
                  }}
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      req._id,
                      "REJECTED"
                    )
                  }
                  style={{
                    background:
                      "#ef4444",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px 18px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "600",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default HRPanel;