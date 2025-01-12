import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TaskCalendar = ({ tasks }) => {
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    const dates = Object.values(tasks).flatMap((task) =>
      task.items.map((item) => item.deadline).filter(Boolean)
    );

    setHighlightedDates(dates);
  }, [tasks]);

  const isHighlighted = (date) => {
    // Check if the given date is in the highlightedDates array
    const formattedDate = date.toISOString().split("T")[0];
    return highlightedDates.includes(formattedDate);
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h2>Task Calendar</h2>
      <Calendar
        tileClassName={({ date }) => (isHighlighted(date) ? "highlight" : null)}
      />
      <style>
        {`
          .highlight {
            background-color: #ffd700 !important;
            border-radius: 50%;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default TaskCalendar;
