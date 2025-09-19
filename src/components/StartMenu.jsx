import { useState } from 'react'
import { Settings, FolderOpen, FileText, User, Power, Search, Grid3X3 } from 'lucide-react'
import { useSystem } from './Desktop'

function StartMenu({ isOpen, onClose }) {
  const { systemState, openWindow, onLogout } = useSystem()
  const [searchQuery, setSearchQuery] = useState('')

  const pinnedApps = [
    { id: 'settings', icon: Settings, label: 'Settings', color: '#0078d4' },
    { id: 'fileexplorer', icon: FolderOpen, label: 'File Explorer', color: '#FFD700' },
    { id: 'notepad', icon: FileText, label: 'Notepad', color: '#28ca42' }
  ]

  const recentFiles = [
    { name: 'readme.txt', path: 'C:\\Users\\Desktop\\readme.txt' },
    { name: 'notes.txt', path: 'C:\\Users\\Desktop\\notes.txt' },
    { name: 'presentation.pptx', path: 'C:\\Users\\Documents\\presentation.pptx' }
  ]

  const handleAppClick = (appId, appLabel) => {
    openWindow(appId, appLabel)
    onClose()
  }

  const handlePowerClick = () => {
    if (confirm('Are you sure you want to sign out?')) {
      onLogout()
    }
  }

  const filteredApps = pinnedApps.filter(app => 
    app.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="start-menu-backdrop"
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="start-menu">
        {/* Search Bar */}
        <div className="start-menu-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="start-menu-search-input"
          />
        </div>

        {/* Pinned Apps */}
        <div className="start-menu-section">
          <div className="start-menu-section-header">
            <span>Pinned</span>
            <Grid3X3 size={16} />
          </div>
          <div className="start-menu-apps">
            {filteredApps.map(app => {
              const Icon = app.icon
              return (
                <button
                  key={app.id}
                  className="start-menu-app"
                  onClick={() => handleAppClick(app.id, app.label)}
                >
                  <div 
                    className="start-menu-app-icon"
                    style={{ backgroundColor: app.color }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <span className="start-menu-app-label">{app.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Files */}
        <div className="start-menu-section">
          <div className="start-menu-section-header">
            <span>Recent</span>
          </div>
          <div className="start-menu-recent">
            {recentFiles.map((file, index) => (
              <div key={index} className="start-menu-recent-item">
                <FileText size={16} />
                <div className="start-menu-recent-info">
                  <div className="start-menu-recent-name">{file.name}</div>
                  <div className="start-menu-recent-path">{file.path}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile & Power */}
        <div className="start-menu-footer">
          <div className="start-menu-user">
            <div className="start-menu-user-avatar">
              <User size={20} />
            </div>
            <div className="start-menu-user-info">
              <div className="start-menu-user-name">{systemState.userProfile.name}</div>
              <div className="start-menu-user-email">{systemState.userProfile.email}</div>
            </div>
          </div>
          <button 
            className="start-menu-power"
            onClick={handlePowerClick}
            title="Sign out"
          >
            <Power size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

export default StartMenu