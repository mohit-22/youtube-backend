// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// 1. Context ko import karein
import { AuthProvider } from './context/AuthContext'; 

// 2. Components ko import karein
import Navbar from './components/Navbar'; 

// 3. Saare Pages ko import karein (Ab tak ke saare features)
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import ChannelDetail from './pages/ChannelDetail';
import SearchFeed from './pages/SearchFeed';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Settings from './pages/Settings';           // Step 13
import ChangePassword from './pages/ChangePassword'; // New: Step 14 ka page

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
        <Navbar />

        <Routes>
          {/* --- Core Application Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
          <Route path="/video/:videoId" element={<VideoDetail />} />
          <Route path="/channel/:username" element={<ChannelDetail />} />
          
          {/* --- User Management & Creator Routes --- */}
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} /> // Account Details, Avatar, Cover
          <Route path="/change-password" element={<ChangePassword />} /> // New Route
          
          {/* --- Authentication Routes --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
    </AuthProvider>
  </BrowserRouter>
);

export default App;