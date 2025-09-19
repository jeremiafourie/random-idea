import { useState } from 'react'
import { Settings, FolderOpen, FileText, Bell } from 'lucide-react'
import { useSystem } from './Desktop'
import WeatherWidget from './WeatherWidget'
import StartMenu from './StartMenu'

function Taskbar({ windows, onWindowClick, onOpenApp }) {
  const { systemState, showNotifications, setShowNotifications } = useSystem()
  const [showStartMenu, setShowStartMenu] = useState(false)
  const apps = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'fileexplorer', icon: FolderOpen, label: 'File Explorer' },
    { id: 'notepad', icon: FileText, label: 'Notepad' }
  ]

  return (
    <div className="taskbar">
      {/* Left side - Weather */}
      <div className="taskbar-left">
        <WeatherWidget />
      </div>

      {/* Center - Start Button + Apps */}
      <div className="taskbar-center">
        {/* Start Button */}
        <button 
          className="taskbar-logo-button"
          onClick={() => {
            setShowStartMenu(!showStartMenu)
            setShowNotifications(false)
          }}
          title="Start"
        >
          <img 
            src="/logo.png" 
            alt="Start" 
            className="taskbar-logo"
            onError={(e) => {
              // Fallback if logo.png doesn't exist
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="taskbar-logo-fallback" style={{ display: 'none' }}>
            ⊞
          </div>
        </button>
        
        {/* Apps section */}
        <div className="taskbar-apps">
          {apps.map(app => {
            const Icon = app.icon
            const isActive = windows.some(w => w.appType === app.id && !w.isMinimized)
            
            return (
              <button
                key={app.id}
                className={`taskbar-app ${isActive ? 'active' : ''}`}
                onClick={() => {
                  const existingWindow = windows.find(w => w.appType === app.id)
                  if (existingWindow) {
                    onWindowClick(existingWindow.id)
                  } else {
                    onOpenApp(app.id, app.label)
                  }
                }}
                title={app.label}
              >
                <Icon size={16} />
              </button>
            )
          })}
          
          {windows.filter(w => w.isMinimized).map(window => (
            <button
              key={window.id}
              className="taskbar-app"
              onClick={() => onWindowClick(window.id)}
              title={window.title}
            >
              📱
            </button>
          ))}
        </div>
      </div>

      {/* Right side - Notifications and clock */}
      <div className="taskbar-right">
        <div className="taskbar-clock">
          {new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          })}
        </div>
        
        <div className="taskbar-notifications">
          <button 
            className={`taskbar-notification-button ${systemState.notifications?.length > 0 ? 'has-notifications' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications)
            }}
            title={`${systemState.notifications?.length || 0} notifications`}
          >
            <Bell size={16} />
            {systemState.notifications?.length > 0 && (
              <div className="notification-badge">
                {systemState.notifications.length > 99 ? '99+' : systemState.notifications.length}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Start Menu */}
      <StartMenu 
        isOpen={showStartMenu}
        onClose={() => setShowStartMenu(false)}
      />
    </div>
  )
}

export default Taskbar