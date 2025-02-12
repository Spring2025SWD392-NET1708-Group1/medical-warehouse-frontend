import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Header } from './components/Header'
import { Hero } from './components/Home/Hero'

function App() {

  return (
    <>
      <Header />
      <Hero />
    </>
  )
}

export default App
