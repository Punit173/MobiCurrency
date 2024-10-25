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
import {Near} from './components/Near';
import Invest from './components/Invest';


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
        <Route path="/near" element={<Near />} />
        <Route path="/invest" element={<Invest />} />
      </Routes>
    </>
  )
}

export default App
