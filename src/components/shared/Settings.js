import React from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-settings-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3>Grid Layout</h3>
            <div className="setting-row">
              <label htmlFor="rows">Rows:</label>
              <input
                type="number"
                id="rows"
                min="1"
                max="10"
                value={settings.rows}
                onChange={(e) => handleChange('rows', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="setting-row">
              <label htmlFor="columns">Columns:</label>
              <input
                type="number"
                id="columns"
                min="1"
                max="10"
                value={settings.columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Display</h3>
            <div className="setting-row">
              <label htmlFor="hideTitles">
                <input
                  type="checkbox"
                  id="hideTitles"
                  checked={settings.hideTitles}
                  onChange={(e) => handleChange('hideTitles', e.target.checked)}
                />
                Hide Component Titles
              </label>
            </div>
            <div className="setting-row">
              <label htmlFor="diceOverlay">
                <input
                  type="checkbox"
                  id="diceOverlay"
                  checked={settings.diceOverlay}
                  onChange={(e) => handleChange('diceOverlay', e.target.checked)}
                />
                Show Dice Roll Overlay
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Theme</h3>
            <div className="setting-row theme-buttons">
              <button
                className={`theme-button ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleChange('theme', 'dark')}
              >
                Dark
              </button>
              <button
                className={`theme-button ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleChange('theme', 'light')}
              >
                Light
              </button>
              <button
                className={`theme-button ${settings.theme === 'parchment' ? 'active' : ''}`}
                onClick={() => handleChange('theme', 'parchment')}
              >
                Parchment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
