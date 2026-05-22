import React, { useEffect, useState } from "react";

function EmployeeStats({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/leave/stats/${user._id}`
    )
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [user]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Stats</h2>

      <p>Total Leaves: {stats.totalLeaves}</p>

      <p>Used Leaves: {stats.usedLeaves}</p>

      <p>
        Remaining Leaves: {stats.remainingLeaves}
      </p>

      <p>Total WFH: {stats.totalWFH}</p>

      <p>Monthly WFH: {stats.monthlyWFH}</p>

      {stats.monthlyWFH === 3 && (
        <div style={{ color: "orange" }}>
          Warning: One more WFH will notify HR.
        </div>
      )}

      {stats.monthlyWFH > 3 && (
        <div style={{ color: "red" }}>
          WFH limit exceeded.
        </div>
      )}
    </div>
  );
}

export default EmployeeStats;