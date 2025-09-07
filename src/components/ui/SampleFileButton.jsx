import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DemoCallSelector from './DemoCallSelector';

const SampleFileButton = ({ onFileSelect }) => {
  const [showSelector, setShowSelector] = useState(false);

  const handleDemoSelect = (demo) => {
    // Create a mock file object with the selected demo data
    const sampleFile = {
      name: `${demo.title.toLowerCase().replace(/\s+/g, '-')}.mp3`,
      size: Math.floor(Math.random() * 5000000) + 1000000, // Random size between 1-6MB
      type: 'audio/mpeg',
      lastModified: Date.now(),
      sampleData: demo.sampleData
    };

    onFileSelect(sampleFile);
    setShowSelector(false);
  };

  return (
    <div className="w-full space-y-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="w-full p-4 border-2 border-dashed border-purple-600/50 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white mb-1">Try Demo Sales Calls</p>
              <p className="text-xs text-gray-400">Choose from realistic conversation scenarios</p>
            </div>
          </div>
        </button>
      </motion.div>

      <DemoCallSelector 
        isVisible={showSelector}
        onSelectDemo={handleDemoSelect}
      />
    </div>
  );
};

export default SampleFileButton;
