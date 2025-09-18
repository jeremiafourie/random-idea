import { Minus, Maximize2, X } from 'lucide-react'

function Window({ 
  id, 
  title, 
  x, 
  y, 
  width, 
  height, 
  zIndex, 
  children,
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus
}) {
  return (
    <div
      className="window"
      style={{
        width: width || 600,
        height: height || 400,
        zIndex: zIndex || 100,
        left: x || 100,
        top: y || 100,
        position: 'absolute'
      }}
      onMouseDown={() => onFocus && onFocus()}
    >
      <div className="window-header">
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button className="window-control minimize" onClick={onMinimize}>
            <Minus size={10} />
          </button>
          <button className="window-control maximize" onClick={onMaximize}>
            <Maximize2 size={10} />
          </button>
          <button className="window-control close" onClick={onClose}>
            <X size={10} />
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {children}
      </div>
    </div>
  )
}

export default Window