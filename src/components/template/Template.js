/**
 * TEMPLATE COMPONENT FOR CREATING NEW COMPONENTS
 * 
 * This is a template you can copy to create your own custom components.
 * Follow these steps:
 * 
 * 1. Copy this entire folder (template/) and rename it to your component name
 * 2. Rename Template.js to YourComponent.js
 * 3. Rename Template.css to YourComponent.css
 * 4. Update the component name throughout this file
 * 5. Add your custom functionality and state
 * 6. Update the CSS file to style your component
 * 7. Register your component in:
 *    - src/components/GridCell.js (import and render case)
 *    - src/components/ComponentSelector.js (add to component list)
 * 
 * IMPORTANT: Keep the drag handle, componentKey, and state persistence logic intact!
 */

import React, { useState, useEffect } from 'react';
import './Template.css';
import { saveComponentState, getComponentState } from '../../utils/screenStorage';

const Template = ({ onDragStart, onDragEnd, componentKey }) => {
  // ==================== STATE MANAGEMENT ====================
  // Add your state variables here
  // Example: const [myData, setMyData] = useState('default value');
  
  const [exampleText, setExampleText] = useState('');
  const [exampleNumber, setExampleNumber] = useState(0);
  const [exampleList, setExampleList] = useState([]);
  
  // This state tracks if the component has been initialized (loaded from storage)
  // REQUIRED: Don't remove this - it prevents race conditions
  const [isInitialized, setIsInitialized] = useState(false);

  // ==================== LOAD STATE FROM STORAGE ====================
  // This useEffect runs once when the component mounts
  // It loads any previously saved state from localStorage
  useEffect(() => {
    if (componentKey) {
      const savedState = getComponentState(componentKey);
      if (savedState) {
        // Load each piece of saved state
        // Add lines here for each state variable you want to persist
        if (savedState.exampleText !== undefined) setExampleText(savedState.exampleText);
        if (savedState.exampleNumber !== undefined) setExampleNumber(savedState.exampleNumber);
        if (savedState.exampleList !== undefined) setExampleList(savedState.exampleList);
      }
      setIsInitialized(true);
    }
  }, [componentKey]);

  // ==================== SAVE STATE TO STORAGE ====================
  // This useEffect runs whenever your state changes
  // It saves the current state to localStorage
  useEffect(() => {
    if (componentKey && isInitialized) {
      saveComponentState(componentKey, {
        // Add all state variables you want to persist
        exampleText,
        exampleNumber,
        exampleList
      });
    }
  }, [componentKey, exampleText, exampleNumber, exampleList, isInitialized]);

  // ==================== DRAG HANDLE HANDLERS ====================
  // REQUIRED: These allow the component to be dragged around the grid
  // Don't remove these!
  const handleHeaderDragStart = (e) => {
    e.stopPropagation();
    if (onDragStart) onDragStart(e);
  };

  const handleHeaderDragEnd = (e) => {
    e.stopPropagation();
    if (onDragEnd) onDragEnd(e);
  };

  // ==================== YOUR CUSTOM FUNCTIONS ====================
  // Add your component's logic here
  
  const handleExampleAction = () => {
    // Example function - replace with your own logic
    setExampleNumber(exampleNumber + 1);
  };

  const handleAddToList = () => {
    if (exampleText.trim()) {
      setExampleList([...exampleList, {
        id: Date.now(),
        text: exampleText.trim()
      }]);
      setExampleText('');
    }
  };

  const handleDeleteFromList = (id) => {
    setExampleList(exampleList.filter(item => item.id !== id));
  };

  // ==================== RENDER ====================
  return (
    <div className="template">
      {/* REQUIRED: Drag handle - allows moving the component */}
      <div
        className="component-drag-handle"
        draggable
        onDragStart={handleHeaderDragStart}
        onDragEnd={handleHeaderDragEnd}
        title="Drag to move"
      >
        ⋮⋮
      </div>
      
      {/* Component title - customize this */}
      <h3>📋 Template Component</h3>
      
      {/* YOUR CUSTOM UI GOES HERE */}
      <div className="template-content">
        
        {/* Example: Text input */}
        <div className="template-section">
          <input
            type="text"
            value={exampleText}
            onChange={(e) => setExampleText(e.target.value)}
            placeholder="Enter some text..."
            className="template-input"
          />
          <button onClick={handleAddToList} className="template-btn">
            Add to List
          </button>
        </div>

        {/* Example: Counter */}
        <div className="template-section">
          <div className="template-counter">
            Count: {exampleNumber}
          </div>
          <button onClick={handleExampleAction} className="template-btn">
            Increment
          </button>
        </div>

        {/* Example: List display */}
        <div className="template-list">
          {exampleList.length === 0 ? (
            <div className="empty-message">
              No items yet. Add one above!
            </div>
          ) : (
            exampleList.map(item => (
              <div key={item.id} className="template-list-item">
                <span>{item.text}</span>
                <button 
                  onClick={() => handleDeleteFromList(item.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Template;
