import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(searchParams.get('error_description') || 'Authentication failed');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setStatus('authenticating');
        
        // Handle the authentication callback
        const user = await handleAuthCallback(code, state);
        
        setStatus('success');
        
        // Redirect based on the original state or default to dashboard
        const redirectTo = state === 'signup' ? '/upload-interface' : '/analysis-dashboard';
        
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 2000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error.message);
        setStatus('error');
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Processing...</h2>
            <p className="text-gray-400">Please wait while we set up your authentication.</p>
          </div>
        );

      case 'authenticating':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Authenticating</h2>
            <p className="text-gray-400">Verifying your credentials with ScaleKit...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Successful!</h2>
            <p className="text-gray-400">Redirecting you to VoxiFlow...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg">
          {/* VoxiFlow Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Mic" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">VoxiFlow</h1>
            <p className="text-gray-400 text-sm">AI-Powered Sales Call Analysis</p>
          </div>

          {/* Status Content */}
          {renderContent()}

          {/* ScaleKit Attribution */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              Secured by{' '}
              <span className="text-purple-400 font-medium">ScaleKit</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
