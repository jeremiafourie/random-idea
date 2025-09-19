import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react'

function WeatherWidget() {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'partly-cloudy',
    location: 'Your City',
    humidity: 65,
    windSpeed: 8
  })

  // Simulate weather updates
  useEffect(() => {
    const updateWeather = () => {
      const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy']
      const temperatures = [18, 20, 22, 24, 26, 28]
      
      setWeather(prev => ({
        ...prev,
        temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5 // 5-20 km/h
      }))
    }

    // Update weather every 30 seconds for demo
    const interval = setInterval(updateWeather, 30000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={16} color="#FFD700" />
      case 'partly-cloudy':
        return <Cloud size={16} color="#87CEEB" />
      case 'cloudy':
        return <Cloud size={16} color="#B0C4DE" />
      case 'rainy':
        return <CloudRain size={16} color="#4682B4" />
      case 'snowy':
        return <Snowflake size={16} color="#F0F8FF" />
      default:
        return <Sun size={16} color="#FFD700" />
    }
  }

  const getConditionText = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'Sunny'
      case 'partly-cloudy':
        return 'Partly Cloudy'
      case 'cloudy':
        return 'Cloudy'
      case 'rainy':
        return 'Rainy'
      case 'snowy':
        return 'Snowy'
      default:
        return 'Clear'
    }
  }

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="weather-temp">
          {weather.temperature}°C
        </div>
      </div>
      <div className="weather-details">
        <div className="weather-condition">
          {getConditionText(weather.condition)}
        </div>
        <div className="weather-location">
          {weather.location}
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget