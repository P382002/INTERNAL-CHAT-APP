import React from "react";

function CalendarPage() {
  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>
        Company Calendar
      </h1>

      <div
        style={{
          marginTop: "20px",
          background:
            "white",
          padding: "25px",
          borderRadius:
            "12px",
        }}
      >
        <h3>
          Upcoming Events
        </h3>

        <ul>
          <li>
            Team Meeting -
            Monday
          </li>

          <li>
            Sprint Review -
            Wednesday
          </li>

          <li>
            Company Holiday -
            Friday
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CalendarPage;