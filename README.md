# Windows 11 Web Clone Prototype

A fully functional Windows 11 desktop clone built with React, featuring draggable/resizable windows, multiple application instances with isolated state, and system-wide state management.

## 🚀 Features

### 🖥️ Desktop Environment
- **Windows 11-style interface** with glassmorphism effects
- **Draggable windows** - Move windows by clicking and dragging the title bar
- **Resizable windows** - Resize from edges and corners
- **Window management** - Minimize, maximize, close, and focus windows
- **Taskbar** - Shows active applications and minimized windows
- **Desktop icons** - Double-click to launch applications
- **System notifications** - Toast notifications with auto-dismiss

### 📱 Built-in Applications

#### Settings App
- Modify system-wide user profile
- Changes affect all other applications
- Persistent settings storage

#### File Explorer
- Browse system files and folders
- Navigate with back/forward buttons
- Open text files in Notepad
- Real-time file system integration

#### Notepad
- **Multiple instances** with isolated content
- **File management** - Save/load text files to system
- **Clipboard integration** - Copy content to system clipboard
- **File sidebar** - Quick access to existing text files
- Each window maintains separate state

#### Calculator
- **Multiple instances** with isolated calculations
- **Auto-copy results** to system clipboard
- Persistent calculator state per window
- Full arithmetic operations

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Desktop.jsx           # Main desktop component with system context
│   ├── Window.jsx            # Draggable/resizable window component
│   ├── Taskbar.jsx           # Bottom taskbar with app icons
│   ├── DesktopIcons.jsx      # Desktop application icons
│   └── apps/
│       ├── SettingsApp.jsx   # System settings application
│       ├── FileExplorerApp.jsx # File browser application
│       ├── CalculatorApp.jsx # Calculator with isolated state
│       └── NotepadApp.jsx    # Text editor with file management
├── index.css                 # Windows 11 styling
└── App.jsx                   # Application entry point
```

### System Context Architecture

The application uses React Context to manage system-wide state:

```javascript
const SystemContext = {
  systemState: {
    userProfile: { name, email, theme, notifications },
    fileSystem: { currentPath, files },
    clipboard: '',
    notifications: []
  },
  updateSystemState: (path, value) => void,
  addNotification: (message, type) => void,
  openWindow: (appType, title, instanceData) => void,
  setClipboard: (text) => void,
  getClipboard: () => string
}
```

### Window Management

Each window maintains:
- **Unique ID** for tracking
- **Position and size** (x, y, width, height)
- **State** (minimized, maximized, focused)
- **Z-index** for layering
- **Instance data** for app-specific state isolation

### State Isolation

Applications achieve state isolation through:
1. **Instance data** - Each window gets unique instance data
2. **Props-based state** - Apps receive `windowId`, `instanceData`, `onUpdateInstance`
3. **Persistent state** - Window state persists when minimized/restored

## 🛠️ Adding New Programs

### Step 1: Create the Application Component

Create a new file in `src/components/apps/YourApp.jsx`:

```javascript
import { useState, useEffect } from 'react'
import { useSystem } from '../Desktop'

function YourApp({ windowId, instanceData, onUpdateInstance }) {
  const { systemState, updateSystemState, addNotification, openWindow } = useSystem()
  
  // Local state for this window instance
  const [localState, setLocalState] = useState(instanceData?.localState || initialState)
  
  // Update instance data when local state changes
  useEffect(() => {
    onUpdateInstance({ localState })
  }, [localState, onUpdateInstance])
  
  // Example: Affect system state
  const handleSystemAction = () => {
    updateSystemState('some.path', newValue)
    addNotification('System updated!', 'success')
  }
  
  // Example: Open another window
  const handleOpenRelated = () => {
    openWindow('otherapp', 'Related App', { data: 'from your app' })
  }
  
  return (
    <div>
      <h2>Your App (Window #{windowId})</h2>
      {/* Your app UI here */}
    </div>
  )
}

export default YourApp
```

### Step 2: Register the Application

#### Add to Desktop.jsx imports:
```javascript
import YourApp from './apps/YourApp'
```

#### Add to renderAppContent switch statement:
```javascript
case 'yourapp':
  return <YourApp {...props} />
```

### Step 3: Add Icons and Taskbar Entry

#### Add to DesktopIcons.jsx:
```javascript
import { YourIcon } from 'lucide-react'

const icons = [
  // ... existing icons
  { id: 'yourapp', icon: YourIcon, label: 'Your App' }
]
```

#### Add to Taskbar.jsx:
```javascript
const apps = [
  // ... existing apps
  { id: 'yourapp', icon: YourIcon, label: 'Your App' }
]
```

### Step 4: State Management Patterns

#### For isolated window state:
```javascript
const [windowState, setWindowState] = useState(instanceData?.state || defaultState)

useEffect(() => {
  onUpdateInstance({ state: windowState })
}, [windowState, onUpdateInstance])
```

#### For system-wide effects:
```javascript
const { updateSystemState, addNotification } = useSystem()

const affectSystem = () => {
  updateSystemState('fileSystem.files', newFiles)
  addNotification('Files updated', 'success')
}
```

#### For inter-app communication:
```javascript
const { openWindow, systemState } = useSystem()

const communicateWithOtherApp = () => {
  openWindow('otherapp', 'Communication', { 
    source: windowId,
    data: systemState.someSharedData 
  })
}
```

## 🎯 Key Features Explained

### Multiple Instances
- Each app can have multiple windows open simultaneously
- Each window maintains its own isolated state
- State persists when windows are minimized/restored

### System Integration
- **Settings** affects user profile across all apps
- **Notepad** saves files to system file storage
- **File Explorer** can open files in appropriate apps
- **Calculator** copies results to system clipboard

### External Effects
- Notifications appear system-wide
- Clipboard is shared between all apps
- File system changes are visible across File Explorer instances
- User profile changes affect all applications

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🎨 Customization

### Styling
Modify `src/index.css` for Windows 11 theme customization:
- Colors and gradients
- Window styling
- Glassmorphism effects
- Animation timings

### System State
Extend the system state in `Desktop.jsx`:
```javascript
const [systemState, setSystemState] = useState({
  // Add your system-wide state here
  yourSystemData: {},
})
```

## 📋 Development Notes

- Uses custom drag/drop implementation (no external libraries)
- Window management with z-index layering
- Context-based state management
- Responsive design principles
- Modular app architecture for easy extension

## 🔧 Technical Details

- **React 18** with hooks
- **Vite** for fast development
- **Lucide React** for icons
- **Pure CSS** with modern features
- **No external window management libraries**
- **Context API** for state management

Each application is designed to demonstrate different patterns of state management and system integration, making this a comprehensive example of building complex desktop-like web applications.
