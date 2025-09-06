// Lazy imports for code splitting and better performance
import { lazy } from 'react';

// Main pages - lazy loaded for better performance
export const LandingPage = lazy(() => import('../pages/landing-page'));
export const UploadInterface = lazy(() => import('../pages/upload-interface'));
export const AnalysisDashboard = lazy(() => import('../pages/analysis-dashboard'));
export const ResultsSummary = lazy(() => import('../pages/results-summary'));
export const SettingsPage = lazy(() => import('../pages/settings'));
export const ProfilePage = lazy(() => import('../pages/profile'));

// Auth pages
export const LoginPage = lazy(() => import('../pages/auth/login'));
export const SignupPage = lazy(() => import('../pages/auth/signup'));
export const AuthCallback = lazy(() => import('../pages/auth/callback'));

// Error page
export const NotFound = lazy(() => import('../pages/NotFound'));

// Heavy components that can be lazy loaded
export const FlowchartMaker = lazy(() => import('../components/ui/FlowchartMaker'));
export const VoiceRecorder = lazy(() => import('../components/ui/VoiceRecorder'));
export const GlobalVoxaAssistant = lazy(() => import('../components/ui/GlobalVoxaAssistant'));

// Chart components
export const AnalyticsCharts = lazy(() => import('../pages/results-summary/components/AnalyticsCharts'));
export const FlowchartVisualization = lazy(() => import('../pages/results-summary/components/FlowchartVisualization'));
