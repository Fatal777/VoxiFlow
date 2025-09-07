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
    
    // Check if it's a sample file with pre-loaded data
    if (file.sampleData) {
      // For sample files, skip upload simulation and go straight to analysis
      setTimeout(() => {
        handleStartAnalysis(file);
      }, 500);
    } else {
      simulateUpload(file);
    }
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
    <div className="h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Upload Sales Call</h1>
            <p className="text-sm text-gray-400">Choose a file or record live</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setIsRecording(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  !isRecording ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Upload
              </button>
              <button
                onClick={toggleRecording}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isRecording ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Record
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {!isRecording ? (
              !selectedFile ? (
                <UploadZone
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              ) : (
                <FilePreview
                  file={selectedFile}
                  uploadProgress={uploadProgress}
                  isUploading={isUploading}
                  onRemove={handleRemoveFile}
                  onStartProcessing={handleStartProcessing}
                  processingStatus={processingStatus}
                />
              )
            ) : (
              <RecordingInterface
                onRecordingComplete={handleRecordingComplete}
                onCancel={() => setIsRecording(false)}
              />
            )}

            {processingStatus && processingStatus !== 'idle' && (
              <ProcessingStatus
                status={processingStatus}
                progress={processingProgress}
                message={processingMessage}
                onComplete={handleProcessingComplete}
                onCancel={handleCancelProcessing}
              />
            )}
          </div>
        </div>
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
      
    </div>
  );
};

export default UploadInterface;