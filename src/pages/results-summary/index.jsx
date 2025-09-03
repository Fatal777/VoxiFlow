import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../landing-page/components/Footer';

import KPICard from './components/KPICard';
import FlowchartVisualization from './components/FlowchartVisualization';
import TranscriptViewer from './components/TranscriptViewer';
import AnalyticsCharts from './components/AnalyticsCharts';
import ExportPanel from './components/ExportPanel';
import OpportunityHighlights from './components/OpportunityHighlights';

const ResultsSummary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const kpiData = [
    {
      title: 'Call Duration',
      value: '22:15',
      change: '+15%',
      changeType: 'positive',
      icon: 'Clock',
      description: 'Total conversation time',
      trend: 85
    },
    {
      title: 'Talk Time Ratio',
      value: '65:35',
      change: 'Optimal',
      changeType: 'positive',
      icon: 'Users',
      description: 'Sales Rep : Client speaking time',
      trend: 92
    },
    {
      title: 'Sentiment Score',
      value: '8.2/10',
      change: '+0.8',
      changeType: 'positive',
      icon: 'Heart',
      description: 'Overall conversation sentiment',
      trend: 82
    },
    {
      title: 'Engagement Level',
      value: '94%',
      change: '+12%',
      changeType: 'positive',
      icon: 'Activity',
      description: 'Client participation and interest',
      trend: 94
    },
    {
      title: 'Objections Raised',
      value: '3',
      change: '-2',
      changeType: 'positive',
      icon: 'AlertTriangle',
      description: 'Total concerns addressed',
      trend: 60
    },
    {
      title: 'Close Probability',
      value: '75%',
      change: '+25%',
      changeType: 'positive',
      icon: 'Target',
      description: 'AI-predicted deal likelihood',
      trend: 75
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'transcript', label: 'Transcript', icon: 'FileText' },
    { id: 'flowchart', label: 'Flow Chart', icon: 'GitBranch' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'opportunities', label: 'Opportunities', icon: 'Target' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  const callSummary = {
    date: 'December 2, 2024',
    time: '2:30 PM EST',
    participants: ['John Smith (Sales Rep)', 'Sarah Johnson (Client - VP Operations)'],
    outcome: 'Follow-up scheduled for December 5th',
    nextSteps: [
      'Send premium analytics demo video',
      'Prepare ROI calculator for client review',
      'Schedule technical deep-dive with IT team',
      'Follow up on budget approval timeline'
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <motion.div 
          className="flex items-center justify-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
            <motion.h2 
              className="text-2xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Generating Results Summary
            </motion.h2>
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Analyzing call data and preparing insights...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <motion.div 
          className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 border-b border-purple-600/30 pt-16 pb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-8">
            <motion.div 
              className="flex flex-col lg:flex-row items-center justify-between mb-12 space-y-8 lg:space-y-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <div className="flex items-center justify-center w-20 h-20 bg-purple-600/20 rounded-3xl border border-purple-600/30">
                    <Icon name="CheckCircle" size={32} className="text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                      Analysis
                      <span className="text-purple-400 block">Complete</span>
                    </h1>
                    <p className="text-xl text-gray-300">Comprehensive insights from your sales conversation</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                  <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-2xl border border-purple-600/30 hover:border-purple-400 transition-colors">
                    <Icon name="Calendar" size={18} className="text-gray-400" />
                    <span className="text-white font-medium">{callSummary?.date}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-2xl border border-purple-600/30 hover:border-purple-400 transition-colors">
                    <Icon name="Clock" size={18} className="text-gray-400" />
                    <span className="text-white font-medium">{callSummary?.time}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-2xl border border-purple-600/30 hover:border-purple-400 transition-colors">
                    <Icon name="Users" size={18} className="text-gray-400" />
                    <span className="text-white font-medium">{callSummary?.participants?.length} participants</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-2xl border border-purple-600/30 hover:border-purple-400 transition-colors">
                    <Icon name="Target" size={18} className="text-green-400" />
                    <span className="text-green-400 font-medium">75% close probability</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
                variants={itemVariants}
              >
                <Button
                  variant="outline"
                  onClick={() => navigate('/upload-interface')}
                  className="w-full sm:w-auto bg-gray-800/50 border-purple-600/50 text-white hover:bg-purple-600 hover:border-purple-500 rounded-2xl px-8 py-4 transition-all duration-300"
                >
                  <Icon name="Upload" size={18} className="mr-2" />
                  New Analysis
                </Button>
                <Button
                  onClick={() => setActiveTab('export')}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-8 py-4 shadow-lg transition-all duration-300"
                >
                  <Icon name="Share" size={18} className="mr-2" />
                  Share Results
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {kpiData?.map((kpi, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                >
                  <KPICard {...kpi} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Tabs - No longer sticky */}
        <motion.div 
          className="bg-gray-900/70 backdrop-blur border-b border-purple-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center space-x-2 overflow-x-auto py-6">
              {tabs?.map((tab) => (
                <motion.button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 hover-scale ${
                    activeTab === tab?.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800 bg-gray-900/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                className="space-y-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Call Summary */}
                <motion.div 
                  className="bg-gray-900 border border-purple-600/30 rounded-3xl p-8 hover:border-purple-400 transition-colors shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="flex items-center justify-center w-14 h-14 bg-purple-600/20 rounded-2xl">
                      <Icon name="FileText" size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Call Summary</h3>
                      <p className="text-gray-300">Key outcomes and next steps</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Participants</h4>
                        <div className="space-y-3">
                          {callSummary?.participants?.map((participant, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-2xl border border-purple-600/30">
                              <Icon name="User" size={18} className="text-gray-400" />
                              <span className="text-white font-medium">{participant}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Outcome</h4>
                        <div className="flex items-center space-x-3 p-3 bg-green-600/20 rounded-2xl border border-green-400/30">
                          <Icon name="CheckCircle" size={18} className="text-green-400" />
                          <span className="text-white font-medium">{callSummary?.outcome}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-4 text-lg">Next Steps</h4>
                      <div className="space-y-3">
                        {callSummary?.nextSteps?.map((step, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-start space-x-3 p-4 bg-gray-800 rounded-2xl border border-purple-600/30 hover:border-purple-400 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-3 h-3 bg-purple-400 rounded-full mt-2" />
                            <span className="text-white font-medium flex-1">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnalyticsCharts />
                </motion.div>
                
                {/* Opportunities Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <OpportunityHighlights />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'transcript' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TranscriptViewer />
              </motion.div>
            )}

            {activeTab === 'flowchart' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <FlowchartVisualization />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AnalyticsCharts />
              </motion.div>
            )}

            {activeTab === 'opportunities' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <OpportunityHighlights />
              </motion.div>
            )}

            {activeTab === 'export' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ExportPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Bar */}
        <motion.div 
          className="fixed bottom-8 right-8 flex items-center space-x-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate('/analysis-dashboard')}
            className="bg-gray-800/80 backdrop-blur hover:scale-105 transition-transform rounded-2xl px-5 py-3 border-2 border-purple-600/30 text-white hover:border-purple-400"
          >
            Back to Analysis
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => setActiveTab('export')}
            className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all rounded-2xl px-5 py-3 shadow-lg"
          >
            Export Results
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsSummary;