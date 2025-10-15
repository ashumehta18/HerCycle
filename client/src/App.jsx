import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tracker from './pages/Tracker'
import PCOS from './pages/PCOS'
import Chatbot from './pages/Chatbot'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Tips from './pages/Tips'
import About from './pages/About'
import Report from './pages/Report'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route path="/pcos" element={<ProtectedRoute><PCOS /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/tips" element={<Tips />} />
  <Route path="/about" element={<About />} />
    <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" />
    </div>
  )
}
