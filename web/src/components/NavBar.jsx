import React, { useState } from "react";

const NavBar = () => {
  const [projectName, setProjectName] = useState("Project");
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <nav
      className="navbar"
      style={{ padding: "1rem", backgroundColor: "#B19CD9" }}
    >
      {isEditing ? (
        <input
          type="text"
          value={projectName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
          }}
        />
      ) : (
        <h3 onDoubleClick={handleDoubleClick} style={{ cursor: "pointer" }}>
          {projectName || "Project"}
        </h3>
      )}
    </nav>
  );
};

export default NavBar;
