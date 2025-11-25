import React, { useState } from 'react';
import './GridControls.css';

const GridControls = ({ rows, cols, onRowsChange, onColsChange, canReduceRows, canReduceCols, overlayTimeout, onOverlayTimeoutChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRowChange = (newValue) => {
    const newRows = parseInt(newValue) || 1;
    if (canReduceRows && !canReduceRows(newRows)) {
      return; // Don't update if it would affect components
    }
    onRowsChange(newRows);
  };

  const handleColChange = (newValue) => {
    const newCols = parseInt(newValue) || 1;
    if (canReduceCols && !canReduceCols(newCols)) {
      return; // Don't update if it would affect components
    }
    onColsChange(newCols);
  };

  return (
    <div className="grid-controls-container">
      <button 
        className="collapse-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Show Settings" : "Hide Settings"}
      >
        {isCollapsed ? '⚙️ Show Settings' : '⚙️ Hide Settings'}
      </button>
      {!isCollapsed && (
        <div className="grid-controls">
          <div className="control-group">
            <label>Rows:</label>
            <input
              type="number"
              min="1"
              value={rows}
              onChange={(e) => handleRowChange(e.target.value)}
              title={canReduceRows && !canReduceRows(rows - 1) ? "Cannot reduce - components in the way" : ""}
            />
          </div>
          <div className="control-group">
            <label>Columns:</label>
            <input
              type="number"
              min="1"
              value={cols}
              onChange={(e) => handleColChange(e.target.value)}
              title={canReduceCols && !canReduceCols(cols - 1) ? "Cannot reduce - components in the way" : ""}
            />
          </div>
          <div className="control-group control-divider">
            <label htmlFor="overlay-timeout">Dice Overlay Duration:</label>
            <input
              id="overlay-timeout"
              type="number"
              min="1"
              max="30"
              value={overlayTimeout}
              onChange={(e) => onOverlayTimeoutChange(Math.max(1, Math.min(30, parseInt(e.target.value) || 8)))}
            />
            <span className="unit-label">seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridControls;
