import { Settings, FolderOpen, Calculator } from 'lucide-react'

function Taskbar({ windows, onWindowClick, onOpenApp }) {
  const apps = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'fileexplorer', icon: FolderOpen, label: 'File Explorer' },
    { id: 'calculator', icon: Calculator, label: 'Calculator' }
  ]

  return (
    <div className="taskbar">
      <button className="start-button">
        ⊞
      </button>
      
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
  )
}

export default Taskbar