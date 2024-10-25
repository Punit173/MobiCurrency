import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Exchange from "./components/Exchange";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Wallet from './components/Wallet';
import { Route, Routes } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </>
  )
}

export default App
