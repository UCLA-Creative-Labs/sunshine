import React from 'react';
import './FloatingAddButton.css';

const FloatingAddButton = ({ onClick }) => {
    return (
        <button
            className="floating-add-button"
            onClick={onClick}
            aria-label="Add new project"
            title="Create new project"
        >
            <span className="plus-icon">+</span>
        </button>
    );
};

export default FloatingAddButton;
