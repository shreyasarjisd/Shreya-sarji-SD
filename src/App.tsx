import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AIChatBox from './components/AIChatBox';
import LoginPage from './pages/Login';
import OnboardingPage from './pages/Onboarding';
import PatientDashboard from './pages/PatientDashboard';
import PatientUpload from './pages/PatientUpload';
import PatientTimeline from './pages/PatientTimeline';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientView from './pages/DoctorPatientView';

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: 'patient' | 'doctor' }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  if (profile && !profile.onboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/onboarding" element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        } />

        {/* Dashboard handles root based on role */}
        <Route path="/" element={
          <PrivateRoute>
            {profile?.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}
          </PrivateRoute>
        } />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <PrivateRoute role="patient">
            <PatientDashboard />
          </PrivateRoute>
        } />
        <Route path="/patient/upload" element={
          <PrivateRoute role="patient">
            <PatientUpload />
          </PrivateRoute>
        } />
        <Route path="/patient/timeline" element={
          <PrivateRoute role="patient">
            <PatientTimeline />
          </PrivateRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <PrivateRoute role="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        } />
        <Route path="/doctor/patient/:id" element={
          <PrivateRoute role="doctor">
            <DoctorPatientView />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChatBox />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
