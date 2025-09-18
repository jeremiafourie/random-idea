import { useState } from 'react'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcons from './DesktopIcons'
import SettingsApp from './apps/SettingsApp'
import FileExplorerApp from './apps/FileExplorerApp'
import CalculatorApp from './apps/CalculatorApp'

function Desktop() {
  const [windows, setWindows] = useState([])
  const [nextZIndex, setNextZIndex] = useState(100)

  const openWindow = (appType, title) => {
    const newWindow = {
      id: Date.now(),
      appType,
      title,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 50,
      width: 600,
      height: 400,
      isMaximized: false,
      zIndex: nextZIndex
    }
    setWindows(prev => [...prev, newWindow])
    setNextZIndex(prev => prev + 1)
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

  const renderAppContent = (appType) => {
    switch (appType) {
      case 'settings':
        return <SettingsApp />
      case 'fileexplorer':
        return <FileExplorerApp />
      case 'calculator':
        return <CalculatorApp />
      default:
        return <div>Unknown app: {appType}</div>
    }
  }

  return (
    <div className="desktop">
      <DesktopIcons onOpenApp={openWindow} />
      
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
            {renderAppContent(window.appType)}
          </Window>
        )
      ))}
      
      <Taskbar 
        windows={windows}
        onWindowClick={(id) => focusWindow(id)}
        onOpenApp={openWindow}
      />
    </div>
  )
}

export default Desktop