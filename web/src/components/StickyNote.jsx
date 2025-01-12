import React from "react";

const StickyNote = ({ taskData, setTaskData, saveTask, closeModal }) => {
    const handleInput = (e) => {
        setTaskData({ ...taskData, description: e.target.value });
    };

    const handleColour = (e) => {
        setTaskData({ ...taskData, colour: e.target.value });
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", width: "300px" }}>
                <h3>Edit Task</h3>
                <textarea
                    value={taskData.description}
                    onChange={handleInput}
                    placeholder="Enter task description here..."
                    style={{ width: "100%", height: "100px", padding: "0.5rem" }}
                />
                <div style={{ margin: "1rem 0" }}>
                    <label>Choose Colour</label>
                    <input
                        type="color"
                        value={taskData.colour}
                        onChange={handleColour}
                        style={{ marginLeft: "0.5rem" }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={closeModal}>Close</button>
                    <button onClick={saveTask}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default StickyNote;