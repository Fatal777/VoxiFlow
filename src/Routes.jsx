import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from './contexts/AuthContext';
import NotificationProvider from './contexts/NotificationContext';
import {
  LandingPage,
  UploadInterface,
  AnalysisDashboard,
  ResultsSummary,
  SettingsPage,
  ProfilePage,
  LoginPage,
  SignupPage,
  AuthCallback,
  NotFound
} from './utils/lazyImports';

// Loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
