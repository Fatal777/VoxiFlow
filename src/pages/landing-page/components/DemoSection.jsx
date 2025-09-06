import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoData = [
    {
      id: 0,
      title: "AI Transcription",
      description: "Real-time speech-to-text with speaker identification",
      mockTranscript: [
        { speaker: "Sales Rep", time: "00:15", text: "Thanks for taking the time to speak with me today about our enterprise solution." },
        { speaker: "Prospect", time: "00:22", text: "Of course! I\'m interested in learning how this could help our sales team." },
        { speaker: "Sales Rep", time: "00:28", text: "Great! Let me walk you through our key features and how they align with your needs." }
      ]
    },
    {
      id: 1,
      title: "Smart Summarization",
      description: "AI-powered insights and key takeaways",
      mockSummary: {
        keyPoints: [
          "Prospect showed strong interest in enterprise features",
          "Budget range confirmed: $50K-$100K annually",
          "Decision timeline: Q1 2025 implementation"
        ],
        sentiment: "Positive",
        nextSteps: [
          "Send detailed pricing proposal",
          "Schedule technical demo with IT team",
          "Follow up within 48 hours"
        ]
      }
    },
    {
      id: 2,
      title: "Visual Flowcharts",
      description: "Interactive conversation flow mapping",
      mockFlowchart: [
        { id: 1, type: "start", label: "Call Initiated", x: 50, y: 20 },
        { id: 2, type: "process", label: "Introduction", x: 50, y: 40 },
        { id: 3, type: "decision", label: "Interest Level?", x: 50, y: 60 },
        { id: 4, type: "process", label: "Demo Request", x: 30, y: 80 },
        { id: 5, type: "process", label: "Objection Handling", x: 70, y: 80 }
      ]
    }
  ];

  const FlowchartNode = ({ node }) => {
    const getNodeStyle = () => {
      switch (node?.type) {
        case 'start':
          return 'bg-green-100 border-green-600 text-green-600';
        case 'decision':
          return 'bg-yellow-100 border-yellow-600 text-yellow-600 rounded-none transform rotate-45';
        case 'process':
          return 'bg-purple-100 border-purple-600 text-purple-600';
        default:
          return 'bg-gray-100 border-gray-300 text-gray-600';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: node?.id * 0.1 }}
        className={`absolute w-24 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-medium ${getNodeStyle()}`}
        style={{ left: `${node?.x}%`, top: `${node?.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        {node?.label}
      </motion.div>
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent mb-6"
          >
            See VoxiFlow in Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Experience how our AI transforms sales conversations into actionable insights through interactive demonstrations.
          </motion.p>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Demo Tabs */}
          <div className="lg:w-1/3">
            <div className="space-y-4">
              {demoData?.map((demo, index) => (
                <motion.button
                  key={demo?.id}
                  onClick={() => setActiveDemo(index)}
                  className={`w-full text-left p-4 sm:p-6 rounded-xl border transition-all duration-300 ${
                    activeDemo === index
                      ? 'border-purple-500 bg-purple-600/10 backdrop-blur-sm shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-purple-400 hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${
                    activeDemo === index ? 'text-purple-300' : 'text-white'
                  }`}>{demo?.title}</h3>
                  <p className={`text-sm ${
                    activeDemo === index ? 'text-gray-300' : 'text-gray-400'
                  }`}>{demo?.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 sm:p-8 h-80 sm:h-96 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  {activeDemo === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold mb-4">Live Transcript Analysis</h3>
                      {demoData?.[0]?.mockTranscript?.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.2 }}
                      className="flex gap-4 p-4 bg-white/70 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          entry?.speaker === 'Sales Rep' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {entry?.speaker === 'Sales Rep' ? 'SR' : 'PR'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{entry?.speaker}</span>
                          <span className="text-xs text-gray-500">{entry?.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{entry?.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeDemo === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Icon name="Key" size={20} className="text-purple-600" />
                        Key Points
                      </h4>
                      {demoData?.[1]?.mockSummary?.keyPoints?.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-white/70 rounded-lg"
                        >
                          <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-600">{point}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Icon name="TrendingUp" size={20} className="text-green-600" />
                        Sentiment: {demoData?.[1]?.mockSummary?.sentiment}
                      </h4>
                      
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-900">Next Steps:</h5>
                        {demoData?.[1]?.mockSummary?.nextSteps?.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                          >
                            <span className="text-xs bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-600">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDemo === 2 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="GitBranch" size={20} className="text-purple-600" />
                    Conversation Flow
                  </h4>
                  
                  <div className="relative h-80 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    {demoData?.[2]?.mockFlowchart?.map((node) => (
                      <FlowchartNode key={node?.id} node={node} />
                    ))}
                    
                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        d="M 50% 25% L 50% 45%"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-purple-400"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        d="M 50% 65% L 30% 75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-purple-400"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.2 }}
                        d="M 50% 65% L 70% 75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-purple-400"
                      />
                    </svg>
                  </div>
                </div>
              )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;