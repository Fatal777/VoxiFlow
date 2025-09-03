import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TranscriptPanel = ({ transcript, currentTime, onSeekTo, isPlaying, onTogglePlayback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTranscript, setFilteredTranscript] = useState(transcript);
  const [selectedSpeaker, setSelectedSpeaker] = useState('all');
  const transcriptRef = useRef(null);

  const speakers = [...new Set(transcript.map(item => item.speaker))];

  useEffect(() => {
    let filtered = transcript;
    
    if (searchTerm) {
      filtered = filtered?.filter(item => 
        item?.text?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    
    if (selectedSpeaker !== 'all') {
      filtered = filtered?.filter(item => item?.speaker === selectedSpeaker);
    }
    
    setFilteredTranscript(filtered);
  }, [searchTerm, selectedSpeaker, transcript]);

  const getSpeakerColor = (speaker) => {
    const colors = {
      'Sales Rep': 'text-purple-400',
      'Client': 'text-green-400',
      'Manager': 'text-yellow-400'
    };
    return colors?.[speaker] || 'text-gray-400';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSegmentClick = (timestamp) => {
    onSeekTo(timestamp);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Icon name="MessageSquare" size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Live Transcript</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Processing</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePlayback}
            iconName={isPlaying ? "Pause" : "Play"}
            iconSize={16}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="ghost" size="sm" iconName="Download" iconSize={16}>
            Export
          </Button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-700 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e?.target?.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="all">All Speakers</option>
            {speakers?.map(speaker => (
              <option key={speaker} value={speaker}>{speaker}</option>
            ))}
          </select>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>{transcript?.length} segments</span>
          <span>{speakers?.length} speakers</span>
          <span>{Math.floor(transcript?.[transcript?.length - 1]?.timestamp || 0 / 60)} minutes</span>
        </div>
      </div>
      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto p-4" ref={transcriptRef}>
        <div className="space-y-4">
          {filteredTranscript?.map((segment, index) => (
            <div
              key={index}
              className={`
                group cursor-pointer p-3 rounded-lg border transition-all duration-200
                hover:bg-gray-800/50 hover:border-purple-600/30
                ${Math.abs(segment?.timestamp - currentTime) < 2 
                  ? 'bg-purple-600/10 border-purple-600/30' : 'bg-gray-800/30 border-gray-700'
                }
              `}
              onClick={() => handleSegmentClick(segment?.timestamp)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${segment?.speaker === 'Sales Rep' ? 'bg-purple-600/20 text-purple-400' :
                      segment?.speaker === 'Client'? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                    }
                  `}>
                    {segment?.speaker?.split(' ')?.map(word => word?.[0])?.join('')}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${getSpeakerColor(segment?.speaker)}`}>
                      {segment?.speaker}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(segment?.timestamp)}
                    </span>
                    {segment?.confidence && (
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${segment?.confidence > 0.9 ? 'bg-green-600/20 text-green-400' :
                          segment?.confidence > 0.7 ? 'bg-yellow-600/20 text-yellow-400': 'bg-red-600/20 text-red-400'
                        }
                      `}>
                        {Math.round(segment?.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-white leading-relaxed">
                    {searchTerm ? (
                      segment?.text?.split(new RegExp(`(${searchTerm})`, 'gi'))?.map((part, i) =>
                        part?.toLowerCase() === searchTerm?.toLowerCase() ? (
                          <mark key={i} className="bg-purple-600/30 text-purple-300 px-1 rounded">
                            {part}
                          </mark>
                        ) : part
                      )
                    ) : segment?.text}
                  </p>
                  
                  {segment?.emotions && segment?.emotions?.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      {segment?.emotions?.map((emotion, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full"
                        >
                          {emotion?.type} ({Math.round(emotion?.confidence * 100)}%)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" iconName="Play" iconSize={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTranscript?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No transcript segments found</p>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;