import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Resources from './pages/Resources';
import Bookings from './pages/Bookings';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/resources" replace />} />
            
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="resources" element={<Resources />} />
            
            <Route path="bookings" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Bookings />
              </ProtectedRoute>
            } />
            
            <Route path="my-bookings" element={
              <ProtectedRoute allowedRoles={['STUDENT', 'STAFF']}>
                <MyBookings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{ zIndex: 9999 }}
        toastClassName="shadow-lg rounded-xl"
      />
    </AuthProvider>
  );
}

export default App;
