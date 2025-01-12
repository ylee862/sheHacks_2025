import React from "react";

const NavBar = ({ projectName }) => {
  return (
    <nav className="navbar">
      <h3>{projectName || "Project"}</h3>
    </nav>
  );
};

export default NavBar;
