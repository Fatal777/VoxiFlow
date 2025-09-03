import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import FlowchartMaker from '../../../components/ui/FlowchartMaker';
import { useAnalysis } from '../../../contexts/AnalysisContext';

const FlowchartPanel = ({ transcript, insights }) => {
  const { generateSpeech } = useAnalysis();
  const [flowchartData, setFlowchartData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'overview'

  const handleFlowchartUpdate = (data) => {
    setFlowchartData(data);
  };

  const exportFlowchart = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // In a real implementation, this would generate and download the flowchart
      const dataStr = JSON.stringify(flowchartData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `flowchart-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setIsExporting(false);
    }, 1000);
  };

  const generateFlowchartSummary = async () => {
    if (!flowchartData || !flowchartData.nodes) return;
    
    const summary = `Conversation flowchart contains ${flowchartData.nodes.length} key decision points and ${flowchartData.connections.length} transitions. The conversation flow shows the progression from initial contact through various discussion points to conclusion.`;
    
    try {
      await generateSpeech(summary);
    } catch (error) {
      console.error('Failed to generate flowchart summary speech:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Icon name="GitBranch" size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Conversation Flow</h3>
            <p className="text-sm text-gray-600">Visual representation of call progression</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'interactive'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Interactive
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'overview'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
          </div>

          {/* Action Buttons */}
          {flowchartData && (
            <>
              <Button
                onClick={generateFlowchartSummary}
                size="sm"
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Icon name="Volume2" size={16} className="mr-2" />
                Listen
              </Button>
              <Button
                onClick={exportFlowchart}
                disabled={isExporting}
                size="sm"
                variant="outline"
              >
                {isExporting ? (
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                ) : (
                  <Icon name="Download" size={16} className="mr-2" />
                )}
                Export
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'interactive' ? (
          <FlowchartMaker
            transcript={transcript}
            insights={insights}
            onFlowchartUpdate={handleFlowchartUpdate}
          />
        ) : (
          <FlowchartOverview flowchartData={flowchartData} />
        )}
      </div>
    </div>
  );
};

// Overview component for simplified flowchart view
const FlowchartOverview = ({ flowchartData }) => {
  if (!flowchartData || !flowchartData.nodes) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Icon name="GitBranch" size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No flowchart data available</p>
        </div>
      </div>
    );
  }

  const nodeTypeStats = flowchartData.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{flowchartData.nodes.length}</div>
            <div className="text-sm text-gray-600">Total Nodes</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{flowchartData.connections.length}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
        </div>

        {/* Node Type Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversation Elements</h4>
          <div className="space-y-3">
            {Object.entries(nodeTypeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(type)}`} />
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}s</span>
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flow Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Flow Summary</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Conversation progressed through {flowchartData.nodes.length} key decision points</p>
            <p>• {flowchartData.connections.length} transitions between topics</p>
            <p>• Flow analysis helps identify conversation patterns and optimization opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getNodeTypeColor = (type) => {
  const colors = {
    start: 'bg-green-500',
    question: 'bg-blue-500',
    objection: 'bg-red-500',
    response: 'bg-purple-500',
    decision: 'bg-yellow-500',
    outcome: 'bg-gray-500',
    end: 'bg-gray-700'
  };
  return colors[type] || 'bg-gray-400';
};

export default FlowchartPanel;
