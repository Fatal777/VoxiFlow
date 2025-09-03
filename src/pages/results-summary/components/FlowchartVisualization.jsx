import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const FlowchartVisualization = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const flowchartData = {
    nodes: [
      {
        id: 'start',
        type: 'start',
        x: 100,
        y: 50,
        label: 'Call Start',
        timestamp: '00:00',
        content: 'Initial greeting and introduction',
        sentiment: 'neutral'
      },
      {
        id: 'discovery',
        type: 'process',
        x: 100,
        y: 150,
        label: 'Discovery Phase',
        timestamp: '02:30',
        content: 'Understanding client needs and pain points',
        sentiment: 'positive'
      },
      {
        id: 'objection1',
        type: 'decision',
        x: 300,
        y: 150,
        label: 'Price Objection',
        timestamp: '08:15',
        content: 'Client expressed concern about pricing',
        sentiment: 'negative'
      },
      {
        id: 'response1',
        type: 'process',
        x: 300,
        y: 250,
        label: 'Value Proposition',
        timestamp: '09:45',
        content: 'Presented ROI calculations and case studies',
        sentiment: 'positive'
      },
      {
        id: 'closing',
        type: 'process',
        x: 100,
        y: 350,
        label: 'Closing Attempt',
        timestamp: '18:20',
        content: 'Asked for commitment and next steps',
        sentiment: 'neutral'
      },
      {
        id: 'outcome',
        type: 'end',
        x: 100,
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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Conversation Flow</h3>
          <p className="text-sm text-muted-foreground">Interactive visualization of call progression</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Icon name="ZoomOut" size={16} />
          </button>
          <span className="text-sm text-muted-foreground px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Icon name="ZoomIn" size={16} />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
          </button>
        </div>
      </div>
      {/* Flowchart Canvas */}
      <div className="relative h-96 overflow-hidden bg-muted/20">
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
                fill="rgba(255, 255, 255, 0.6)"
              />
            </marker>
          </defs>
          
          {flowchartData?.connections?.map((connection, index) => {
            const fromNode = flowchartData?.nodes?.find(n => n?.id === connection?.from);
            const toNode = flowchartData?.nodes?.find(n => n?.id === connection?.to);
            
            return (
              <line
                key={index}
                x1={fromNode?.x + 50}
                y1={fromNode?.y + 40}
                x2={toNode?.x + 50}
                y2={toNode?.y}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {flowchartData?.nodes?.map((node) => (
            <g
              key={node?.id}
              transform={`translate(${node?.x}, ${node?.y})`}
              className="cursor-pointer transition-all duration-300 hover:scale-110"
              onClick={() => handleNodeClick(node)}
            >
              {/* Node Background */}
              <rect
                width="100"
                height="40"
                rx="8"
                fill={selectedNode?.id === node?.id ? getNodeColor(node?.sentiment) : 'rgba(255, 255, 255, 0.1)'}
                stroke={getNodeColor(node?.sentiment)}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Node Icon */}
              <foreignObject x="8" y="8" width="24" height="24">
                <Icon 
                  name={getNodeIcon(node?.type)} 
                  size={16} 
                  color={selectedNode?.id === node?.id ? '#000' : '#fff'} 
                />
              </foreignObject>
              
              {/* Node Label */}
              <text
                x="50"
                y="25"
                textAnchor="middle"
                fill={selectedNode?.id === node?.id ? '#000' : '#fff'}
                fontSize="12"
                fontWeight="500"
                className="pointer-events-none"
              >
                {node?.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-popover border border-border rounded-lg p-4 shadow-elevation-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode?.sentiment) }}
                />
                <h4 className="font-semibold text-foreground">{selectedNode?.label}</h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="text-foreground font-medium">{selectedNode?.timestamp}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Content:</span>
                <p className="text-foreground mt-1">{selectedNode?.content}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Heart" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">Sentiment:</span>
                <span 
                  className="font-medium capitalize"
                  style={{ color: getNodeColor(selectedNode?.sentiment) }}
                >
                  {selectedNode?.sentiment}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowchartVisualization;