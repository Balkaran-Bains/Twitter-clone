import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/home/HomePage.jsx"
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx"
import LoginPage from "./pages/auth/login/LoginPage.jsx"
import Sidebar from './components/common/Sidebar.jsx';
import RightPanel from './components/common/RightPanel.jsx';
import NotificationPage from './pages/notification/Notification.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Router>
        <Sidebar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/notifications' element={<NotificationPage />} />
          <Route path='/profile/:username' element={<ProfilePage />} />
        </Routes>
        <RightPanel/>
      </Router>
    </div>
  );
}

export default App;
