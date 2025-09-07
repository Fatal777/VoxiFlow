import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FlowchartVisualization = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const svgRef = useRef(null);

  const flowchartData = {
    nodes: [
      {
        id: 'start',
        type: 'start',
        x: 150,
        y: 50,
        label: 'Call Start',
        timestamp: '00:00',
        content: 'Initial greeting and introduction',
        sentiment: 'neutral'
      },
      {
        id: 'discovery',
        type: 'process',
        x: 150,
        y: 150,
        label: 'Discovery Phase',
        timestamp: '02:30',
        content: 'Understanding client needs and pain points',
        sentiment: 'positive'
      },
      {
        id: 'objection1',
        type: 'decision',
        x: 350,
        y: 150,
        label: 'Price Objection',
        timestamp: '08:15',
        content: 'Client expressed concern about pricing',
        sentiment: 'negative'
      },
      {
        id: 'response1',
        type: 'process',
        x: 350,
        y: 250,
        label: 'Value Proposition',
        timestamp: '09:45',
        content: 'Presented ROI calculations and case studies',
        sentiment: 'positive'
      },
      {
        id: 'closing',
        type: 'process',
        x: 150,
        y: 350,
        label: 'Closing Attempt',
        timestamp: '18:20',
        content: 'Asked for commitment and next steps',
        sentiment: 'neutral'
      },
      {
        id: 'outcome',
        type: 'end',
        x: 150,
        y: 450,
        label: 'Follow-up Scheduled',
        timestamp: '22:00',
        content: 'Meeting scheduled for next week',
        sentiment: 'positive'
      }
    ],
    connections: [
      { from: 'start', to: 'discovery' },
      { from: 'discovery', to: 'objection1' },
      { from: 'objection1', to: 'response1' },
      { from: 'response1', to: 'closing' },
      { from: 'closing', to: 'outcome' }
    ]
  };

  const buildFlowchart = async () => {
    setIsBuilding(true);
    setBuildStep(0);
    
    for (let i = 0; i <= flowchartData.nodes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBuildStep(i);
    }
    
    setIsBuilding(false);
  };

  const getNodeColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#30D158';
      case 'negative': return '#FF453A';
      default: return '#8A2BE2';
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'start': return 'Play';
      case 'end': return 'Square';
      case 'decision': return 'GitBranch';
      default: return 'Circle';
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div className="bg-gray-900/50 border border-purple-600/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-600/30">
        <div>
          <h3 className="text-lg font-semibold text-white">Conversation Flow</h3>
          <p className="text-sm text-gray-400">Interactive visualization of call progression</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={buildFlowchart}
            disabled={isBuilding}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name={isBuilding ? "Loader2" : "Play"} size={14} className={isBuilding ? "animate-spin" : ""} />
            <span>{isBuilding ? "Building..." : "Build Flow"}</span>
          </motion.button>
          
          <div className="w-px h-6 bg-gray-700" />
          
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="ZoomOut" size={16} className="text-gray-300" />
          </button>
          <span className="text-sm text-gray-400 px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="ZoomIn" size={16} className="text-gray-300" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="RotateCcw" size={16} className="text-gray-300" />
          </button>
        </div>
      </div>
      {/* Flowchart Canvas */}
      <div className="relative h-96 overflow-hidden bg-gray-800/30">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition?.x}px, ${panPosition?.y}px)`
          }}
        >
          {/* Connections */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#a855f7"
              />
            </marker>
          </defs>
          
          {flowchartData?.connections?.map((connection, index) => {
            const fromNode = flowchartData?.nodes?.find(n => n?.id === connection?.from);
            const toNode = flowchartData?.nodes?.find(n => n?.id === connection?.to);
            const shouldShow = !isBuilding || index < buildStep;
            
            return shouldShow ? (
              <motion.line
                key={index}
                x1={fromNode?.x + 60}
                y1={fromNode?.y + 30}
                x2={toNode?.x + 60}
                y2={toNode?.y}
                stroke="#a855f7"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              />
            ) : null;
          })}

          {/* Nodes */}
          {flowchartData?.nodes?.map((node, index) => {
            const shouldShow = !isBuilding || index < buildStep;
            
            return shouldShow ? (
              <motion.g
                key={node?.id}
                transform={`translate(${node?.x}, ${node?.y})`}
                className="cursor-pointer"
                onClick={() => handleNodeClick(node)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Node Background */}
                <rect
                  width="120"
                  height="60"
                  rx="12"
                  fill={selectedNode?.id === node?.id ? getNodeColor(node?.sentiment) : 'rgba(31, 41, 55, 0.8)'}
                  stroke={getNodeColor(node?.sentiment)}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                
                {/* Node Icon */}
                <foreignObject x="10" y="10" width="24" height="24">
                  <Icon 
                    name={getNodeIcon(node?.type)} 
                    size={16} 
                    color={selectedNode?.id === node?.id ? '#000' : '#fff'} 
                  />
                </foreignObject>
                
                {/* Node Label */}
                <text
                  x="60"
                  y="25"
                  textAnchor="middle"
                  fill={selectedNode?.id === node?.id ? '#000' : '#fff'}
                  fontSize="11"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {node?.label}
                </text>
                
                {/* Timestamp */}
                <text
                  x="60"
                  y="45"
                  textAnchor="middle"
                  fill={selectedNode?.id === node?.id ? '#000' : '#a1a1aa'}
                  fontSize="9"
                  className="pointer-events-none"
                >
                  {node?.timestamp}
                </text>
              </motion.g>
            ) : null;
          })}
        </svg>

        {/* Node Details Panel */}
        {selectedNode && (
          <motion.div 
            className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur border border-purple-600/30 rounded-lg p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode?.sentiment) }}
                />
                <h4 className="font-semibold text-white">{selectedNode?.label}</h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Clock" size={14} className="text-gray-400" />
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white font-medium">{selectedNode?.timestamp}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-400">Content:</span>
                <p className="text-white mt-1 text-xs leading-relaxed">{selectedNode?.content}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Heart" size={14} className="text-gray-400" />
                <span className="text-gray-400">Sentiment:</span>
                <span 
                  className="font-medium capitalize px-2 py-1 rounded text-xs"
                  style={{ 
                    color: getNodeColor(selectedNode?.sentiment),
                    backgroundColor: `${getNodeColor(selectedNode?.sentiment)}20`
                  }}
                >
                  {selectedNode?.sentiment}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlowchartVisualization;