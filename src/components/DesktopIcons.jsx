import { Settings, FolderOpen, Calculator, FileText } from 'lucide-react'

function DesktopIcons({ onOpenApp }) {
  const icons = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'fileexplorer', icon: FolderOpen, label: 'File Explorer' },
    { id: 'calculator', icon: Calculator, label: 'Calculator' },
    { id: 'notepad', icon: FileText, label: 'Notepad' }
  ]

  return (
    <div className="desktop-icons">
      {icons.map(icon => {
        const Icon = icon.icon
        return (
          <button
            key={icon.id}
            className="desktop-icon"
            onDoubleClick={() => onOpenApp(icon.id, icon.label)}
          >
            <div className="desktop-icon-image">
              <Icon size={24} />
            </div>
            <div className="desktop-icon-label">{icon.label}</div>
          </button>
        )
      })}
    </div>
  )
}

export default DesktopIcons