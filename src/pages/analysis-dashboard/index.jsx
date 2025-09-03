import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import TranscriptPanel from './components/TranscriptPanel';
import SummaryPanel from './components/SummaryPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import FlowchartPanel from './components/FlowchartPanel';
import VoxaAssistant from './components/VoxaAssistant';
import ProcessingStatus from './components/ProcessingStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAnalysis } from '../../contexts/AnalysisContext';

const AnalysisDashboard = () => {
  const navigate = useNavigate();
  const { 
    transcript, 
    insights, 
    processingStatus, 
    processingProgress, 
    processingMessage, 
    error,
    currentFile 
  } = useAnalysis();
  const [activeView, setActiveView] = useState('transcript');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const views = [
    { id: 'transcript', label: 'Transcript', icon: 'FileText' },
    { id: 'summary', label: 'Summary', icon: 'BookOpen' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'flowchart', label: 'Flowchart', icon: 'GitBranch' }
  ];

  // Mock data for when no real data is available
  const mockTranscript = [
    {
      speaker: 'Sales Rep',
      text: 'Good morning! Thank you for taking the time to speak with me today.',
      timestamp: 15,
      confidence: 0.95,
      emotions: [{ type: 'confident', confidence: 0.8 }]
    },
    {
      speaker: 'Client',
      text: 'Hi, yes that\'s right. We\'re looking for a solution to streamline our workflow.',
      timestamp: 45,
      confidence: 0.92,
      emotions: [{ type: 'interested', confidence: 0.7 }]
    }
  ];

  const mockRecommendations = [
    {
      title: 'Follow up on pricing concerns',
      priority: 'high',
      description: 'Client expressed budget concerns - prepare ROI calculator'
    },
    {
      title: 'Schedule product demo',
      priority: 'medium', 
      description: 'Client showed interest in seeing the platform in action'
    }
  ];

  const mockInsights = [
    {
      title: 'Strong Product-Market Fit',
      category: 'Opportunity',
      description: 'Client pain points align with our solution',
      priority: 'high',
      icon: 'Target'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const handleSeekTo = (timestamp) => {
    setCurrentTime(timestamp);
  };

  const handleTogglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNavigateToResults = () => {
    navigate('/results-summary');
  };

  // Show processing status
  if (processingStatus === 'processing') {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        {/* Processing Status Overlay */}
        {processingStatus === 'processing' && (
          <ProcessingStatus
            progress={processingProgress}
            message={processingMessage}
            onCancel={() => navigate('/upload-interface')}
          />
        )}

        {/* Main Content */}
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-3">Live Analysis Dashboard</h1>
                  <p className="text-xl text-gray-400">
                    {currentFile ? `Analyzing: ${currentFile}` : 'Real-time conversation insights and analytics'}
                  </p>
                </div>
                
                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/upload-interface')}
                    className="bg-gray-800/50 border-purple-600/50 text-white hover:bg-purple-600 hover:border-purple-500 rounded-2xl px-6 py-3"
                  >
                    <Icon name="Upload" size={18} className="mr-2" />
                    New Upload
                  </Button>
                  
                  <Button
                    onClick={() => setIsAssistantOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-3"
                  >
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Ask Voxa
                  </Button>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center space-x-2 bg-gray-900/50 backdrop-blur p-2 rounded-2xl border border-purple-600/30">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeView === view.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon name={view.icon} size={18} />
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Panel */}
              <div className="xl:col-span-3">
                <div className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl overflow-hidden">
                  {activeView === 'transcript' && (
                    <TranscriptPanel 
                      transcript={transcript || mockTranscript}
                      currentTime={currentTime}
                      onSeek={setCurrentTime}
                    />
                  )}
                  
                  {activeView === 'summary' && (
                    <SummaryPanel insights={insights || mockInsights} />
                  )}
                  
                  {activeView === 'analytics' && (
                    <AnalyticsPanel data={insights || mockInsights} />
                  )}
                  
                  {activeView === 'flowchart' && (
                    <FlowchartPanel data={insights || mockInsights} />
                  )}
                </div>
              </div>

              {/* Side Panel */}
              <div className="xl:col-span-1 space-y-6">
                {/* Audio Controls */}
                <div className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Icon name="Volume2" size={20} className="mr-3 text-purple-400" />
                    Audio Controls
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Play/Pause */}
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="text-white" />
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                        <span>22:15</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${(currentTime / 1335) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Volume */}
                    <div className="flex items-center space-x-3">
                      <Icon name="Volume1" size={16} className="text-gray-400" />
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-3/4" />
                      </div>
                      <Icon name="Volume2" size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Icon name="Activity" size={20} className="mr-3 text-purple-400" />
                    Live Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-medium">22:15</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400">Words</span>
                      <span className="text-white font-medium">2,847</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400">Sentiment</span>
                      <span className="text-green-400 font-medium">Positive</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-white font-medium">94%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Icon name="Zap" size={20} className="mr-3 text-purple-400" />
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 hover:text-white"
                      onClick={() => navigate('/results-summary')}
                    >
                      <Icon name="FileText" size={16} className="mr-3" />
                      View Full Report
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 hover:text-white"
                    >
                      <Icon name="Download" size={16} className="mr-3" />
                      Export Analysis
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 hover:text-white"
                    >
                      <Icon name="Share" size={16} className="mr-3" />
                      Share Results
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Voxa Assistant */}
        {isAssistantOpen && (
          <VoxaAssistant
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            transcript={transcript || mockTranscript}
            insights={insights || mockInsights}
          />
        )}
        
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <Icon name="AlertCircle" size={64} className="text-red-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Analysis Failed
              </h2>
              <p className="text-gray-300 mb-8">
                {error || 'Something went wrong during analysis. Please try again.'}
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'transcript':
        return (
          <TranscriptPanel
            transcript={transcript || mockTranscript}
            currentTime={currentTime}
            onSeekTo={handleSeekTo}
          />
        );
      case 'summary':
        return <SummaryPanel insights={insights} />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'flowchart':
        return <FlowchartPanel />;
      default:
        return <TranscriptPanel transcript={transcript || mockTranscript} />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className="pt-24 flex-1">
        {/* Header */}
        <div className="bg-gray-900 border-b border-purple-600/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Icon name="BarChart3" size={28} className="text-purple-400" />
                Analysis Dashboard
                <span className="text-gray-300 text-sm font-normal ml-2">
                  {currentFile?.name || 'Sales Call Analysis'}
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
              >
                Back to Home
              </Button>
              <Button
                onClick={handleNavigateToResults}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                iconName="ExternalLink"
                iconPosition="right"
              >
                View Results
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-purple-600/30 flex flex-col">
            <div className="p-4 border-b border-purple-600/30">
              <h2 className="font-semibold text-white mb-3">Analysis Views</h2>
              <div className="space-y-2">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeView === view.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon name={view.icon} size={16} />
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="p-4 border-b border-purple-600/30">
              <h3 className="font-semibold text-white mb-3">Playback</h3>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleTogglePlayback}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
                </Button>
                <span className="text-gray-300 text-sm">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">5:23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speakers</span>
                  <span className="text-white">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sentiment</span>
                  <span className="text-green-400">Positive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-black overflow-hidden">
            <div className="h-full bg-gray-900 border border-purple-600/30 rounded-lg m-4 overflow-hidden">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </main>

      {/* Voxa Assistant */}
      <VoxaAssistant
        isOpen={isAssistantOpen}
        onToggle={() => setIsAssistantOpen(!isAssistantOpen)}
        recommendations={mockRecommendations}
        insights={mockInsights}
      />
      
      <Footer />
    </div>
  );
};

export default AnalysisDashboard;