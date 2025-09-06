import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Analyze', 'Optimize', 'Transform', 'Enhance'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/analysis-dashboard');
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Animated Synthwave Background */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          {/* Animated Audio Waves */}
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${300 + i * 20} Q250,${280 + i * 15} 500,${300 + i * 20} T1000,${300 + i * 20}`}
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0],
                strokeWidth: [1, 3, 1]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Central Synthwave Grid */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
            {[...Array(20)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="600"
                stroke="#8B5CF6"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 50}
                x2="1000"
                y2={i * 50}
                stroke="#8B5CF6"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </motion.g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <motion.span 
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-purple-400 inline-block"
            >
              {words[currentWord]}
            </motion.span> Your Sales Calls
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Transform conversations into actionable insights with AI-powered analysis, 
            real-time transcription, and intelligent recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Button
              onClick={handleGetStarted}
              size="xl"
              className="w-full sm:w-auto min-w-[200px]"
              iconName="Play"
              iconPosition="left"
            >
              Get Started
            </Button>
            
            <Button
              onClick={() => navigate('/demo')}
              variant="outline"
              size="xl"
              className="w-full sm:w-auto min-w-[200px]"
              iconName="Eye"
              iconPosition="left"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;