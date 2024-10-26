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
import Rates from './components/Rates';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/near" element={<ProtectedRoute><Near /></ProtectedRoute>} />
        <Route path="/invest" element={<ProtectedRoute><Invest /></ProtectedRoute>} />
        <Route path="/rates" element={<ProtectedRoute><Rates /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
