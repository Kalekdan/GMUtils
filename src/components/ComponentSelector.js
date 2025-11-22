import React from 'react';
import './ComponentSelector.css';

const ComponentSelector = ({ onSelect, onClose }) => {
  const components = [
    { id: 'dice-roller', name: 'Dice Roller', icon: '🎲' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'timer', name: 'Timer', icon: '⏱️' },
    { id: 'initiative-tracker', name: 'Initiative Tracker', icon: '⚔️', disabled: true },
  ];

  return (
    <div className="selector-overlay" onClick={onClose}>
      <div className="selector-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Select Component</h3>
        <div className="component-list">
          {components.map((comp) => (
            <button
              key={comp.id}
              className={`component-option ${comp.disabled ? 'disabled' : ''}`}
              onClick={() => !comp.disabled && onSelect(comp.id)}
              disabled={comp.disabled}
            >
              <span className="component-icon">{comp.icon}</span>
              <span className="component-name">{comp.name}</span>
              {comp.disabled && <span className="coming-soon">(Coming Soon)</span>}
            </button>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComponentSelector;
