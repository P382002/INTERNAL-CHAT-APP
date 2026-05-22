import React, {
  useEffect,
  useState,
} from "react";

function LeaveRequest({
  user,
}) {
  const [type, setType] =
    useState("LEAVE");

  const [reason, setReason] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [stats, setStats] =
    useState(null);

  // ======================
  // LOAD STATS
  // ======================
  const loadStats =
    async () => {
      try {
        const res =
          await fetch(
            `http://localhost:5000/api/leave/stats/${user._id}`
          );

        const data =
          await res.json();

        setStats(data);
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    loadStats();
  }, []);

  // ======================
  // SUBMIT REQUEST
  // ======================
  const submitRequest =
    async () => {
      const response =
        await fetch(
          "http://localhost:5000/api/leave/request",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                employeeId:
                  user._id,

                type,

                reason,

                fromDate,

                toDate,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (data.success) {
        alert(
          "Request submitted"
        );

        setReason("");
        setFromDate("");
        setToDate("");

        loadStats();
      }
    };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        padding: "30px",
        background:
          "#f3f4f6",
      }}
    >
      <h1
        style={{
          marginBottom:
            "25px",
        }}
      >
        Leave & WFH Portal
      </h1>

      {/* STATS */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",

            gap: "20px",

            marginBottom:
              "30px",
          }}
        >
          <Card
            title="Remaining Leaves"
            value={
              stats.remainingLeaves
            }
          />

          <Card
            title="Used Leaves"
            value={
              stats.usedLeaves
            }
          />

          <Card
            title="Approved WFH"
            value={
              stats.approvedWFH
            }
          />
        </div>
      )}

      {/* FORM */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          maxWidth: "700px",
        }}
      >
        <h2>
          Request Leave / WFH
        </h2>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            Request Type
          </label>

          <br />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="LEAVE">
              Leave
            </option>

            <option value="WFH">
              WFH
            </option>
          </select>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            Reason
          </label>

          <br />

          <textarea
            placeholder="Reason"
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              height: "120px",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            From Date
          </label>

          <br />

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            To Date
          </label>

          <br />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <button
          onClick={
            submitRequest
          }
          style={{
            marginTop: "25px",
            background:
              "#4f46e5",
            color: "white",
            border: "none",
            padding:
              "12px 25px",
            borderRadius:
              "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

// ======================
// CARD
// ======================
function Card({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "34px",
          fontWeight: "700",
          marginTop: "10px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

export default LeaveRequest;