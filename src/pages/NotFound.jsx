import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import Footer from './landing-page/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <h1 className="text-9xl font-bold text-purple-600 opacity-20">404</h1>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist. Let's get you back!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => window.history?.back()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Go Back
            </Button>

            <Button
              variant="outline"
              onClick={handleGoHome}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Icon name="Home" size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
