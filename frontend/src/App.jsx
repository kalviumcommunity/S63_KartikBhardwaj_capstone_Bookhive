import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedBooks from './components/FeaturedBooks'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Books from './components/Books'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="app">
              <Navbar />
              <Hero />
              <FeaturedBooks />
            </div>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<Books />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
