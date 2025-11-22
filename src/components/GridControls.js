import React from 'react';
import './GridControls.css';

const GridControls = ({ rows, cols, onRowsChange, onColsChange, canReduceRows, canReduceCols }) => {
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
    </div>
  );
};

export default GridControls;
