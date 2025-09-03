import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import { AuthProvider } from './contexts/AuthContext';
import NotificationProvider from './contexts/NotificationContext';
import LandingPage from './pages/landing-page';
import UploadInterface from './pages/upload-interface';
import AnalysisDashboard from './pages/analysis-dashboard';
import ResultsSummary from './pages/results-summary';
import SettingsPage from './pages/settings';
import ProfilePage from './pages/profile';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import AuthCallback from './pages/auth/callback';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <RouterRoutes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload-interface" element={<UploadInterface />} />
            <Route path="/analysis-dashboard" element={<AnalysisDashboard />} />
            <Route path="/results-summary" element={<ResultsSummary />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
