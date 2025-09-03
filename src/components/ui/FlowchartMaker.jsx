import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';

const FlowchartMaker = ({ transcript, insights, onFlowchartUpdate }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Node types with colors and icons
  const nodeTypes = {
    start: { color: 'bg-green-500', icon: 'Play', label: 'Start' },
    question: { color: 'bg-blue-500', icon: 'HelpCircle', label: 'Question' },
    objection: { color: 'bg-red-500', icon: 'AlertTriangle', label: 'Objection' },
    response: { color: 'bg-purple-500', icon: 'MessageSquare', label: 'Response' },
    decision: { color: 'bg-yellow-500', icon: 'GitBranch', label: 'Decision' },
    outcome: { color: 'bg-gray-500', icon: 'Target', label: 'Outcome' },
    end: { color: 'bg-gray-700', icon: 'Square', label: 'End' }
  };

  // Generate flowchart from transcript and insights
  const generateFlowchart = useCallback(() => {
    if (!transcript || transcript.length === 0) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newNodes = [];
      const newConnections = [];
      let nodeId = 1;

      // Start node
      newNodes.push({
        id: nodeId++,
        type: 'start',
        x: 50,
        y: 100,
        text: 'Call Started',
        timestamp: transcript[0]?.timestamp || '00:00'
      });

      // Process transcript to identify key conversation points
      const keyMoments = extractKeyMoments(transcript);
      
      keyMoments.forEach((moment, index) => {
        const prevNodeId = nodeId - 1;
        const currentNodeId = nodeId++;
        
        newNodes.push({
          id: currentNodeId,
          type: moment.type,
          x: 50 + (index % 3) * 200,
          y: 200 + Math.floor(index / 3) * 150,
          text: moment.text,
          timestamp: moment.timestamp,
          speaker: moment.speaker
        });

        // Connect to previous node
        newConnections.push({
          id: `conn-${prevNodeId}-${currentNodeId}`,
          from: prevNodeId,
          to: currentNodeId,
          label: moment.transition || ''
        });
      });

      // End node
      const endNodeId = nodeId++;
      newNodes.push({
        id: endNodeId,
        type: 'end',
        x: 50 + ((keyMoments.length % 3) * 200),
        y: 200 + Math.floor(keyMoments.length / 3) * 150 + 150,
        text: 'Call Ended',
        timestamp: transcript[transcript.length - 1]?.timestamp || '00:00'
      });

      // Connect last moment to end
      if (keyMoments.length > 0) {
        newConnections.push({
          id: `conn-${nodeId - 2}-${endNodeId}`,
          from: nodeId - 2,
          to: endNodeId,
          label: 'Conclusion'
        });
      }

      setNodes(newNodes);
      setConnections(newConnections);
      setIsGenerating(false);

      // Notify parent component
      if (onFlowchartUpdate) {
        onFlowchartUpdate({ nodes: newNodes, connections: newConnections });
      }
    }, 2000);
  }, [transcript, onFlowchartUpdate]);

  // Extract key moments from transcript
  const extractKeyMoments = (transcript) => {
    const moments = [];
    
    transcript.forEach((entry, index) => {
      const text = entry.text.toLowerCase();
      
      // Identify questions
      if (text.includes('?') || text.includes('what') || text.includes('how') || text.includes('when')) {
        moments.push({
          type: 'question',
          text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
          timestamp: entry.timestamp,
          speaker: entry.speaker,
          transition: 'Asked'
        });
      }
      
      // Identify objections
      else if (text.includes('but') || text.includes('however') || text.includes('concern') || text.includes('worry')) {
        moments.push({
          type: 'objection',
          text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
          timestamp: entry.timestamp,
          speaker: entry.speaker,
          transition: 'Objected'
        });
      }
      
      // Identify decisions
      else if (text.includes('decide') || text.includes('think about') || text.includes('consider')) {
        moments.push({
          type: 'decision',
          text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
          timestamp: entry.timestamp,
          speaker: entry.speaker,
          transition: 'Decided'
        });
      }
      
      // Identify responses (every few entries to avoid clutter)
      else if (index % 3 === 0 && entry.speaker === 'Sales Rep') {
        moments.push({
          type: 'response',
          text: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : ''),
          timestamp: entry.timestamp,
          speaker: entry.speaker,
          transition: 'Responded'
        });
      }
    });

    return moments.slice(0, 8); // Limit to 8 key moments for clarity
  };

  // Handle node drag
  const handleMouseDown = (e, node) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggedNode(node.id);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggedNode || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x: Math.max(0, Math.min(newX, rect.width - 120)), y: Math.max(0, Math.min(newY, rect.height - 80)) }
        : node
    ));
  }, [draggedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  // Add new node
  const addNode = (type) => {
    const newNode = {
      id: Date.now(),
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      text: `New ${nodeTypes[type].label}`,
      timestamp: '00:00'
    };
    setNodes(prev => [...prev, newNode]);
  };

  // Delete node
  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    setSelectedNode(null);
  };

  // Render connection lines
  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;
      
      const startX = fromNode.x + 60;
      const startY = fromNode.y + 40;
      const endX = toNode.x + 60;
      const endY = toNode.y + 40;
      
      return (
        <g key={conn.id}>
          <defs>
            <marker
              id={`arrowhead-${conn.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
          </defs>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#6B7280"
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${conn.id})`}
          />
          {conn.label && (
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2 - 5}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {conn.label}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="GitBranch" size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Conversation Flowchart</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={generateFlowchart}
              disabled={isGenerating || !transcript || transcript.length === 0}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Icon name="Zap" size={16} className="mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Add Node:</span>
          {Object.entries(nodeTypes).map(([type, config]) => (
            <Button
              key={type}
              onClick={() => addNode(type)}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Icon name={config.icon} size={14} className="mr-1" />
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-96 overflow-auto bg-gray-50">
        <svg
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ minWidth: '800px', minHeight: '600px' }}
        >
          {renderConnections()}
        </svg>
        
        {/* Nodes */}
        <AnimatePresence>
          {nodes.map(node => {
            const nodeConfig = nodeTypes[node.type];
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute cursor-move select-none ${
                  selectedNode === node.id ? 'ring-2 ring-purple-500' : ''
                }`}
                style={{ left: node.x, top: node.y }}
                onMouseDown={(e) => handleMouseDown(e, node)}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className={`w-32 h-20 ${nodeConfig.color} rounded-lg shadow-md flex flex-col items-center justify-center text-white text-xs p-2 hover:shadow-lg transition-shadow`}>
                  <Icon name={nodeConfig.icon} size={16} className="mb-1" />
                  <div className="text-center font-medium leading-tight">
                    {node.text}
                  </div>
                  {node.timestamp && (
                    <div className="text-xs opacity-75 mt-1">
                      {node.timestamp}
                    </div>
                  )}
                </div>
                
                {selectedNode === node.id && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    size="sm"
                    variant="outline"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white border-red-500"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {nodes.length === 0 && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Icon name="GitBranch" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No flowchart generated</p>
              <p className="text-sm">Click "Generate" to create a flowchart from the conversation</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="mx-auto mb-4 text-purple-600 animate-spin" />
              <p className="text-lg font-medium text-gray-900 mb-2">Analyzing Conversation</p>
              <p className="text-sm text-gray-600">Creating flowchart from transcript...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{nodes.length} nodes, {connections.length} connections</span>
          <span>Click and drag nodes to reposition • Click to select • Generate from transcript</span>
        </div>
      </div>
    </div>
  );
};

export default FlowchartMaker;
