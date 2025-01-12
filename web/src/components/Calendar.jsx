import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Calendar = ({ tasks }) => {
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    const dates = Object.values(tasks).flatMap((task) =>
      task.items.map((item) => item.deadline).filter(Boolean)
    );

    setHighlightedDates(dates);
  }, [tasks]);
};
