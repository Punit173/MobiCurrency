import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Exchange from "./components/Exchange";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Wallet from './components/Wallet';
import { Route, Routes } from 'react-router-dom';
import Payment from './components/Payment';
import Rates from './components/Rates';
import Contact from './components/Contact';
import  About from './components/About';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
