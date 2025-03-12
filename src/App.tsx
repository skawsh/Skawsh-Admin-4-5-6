
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Studios from './pages/Studios';
import AddStudio from './pages/AddStudio';
import EditStudio from './pages/EditStudio';
import Orders from './pages/Orders';
import Drivers from './pages/Drivers';
import Revenue from './pages/Revenue';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Services from './pages/Services';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/studios/add" element={<AddStudio />} />
        <Route path="/studios/edit/:id" element={<EditStudio />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
        <Route path="/services" element={<Services />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
