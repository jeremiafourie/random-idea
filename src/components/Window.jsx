import { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Minus, Maximize2, X } from 'lucide-react'

function Window({ 
  id, 
  title, 
  x, 
  y, 
  width, 
  height, 
  zIndex, 
  isMaximized,
  children,
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus, 
  onMove, 
  onResize 
}) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const windowRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      let newWidth = startSize.width
      let newHeight = startSize.height
      let newX = x
      let newY = y

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(300, startSize.width + deltaX)
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(200, startSize.height + deltaY)
      }
      if (resizeDirection.includes('left')) {
        const widthChange = startSize.width - deltaX
        if (widthChange >= 300) {
          newWidth = widthChange
          newX = x + deltaX
        }
      }
      if (resizeDirection.includes('top')) {
        const heightChange = startSize.height - deltaY
        if (heightChange >= 200) {
          newHeight = heightChange
          newY = y + deltaY
        }
      }

      onResize(newWidth, newHeight)
      if (newX !== x || newY !== y) {
        onMove(newX, newY)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection('')
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, startPos, startSize, resizeDirection, x, y, onResize, onMove])

  const handleResizeStart = (direction) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize({ width, height })
    onFocus()
  }

  const handleDrag = (e, data) => {
    onMove(data.x, data.y)
  }

  return (
    <Draggable
      handle=".window-header"
      position={{ x, y }}
      onDrag={handleDrag}
      disabled={isMaximized}
    >
      <div
        ref={windowRef}
        className="window"
        style={{
          width: isMaximized ? '100vw' : width,
          height: isMaximized ? 'calc(100vh - 48px)' : height,
          zIndex,
          top: isMaximized ? 0 : undefined,
          left: isMaximized ? 0 : undefined,
          position: isMaximized ? 'fixed' : 'absolute'
        }}
        onMouseDown={() => onFocus()}
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

        {!isMaximized && (
          <>
            <div
              className="resize-handle resize-right"
              onMouseDown={handleResizeStart('right')}
              style={{
                position: 'absolute',
                right: 0,
                top: '32px',
                width: '4px',
                height: 'calc(100% - 32px)',
                cursor: 'ew-resize',
                background: 'transparent'
              }}
            />
            <div
              className="resize-handle resize-bottom"
              onMouseDown={handleResizeStart('bottom')}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                cursor: 'ns-resize',
                background: 'transparent'
              }}
            />
            <div
              className="resize-handle resize-bottom-right"
              onMouseDown={handleResizeStart('bottom-right')}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '8px',
                height: '8px',
                cursor: 'nw-resize',
                background: 'transparent'
              }}
            />
          </>
        )}
      </div>
    </Draggable>
  )
}

export default Window