import React, { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import DMGrid from './components/DMGrid';
import GridControls from './components/GridControls';
import ComponentSelector from './components/ComponentSelector';
import DiceResultOverlay from './components/shared/DiceResultOverlay';

function App() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(5);
  const [cells, setCells] = useState({});
  const [cellSpans, setCellSpans] = useState({}); // { cellId: { colSpan, rowSpan } }
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [componentInstances, setComponentInstances] = useState({}); // Store component types and keys
  const [globalDiceResult, setGlobalDiceResult] = useState(null);
  const [overlayTimeout, setOverlayTimeout] = useState(8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenClose, setShowFullscreenClose] = useState(false);
  const diceTimeoutRef = useRef(null);

  const handleSetGlobalDiceResult = useCallback((result) => {
    // Clear any existing timeout
    if (diceTimeoutRef.current) {
      clearTimeout(diceTimeoutRef.current);
      diceTimeoutRef.current = null;
    }

    setGlobalDiceResult(result);

    // Set new timeout if result is not null
    if (result) {
      diceTimeoutRef.current = setTimeout(() => {
        setGlobalDiceResult(null);
        diceTimeoutRef.current = null;
      }, overlayTimeout * 1000);
    }
  }, [overlayTimeout]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Keyboard shortcut for fullscreen (Escape key)
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Exit fullscreen with Escape key
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  // Show close button when hovering near top-right in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleMouseMove = (e) => {
      // Show button if mouse is within 100px of top and 100px of right edge
      const nearTop = e.clientY < 100;
      const nearRight = window.innerWidth - e.clientX < 100;
      setShowFullscreenClose(nearTop && nearRight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFullscreen]);

  const handleCellClick = (cellId) => {
    setSelectedCellId(cellId);
    setShowSelector(true);
  };

  const handleComponentSelect = (componentId) => {
    // Create a unique key for this component instance
    const componentKey = `${componentId}-${Date.now()}`;
    
    setCells({
      ...cells,
      [selectedCellId]: componentKey,
    });
    
    setComponentInstances({
      ...componentInstances,
      [componentKey]: { type: componentId }
    });
    
    // Initialize span to 1x1 if not already set
    if (!cellSpans[selectedCellId]) {
      setCellSpans({
        ...cellSpans,
        [selectedCellId]: { colSpan: 1, rowSpan: 1 }
      });
    }
    
    setShowSelector(false);
    setSelectedCellId(null);
  };

  const handleDeleteComponent = (cellId) => {
    const componentKey = cells[cellId];
    const newCells = { ...cells };
    delete newCells[cellId];
    setCells(newCells);
    const newSpans = { ...cellSpans };
    delete newSpans[cellId];
    setCellSpans(newSpans);
    
    // Clean up component instance
    if (componentKey) {
      const newInstances = { ...componentInstances };
      delete newInstances[componentKey];
      setComponentInstances(newInstances);
    }
  };

  const handleCellResize = (cellId, colSpan, rowSpan, newCellId) => {
    // If newCellId is different, we need to move the component
    if (newCellId !== undefined && newCellId !== cellId) {
      const newCells = { ...cells };
      const newSpans = { ...cellSpans };
      
      // Move component to new position
      newCells[newCellId] = cells[cellId];
      delete newCells[cellId];
      
      // Update spans
      newSpans[newCellId] = { colSpan, rowSpan };
      delete newSpans[cellId];
      
      setCells(newCells);
      setCellSpans(newSpans);
    } else {
      setCellSpans({
        ...cellSpans,
        [cellId]: { colSpan, rowSpan }
      });
    }
  };

  const handleComponentMove = (fromCellId, toCellId) => {
    // Don't move if target cell already has a component
    if (cells[toCellId]) {
      return false;
    }

    const span = cellSpans[fromCellId] || { colSpan: 1, rowSpan: 1 };
    const targetRow = Math.floor(toCellId / cols);
    const targetCol = toCellId % cols;

    // Check if component would fit at target location
    if (targetCol + span.colSpan > cols || targetRow + span.rowSpan > rows) {
      return false;
    }

    // Check if any cells in the span are occupied
    for (let r = 0; r < span.rowSpan; r++) {
      for (let c = 0; c < span.colSpan; c++) {
        const checkCellId = (targetRow + r) * cols + (targetCol + c);
        if (cells[checkCellId] && checkCellId !== fromCellId) {
          return false;
        }
      }
    }

    // Move the component
    const newCells = { ...cells };
    const newSpans = { ...cellSpans };
    
    newCells[toCellId] = cells[fromCellId];
    delete newCells[fromCellId];
    
    newSpans[toCellId] = span;
    delete newSpans[fromCellId];
    
    setCells(newCells);
    setCellSpans(newSpans);
    return true;
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
    setSelectedCellId(null);
  };

  // Check if reducing rows would affect any components
  const canReduceRows = (newRows) => {
    if (newRows >= rows) return true; // Can always increase
    
    // Check if any component would be cut off
    for (const [cellId, component] of Object.entries(cells)) {
      if (!component) continue;
      const cellIndex = parseInt(cellId);
      const row = Math.floor(cellIndex / cols);
      const span = cellSpans[cellId] || { rowSpan: 1 };
      
      // Check if component extends beyond new row count
      if (row >= newRows || row + span.rowSpan > newRows) {
        return false;
      }
    }
    return true;
  };

  // Check if reducing columns would affect any components
  const canReduceCols = (newCols) => {
    if (newCols >= cols) return true; // Can always increase
    
    // Check if any component would be cut off
    for (const [cellId, component] of Object.entries(cells)) {
      if (!component) continue;
      const cellIndex = parseInt(cellId);
      const col = cellIndex % cols;
      const span = cellSpans[cellId] || { colSpan: 1 };
      
      // Check if component extends beyond new column count
      if (col >= newCols || col + span.colSpan > newCols) {
        return false;
      }
    }
    return true;
  };

  const handleRowsChange = (newRows) => {
    if (!canReduceRows(newRows)) {
      return; // Prevent change if it would affect components
    }
    
    setRows(newRows);
    // Clean up cells that are now out of bounds
    const newCells = {};
    const newSpans = {};
    Object.keys(cells).forEach((cellId) => {
      if (parseInt(cellId) < newRows * cols) {
        newCells[cellId] = cells[cellId];
        if (cellSpans[cellId]) {
          newSpans[cellId] = cellSpans[cellId];
        }
      }
    });
    setCells(newCells);
    setCellSpans(newSpans);
  };

  const handleColsChange = (newCols) => {
    if (!canReduceCols(newCols)) {
      return; // Prevent change if it would affect components
    }
    
    setCols(newCols);
    // Clean up cells that are now out of bounds
    const newCells = {};
    const newSpans = {};
    Object.keys(cells).forEach((cellId) => {
      if (parseInt(cellId) < rows * newCols) {
        newCells[cellId] = cells[cellId];
        if (cellSpans[cellId]) {
          newSpans[cellId] = cellSpans[cellId];
        }
      }
    });
    setCells(newCells);
    setCellSpans(newSpans);
  };

  return (
    <div className={`App ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {!isFullscreen && (
        <header className="App-header">
          <div className="header-content">
            <div>
              <h1>🎲 The Gamemaster Screen</h1>
              <p>Click on any grid cell to add a component</p>
            </div>
            <button 
              className="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen (Esc to exit)"
            >
              ⛶
            </button>
          </div>
        </header>
      )}
      {!isFullscreen && (
        <GridControls
          rows={rows}
          cols={cols}
          onRowsChange={handleRowsChange}
          onColsChange={handleColsChange}
          canReduceRows={canReduceRows}
          canReduceCols={canReduceCols}
          overlayTimeout={overlayTimeout}
          onOverlayTimeoutChange={setOverlayTimeout}
        />
      )}
      <DMGrid
        rows={rows}
        cols={cols}
        cells={cells}
        cellSpans={cellSpans}
        componentInstances={componentInstances}
        onCellClick={handleCellClick}
        onDeleteComponent={handleDeleteComponent}
        onCellResize={handleCellResize}
        onComponentMove={handleComponentMove}
        globalDiceResult={globalDiceResult}
        setGlobalDiceResult={handleSetGlobalDiceResult}
        overlayTimeout={overlayTimeout}
      />
      {showSelector && (
        <ComponentSelector
          onSelect={handleComponentSelect}
          onClose={handleCloseSelector}
        />
      )}
      <DiceResultOverlay diceResult={globalDiceResult} />
      {isFullscreen && showFullscreenClose && (
        <button 
          className="fullscreen-close-btn"
          onClick={toggleFullscreen}
          title="Exit Fullscreen (Esc)"
        >
          ✕
        </button>
      )}
      {!isFullscreen && (
        <footer className="App-footer">
          <div className="footer-content">
            <p className="made-by">Made by <a href="https://joerickard.co.uk" target="_blank" rel="noopener noreferrer">Joe Rickard</a></p>
            <a href="https://www.buymeacoffee.com/joerickard" target="_blank" rel="noopener noreferrer" className="bmc-button">
              ☕ Buy me a coffee
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
