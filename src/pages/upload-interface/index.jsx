import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import UploadZone from './components/UploadZone';
import RecordingInterface from './components/RecordingInterface';
import AdvancedSettings from './components/AdvancedSettings';
import FilePreview from './components/FilePreview';
import ProcessingStatus from './components/ProcessingStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAnalysis } from '../../contexts/AnalysisContext';

const UploadInterface = () => {
  const navigate = useNavigate();
  const { startAnalysis, processingStatus, processingProgress, processingMessage } = useAnalysis();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [settings, setSettings] = useState({
    speakerIdentification: true,
    analysisDepth: 'comprehensive',
    outputFormat: 'detailed',
    languageDetection: true,
    sentimentAnalysis: true,
    keywordExtraction: true,
    competitiveAnalysis: false,
    customPrompts: '',
    confidenceThreshold: 0.8
  });

  // Mock upload simulation
  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    simulateUpload(file);
  };

  const handleRecordingComplete = (recordedFile) => {
    setSelectedFile(recordedFile);
    setIsRecording(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleStartProcessing = async () => {
    if (selectedFile) {
      try {
        await startAnalysis(selectedFile);
        // Navigate to analysis dashboard when processing completes
        navigate('/analysis-dashboard');
      } catch (error) {
        console.error('Analysis failed:', error);
      }
    }
  };

  const handleProcessingComplete = () => {
    navigate('/analysis-dashboard');
  };

  const handleCancelProcessing = () => {
    // Cancel processing logic would go here
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="Upload" size={16} />
              <span>Step 2 of 4</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Upload Your Sales Call
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Submit your recording for AI-powered analysis. Support for multiple formats 
              with advanced processing options and real-time feedback.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600/20 text-green-400 rounded-lg mx-auto mb-3">
                  <Icon name="Shield" size={24} />
                </div>
                <p className="text-sm font-medium text-white">Secure Upload</p>
                <p className="text-xs text-gray-400">End-to-end encryption</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 text-purple-400 rounded-lg mx-auto mb-3">
                  <Icon name="Zap" size={24} />
                </div>
                <p className="text-sm font-medium text-white">Fast Processing</p>
                <p className="text-xs text-gray-400">AI-powered analysis</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-600/20 text-yellow-400 rounded-lg mx-auto mb-3">
                  <Icon name="FileAudio" size={24} />
                </div>
                <p className="text-sm font-medium text-white">Multiple Formats</p>
                <p className="text-xs text-gray-400">MP3, WAV, M4A & more</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Interface */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Mode Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setIsRecording(false)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${!isRecording 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <Icon name="Upload" size={16} />
                  <span>Upload File</span>
                </button>
                
                <button
                  onClick={toggleRecording}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isRecording 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <Icon name="Mic" size={16} />
                  <span>Record Live</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8">
              {!isRecording ? (
                // File Upload Mode
                (<>
                  {!selectedFile ? (
                    <UploadZone
                      onFileSelect={handleFileSelect}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                    />
                  ) : (
                    <FilePreview
                      file={selectedFile}
                      onRemove={handleRemoveFile}
                      onProcess={handleStartProcessing}
                    />
                  )}
                </>)
              ) : (
                // Recording Mode
                (<RecordingInterface
                  onRecordingComplete={handleRecordingComplete}
                  isVisible={isRecording}
                />)
              )}

              {/* Advanced Settings Button */}
              {(selectedFile || isRecording) && (
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Advanced Settings
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Powerful Analysis Features
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our AI-powered platform provides comprehensive insights from your sales conversations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'Users',
                  title: 'Speaker Identification',
                  description: 'Automatically identify and separate different speakers in your conversation'
                },
                {
                  icon: 'Brain',
                  title: 'AI Summarization',
                  description: 'Get intelligent summaries with key points and action items extracted'
                },
                {
                  icon: 'BarChart3',
                  title: 'Sentiment Analysis',
                  description: 'Track emotional tone and engagement throughout the conversation'
                },
                {
                  icon: 'Search',
                  title: 'Keyword Extraction',
                  description: 'Identify important keywords, phrases, and topics discussed'
                },
                {
                  icon: 'Target',
                  title: 'Objection Detection',
                  description: 'Spot customer objections and concerns for better follow-up'
                },
                {
                  icon: 'TrendingUp',
                  title: 'Performance Insights',
                  description: 'Analyze talk time, engagement, and conversion indicators'
                }
              ]?.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-purple-600/30 rounded-xl p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 text-purple-400 rounded-lg mb-4">
                    <Icon name={feature?.icon} size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature?.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {feature?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Home
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Next:</span>
                <span className="text-white font-medium">Analysis Dashboard</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Modals */}
      <AdvancedSettings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <ProcessingStatus
        isVisible={processingStatus !== 'idle'}
        file={selectedFile}
        onComplete={handleProcessingComplete}
        onCancel={handleCancelProcessing}
      />
      
      <Footer />
    </div>
  );
};

export default UploadInterface;