import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingStatus = ({ isVisible, file, onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(120); // seconds
  const [processingStartTime] = useState(Date.now());

  const processingSteps = [
    {
      id: 'upload',
      title: 'Uploading File',
      description: 'Securely transferring your audio file',
      icon: 'Upload',
      duration: 15
    },
    {
      id: 'validation',
      title: 'Validating Audio',
      description: 'Checking file format and quality',
      icon: 'Shield',
      duration: 10
    },
    {
      id: 'transcription',
      title: 'Transcribing Audio',
      description: 'Converting speech to text using AI',
      icon: 'FileText',
      duration: 60
    },
    {
      id: 'analysis',
      title: 'Analyzing Content',
      description: 'Extracting insights and patterns',
      icon: 'Brain',
      duration: 30
    },
    {
      id: 'completion',
      title: 'Finalizing Results',
      description: 'Preparing your comprehensive report',
      icon: 'CheckCircle',
      duration: 5
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3, 100);
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * processingSteps?.length);
        setCurrentStep(Math.min(stepIndex, processingSteps?.length - 1));
        
        // Update estimated time
        const elapsed = (Date.now() - processingStartTime) / 1000;
        const remaining = Math.max(0, estimatedTime - elapsed);
        setEstimatedTime(remaining);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
            navigate('/analysis-dashboard');
          }, 2000);
        }
        
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible, processingStartTime, estimatedTime, onComplete, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 border border-purple-600/30 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Processing Your Call</h3>
              <p className="text-sm text-gray-300 mt-1">
                AI analysis in progress - {file?.name}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-full">
                <Icon name="Zap" size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Overall Progress</p>
                <p className="text-xs text-gray-400">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {formatTime(estimatedTime)}
              </p>
              <p className="text-xs text-gray-400">remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="p-6 space-y-4">
          <h4 className="text-sm font-medium text-white mb-4">Processing Steps</h4>
          
          {processingSteps?.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;
            
            return (
              <div
                key={step?.id}
                className={`
                  flex items-center space-x-4 p-3 rounded-lg transition-all duration-300
                  ${isCurrent ? 'bg-purple-600/10 border border-purple-600/30' : 'bg-transparent'}
                `}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-600 text-white' 
                    : isCurrent 
                    ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`
                    text-sm font-medium transition-colors duration-300
                    ${isCompleted 
                      ? 'text-green-400' 
                      : isCurrent 
                      ? 'text-purple-400' : 'text-gray-400'
                    }
                  `}>
                    {step?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step?.description}
                  </p>
                </div>
                {isCurrent && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-xs text-purple-400 font-medium">Processing...</span>
                  </div>
                )}
                {isCompleted && (
                  <Icon name="CheckCircle" size={16} className="text-green-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Processing Info */}
        <div className="p-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <Icon name="Cpu" size={20} className="text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">AI Model</p>
              <p className="text-sm font-medium text-white">GPT-4 Turbo</p>
            </div>
            
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <Icon name="Shield" size={20} className="text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Security</p>
              <p className="text-sm font-medium text-white">Encrypted</p>
            </div>
            
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <Icon name="Clock" size={20} className="text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Priority</p>
              <p className="text-sm font-medium text-white">Standard</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Your file is being processed securely. You can safely close this window and return later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;