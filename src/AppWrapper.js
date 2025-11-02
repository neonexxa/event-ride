import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:eventId" element={<App />} />
    </Routes>
  );
}

export default AppWrapper;

