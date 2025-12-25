import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import Stock from './pages/Stock'
import ProfitLoss from './pages/ProfitLoss'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { AppLayout } from './components/layout/AppLayout' // Import AppLayout
import './index.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App> {/* App now wraps everything to provide global contexts */}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/404" element={<NotFound />} />

          {/* Protected routes wrapped by ProtectedRoute and AppLayout */}
          <Route element={<ProtectedRoute><AppLayout><Outlet /></AppLayout></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/profit-loss" element={<ProfitLoss />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all for any other unmatched routes within the protected area */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
)