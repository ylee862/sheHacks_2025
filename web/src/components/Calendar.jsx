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
    return highlightedDates.some(
      (highlightedDate) =>
        highlightedDate.getFullYear() === date.getFullYear() &&
        highlightedDate.getMonth() === date.getMonth() &&
        highlightedDate.getDate() === date.getDate()
    );
  };

  return (
    <div style={{ margin: "2rem", padding: "1rem", textAlign: "center" }}>
      <h2 style={{ marginBottom: "1rem", color: "#0077cc", fontWeight: "bold" }}>
        Task Calendar
      </h2>
      <Calendar
        tileClassName={({ date }) => {
          if (isHighlighted(date)) {
            return "highlight";
          }
          return "default-tile";
        }}
      />
      <style>
        {`
          .react-calendar {
            background-color: #e3f2fd; /* Light blue background */
            border: 1px solid #90caf9; /* Light blue border */
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 1rem;
          }

          .react-calendar__navigation button {
            color: #0077cc;
            font-weight: bold;
            background: none;
            border: none;
            padding: 0.5rem;
            margin: 0 0.2rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
          }

          .react-calendar__navigation button:hover {
            background-color: #bbdefb;
          }

          .react-calendar__month-view__weekdays {
            font-weight: bold;
            color: #01579b;
            text-transform: uppercase;
          }

          .react-calendar__month-view__days__day {
            font-size: 1rem;
            padding: 10px;
            border-radius: 8px;
            transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
          }

          .default-tile:hover {
            background-color: #bbdefb;
            transform: scale(1.05);
          }

          .highlight {
            background-color: #0288d1 !important; /* Bold blue for highlighted dates */
            color: #fff !important;
            font-weight: bold;
            border-radius: 50%;
            transform: scale(1.05);
          }

          .react-calendar__tile--now {
            background-color: #4fc3f7; /* Light cyan for the current day */
            border-radius: 50%;
            font-weight: bold;
            color: #004d70;
          }

          .react-calendar__tile--now:hover {
            background-color: #29b6f6;
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};

export default TaskCalendar;
