import { useState } from 'react'

function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const buttons = [
    ['C', 'CE', '←', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '=']
  ]

  const handleButtonClick = (button) => {
    if (button >= '0' && button <= '9') {
      inputNumber(parseInt(button))
    } else if (button === '.') {
      inputDecimal()
    } else if (button === '=') {
      performCalculation()
    } else if (button === 'C') {
      clear()
    } else if (button === 'CE') {
      clearEntry()
    } else if (button === '←') {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1))
      } else {
        setDisplay('0')
      }
    } else if (['+', '-', '×', '÷'].includes(button)) {
      inputOperation(button)
    }
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#2d2d2d',
      borderRadius: '4px'
    }}>
      <div style={{
        padding: '20px',
        background: '#1e1e1e',
        borderRadius: '4px 4px 0 0',
        textAlign: 'right',
        fontSize: '24px',
        fontFamily: 'monospace',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {display}
      </div>
      
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: '#1a1a1a',
        padding: '1px'
      }}>
        {buttons.flat().map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button)}
            style={{
              background: ['C', 'CE', '←'].includes(button) ? '#404040' : 
                         ['+', '-', '×', '÷', '='].includes(button) ? '#0078d4' : '#333',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50px'
            }}
            onMouseEnter={(e) => {
              if (['C', 'CE', '←'].includes(button)) {
                e.target.style.background = '#505050'
              } else if (['+', '-', '×', '÷', '='].includes(button)) {
                e.target.style.background = '#106ebe'
              } else {
                e.target.style.background = '#404040'
              }
            }}
            onMouseLeave={(e) => {
              if (['C', 'CE', '←'].includes(button)) {
                e.target.style.background = '#404040'
              } else if (['+', '-', '×', '÷', '='].includes(button)) {
                e.target.style.background = '#0078d4'
              } else {
                e.target.style.background = '#333'
              }
            }}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CalculatorApp