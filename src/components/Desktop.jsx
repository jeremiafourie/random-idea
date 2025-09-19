import { useState, createContext, useContext } from 'react'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcons from './DesktopIcons'
import SettingsApp from './apps/SettingsApp'
import FileExplorerApp from './apps/FileExplorerApp'
import CalculatorApp from './apps/CalculatorApp'
import NotepadApp from './apps/NotepadApp'

const SystemContext = createContext()

export const useSystem = () => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemContext provider')
  }
  return context
}

function Desktop() {
  const [windows, setWindows] = useState([])
  const [nextZIndex, setNextZIndex] = useState(100)
  const [systemState, setSystemState] = useState({
    userProfile: {
      name: 'Windows User',
      email: 'user@windows.com',
      theme: 'dark',
      notifications: true
    },
    fileSystem: {
      currentPath: 'C:\\Users\\Desktop',
      files: [
        { name: 'Documents', type: 'folder' },
        { name: 'Pictures', type: 'folder' },
        { name: 'Downloads', type: 'folder' },
        { name: 'readme.txt', type: 'file', content: 'Welcome to Windows!' },
        { name: 'notes.txt', type: 'file', content: 'My personal notes...' }
      ]
    },
    clipboard: '',
    notifications: []
  })

  const updateSystemState = (path, value) => {
    setSystemState(prev => {
      const newState = { ...prev }
      const keys = path.split('.')
      let current = newState
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newState
    })
  }

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }
    setSystemState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }))
    
    setTimeout(() => {
      setSystemState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== notification.id)
      }))
    }, 5000)
  }

  const openWindow = (appType, title, instanceData = null) => {
    const newWindow = {
      id: Date.now(),
      appType,
      title,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 50,
      width: 600,
      height: 400,
      isMaximized: false,
      isMinimized: false,
      zIndex: nextZIndex,
      instanceData
    }
    setWindows(prev => [...prev, newWindow])
    setNextZIndex(prev => prev + 1)
    addNotification(`${title} opened`, 'success')
  }

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ))
  }

  const maximizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { 
        ...w, 
        isMaximized: !w.isMaximized,
        ...(w.isMaximized ? { x: w.prevX, y: w.prevY, width: w.prevWidth, height: w.prevHeight } : 
                            { prevX: w.x, prevY: w.y, prevWidth: w.width, prevHeight: w.height, x: 0, y: 0, width: window.innerWidth, height: window.innerHeight - 48 })
      } : w
    ))
  }

  const focusWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
    ))
    setNextZIndex(prev => prev + 1)
  }

  const updateWindowPosition = (id, x, y) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ))
  }

  const updateWindowSize = (id, width, height) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ))
  }

  const renderAppContent = (window) => {
    const { appType, instanceData } = window
    const props = { 
      windowId: window.id, 
      instanceData,
      onUpdateInstance: (data) => {
        setWindows(prev => prev.map(w => 
          w.id === window.id ? { ...w, instanceData: { ...w.instanceData, ...data } } : w
        ))
      }
    }

    switch (appType) {
      case 'settings':
        return <SettingsApp {...props} />
      case 'fileexplorer':
        return <FileExplorerApp {...props} />
      case 'calculator':
        return <CalculatorApp {...props} />
      case 'notepad':
        return <NotepadApp {...props} />
      default:
        return <div>Unknown app: {appType}</div>
    }
  }

  const systemContextValue = {
    systemState,
    updateSystemState,
    addNotification,
    openWindow,
    setClipboard: (text) => updateSystemState('clipboard', text),
    getClipboard: () => systemState.clipboard
  }

  return (
    <SystemContext.Provider value={systemContextValue}>
      <div className="desktop">
        <DesktopIcons onOpenApp={openWindow} />
        
        {/* Notifications */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {systemState.notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                background: notification.type === 'success' ? 'rgba(0, 128, 0, 0.9)' :
                           notification.type === 'error' ? 'rgba(255, 0, 0, 0.9)' :
                           'rgba(0, 120, 212, 0.9)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                maxWidth: '300px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{notification.message}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{notification.timestamp}</div>
            </div>
          ))}
        </div>
        
        {windows.map(window => (
          !window.isMinimized && (
            <Window
              key={window.id}
              {...window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onMove={(x, y) => updateWindowPosition(window.id, x, y)}
              onResize={(width, height) => updateWindowSize(window.id, width, height)}
            >
              {renderAppContent(window)}
            </Window>
          )
        ))}
        
        <Taskbar 
          windows={windows}
          onWindowClick={(id) => focusWindow(id)}
          onOpenApp={openWindow}
        />
      </div>
    </SystemContext.Provider>
  )
}

export default Desktop