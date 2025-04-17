import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
