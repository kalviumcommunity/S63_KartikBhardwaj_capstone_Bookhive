import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedBooks from './components/FeaturedBooks'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <Hero />
        <FeaturedBooks />
      </div>
    </ThemeProvider>
  )
}

export default App
