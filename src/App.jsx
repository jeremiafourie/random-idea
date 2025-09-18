import Desktop from './components/Desktop-simple'

function App() {
  try {
    return <Desktop />
  } catch (error) {
    console.error('Error rendering Desktop:', error)
    return <div style={{color: 'white', padding: '20px'}}>Error: {error.message}</div>
  }
}

export default App
