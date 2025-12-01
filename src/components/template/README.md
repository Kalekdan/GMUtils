# Component Template

This is a template for creating new components for the Gamemaster Screen application.

## Quick Start

1. **Copy this folder** and rename it to your component name (e.g., `my-component`)
2. **Rename the files**:
   - `Template.js` → `MyComponent.js`
   - `Template.css` → `MyComponent.css`
3. **Update imports** in your JS file
4. **Register your component** (see below)
5. **Customize** the functionality and styling

## Step-by-Step Guide

### 1. Copy and Rename

```bash
# Copy the template folder
cp -r src/components/template src/components/my-component

# Rename the files
mv src/components/my-component/Template.js src/components/my-component/MyComponent.js
mv src/components/my-component/Template.css src/components/my-component/MyComponent.css
```

### 2. Update Your Component File

In `MyComponent.js`:

1. Update the CSS import:
   ```javascript
   import './MyComponent.css';
   ```

2. Update the component name:
   ```javascript
   const MyComponent = ({ onDragStart, onDragEnd, componentKey }) => {
   ```

3. Update the className in the return statement:
   ```javascript
   <div className="my-component">
   ```

4. Update the export:
   ```javascript
   export default MyComponent;
   ```

### 3. Register Your Component

#### In `src/components/GridCell.js`:

Add your import at the top:
```javascript
import MyComponent from './my-component/MyComponent';
```

Add a case in the `renderComponent()` function:
```javascript
} else if (componentType === 'my-component') {
  return <MyComponent key={componentKey} {...commonProps} />;
```

#### In `src/components/ComponentSelector.js`:

Add your component to the appropriate group in the `componentGroups` array:
```javascript
{
  title: 'Your Category',
  components: [
    { id: 'my-component', name: 'My Component', icon: '🎮' },
    // other components...
  ]
}
```

### 4. Customize the CSS

In `MyComponent.css`:

1. Replace all `.template` class names with `.my-component`
2. Customize colors, sizes, and layout to match your design
3. The basic structure is optimized for the grid layout - keep the core layout properties

### 5. Add Your Functionality

In `MyComponent.js`:

1. **Add State Variables**: Replace the example state with your own
   ```javascript
   const [myData, setMyData] = useState('');
   ```

2. **Update Load State**: Add your state variables to the load effect
   ```javascript
   if (savedState.myData !== undefined) setMyData(savedState.myData);
   ```

3. **Update Save State**: Add your state variables to the save effect
   ```javascript
   saveComponentState(componentKey, {
     myData
   });
   ```

4. **Add Functions**: Implement your component's logic

5. **Update UI**: Modify the JSX to render your component

## Important Features to Keep

### ✅ Required Elements

These elements **must** be kept for proper functionality:

1. **Drag Handle** - Allows users to move the component
   ```javascript
   <div className="component-drag-handle" draggable onDragStart={handleHeaderDragStart} onDragEnd={handleHeaderDragEnd}>
     ⋮⋮
   </div>
   ```

2. **Component Key** - Used for state persistence
   ```javascript
   const MyComponent = ({ onDragStart, onDragEnd, componentKey }) => {
   ```

3. **State Persistence** - Both load and save useEffects
   ```javascript
   // Load state
   useEffect(() => { ... }, [componentKey]);
   
   // Save state
   useEffect(() => { ... }, [componentKey, /* your state */, isInitialized]);
   ```

4. **isInitialized Flag** - Prevents race conditions
   ```javascript
   const [isInitialized, setIsInitialized] = useState(false);
   ```

### 🎨 Optional Props

You can also receive these props if needed:

- `setGlobalDiceResult` - For components that roll dice
- `hideTitles` - Respect the hide titles setting
- `initiativeTrackerRefs` - For components that interact with initiative trackers

Add them to your component signature as needed:
```javascript
const MyComponent = ({ 
  onDragStart, 
  onDragEnd, 
  componentKey, 
  setGlobalDiceResult,
  hideTitles 
}) => {
```

## State Persistence

Your component's state is automatically saved to localStorage when it changes and restored when the component loads. This allows:

- Users to save and load different screen configurations
- State to persist across browser sessions
- Components to maintain their data when moved around the grid

**What to persist:**
- ✅ User input data (text, numbers, selections)
- ✅ Component configuration (view modes, settings)
- ✅ Lists and collections
- ❌ Temporary UI state (loading, errors)
- ❌ Derived/calculated values

## Styling Guidelines

### Color Scheme

The app uses a dark theme with customizable accent colors:
- Background: `#1e1e1e`, `#2a2a2a`
- Borders: `#444`, `#555`
- Accent: `#6c5ce7` (purple), `#a29bfe` (light purple)
- Text: `#ffffff`, `#999` (muted)

### Component Size

Your component will be placed in a CSS Grid cell. Design it to:
- Fill available space (use `width: 100%`, `height: 100%`)
- Handle overflow with scrolling
- Scale gracefully in different cell sizes (1x1, 2x2, 2x3, etc.)

### Responsive Design

Consider how your component looks in:
- Small cells (1x1)
- Medium cells (2x2)
- Large cells (3x3 or bigger)

Use media queries for adjustments if needed.

## Examples of Existing Components

For reference, check out these components:

- **Simple**: `Timer` - Basic state with buttons
- **List-based**: `Checklist` - Managing arrays of items
- **Complex**: `InitiativeTracker` - Multiple state variables, conditional rendering
- **API-based**: `Monsters` - Fetching and displaying external data

## Testing Your Component

1. Start the development server: `pnpm start`
2. Click on a grid cell to add a component
3. Select your component from the list
4. Test all functionality
5. Try saving and loading screens to ensure state persists
6. Test resizing the component to different grid sizes

## Common Issues

### Component Not Appearing in Selector
- Check that you added it to `ComponentSelector.js`
- Verify the `id` matches the `componentType` in `GridCell.js`

### State Not Persisting
- Ensure `componentKey` prop is being used
- Check that state variables are in both load and save effects
- Verify `isInitialized` flag is set correctly

### Drag Handle Not Working
- Make sure you kept the `handleHeaderDragStart` and `handleHeaderDragEnd` functions
- Verify the drag handle div has `draggable` attribute

## Contributing

If you create a useful component, consider contributing it back to the project! Open a pull request on GitHub with:
- Your component files
- Updates to GridCell.js and ComponentSelector.js
- A description of what your component does

## Support

For questions or issues:
- Check existing components for examples
- Open an issue on GitHub
- Review the main README.md for project setup

Happy coding! 🎲
