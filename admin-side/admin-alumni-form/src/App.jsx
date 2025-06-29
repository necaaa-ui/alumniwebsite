import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import CompanyPage from './pages/CompanyPage';
import UserPage from './pages/UserPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/user/:token" element={<UserPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
