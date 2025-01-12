import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const TaskCalendar = ({ tasks }) => {
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    const dates = Object.values(tasks)
      .flatMap((task) =>
        task.items.map((item) => item.deadline).filter(Boolean)
      )
      .map((date) => new Date(date));

    setHighlightedDates(dates);
  }, [tasks]);

  const isHighlighted = (date) => {
    // Check if the given date is in the highlightedDates array
    return highlightedDates.some(
      (highlightedDate) =>
        highlightedDate.getFullYear() === date.getFullYear() &&
        highlightedDate.getMonth() === date.getMonth() &&
        highlightedDate.getDate() === date.getDate()
    );
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h2>Calendar</h2>
      <Calendar
        tileClassName={({ date }) => {
          if (isHighlighted(date)) {
            return "highlight";
          }
          return null;
        }}
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
