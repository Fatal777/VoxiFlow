import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TranscriptViewer = () => {
  const [viewMode, setViewMode] = useState('chronological');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState(null);

  const transcriptData = [
    {
      id: 1,
      speaker: 'Sales Rep',
      timestamp: '00:00',
      content: `Good morning! Thank you for taking the time to speak with me today. I'm excited to learn more about your business and see how we might be able to help you streamline your operations.`,sentiment: 'positive',
      topics: ['greeting', 'introduction'],
      duration: 15
    },
    {
      id: 2,
      speaker: 'Client',timestamp: '00:15',content: `Hi there. Yes, we're definitely looking for solutions to improve our workflow. We've been struggling with efficiency lately.`,sentiment: 'neutral',
      topics: ['pain-points', 'workflow'],
      duration: 12
    },
    {
      id: 3,
      speaker: 'Sales Rep',timestamp: '00:27',content: `I completely understand that challenge. Many of our clients have faced similar workflow bottlenecks. Can you tell me more about where you're seeing the biggest inefficiencies?`,
      sentiment: 'positive',
      topics: ['discovery', 'empathy'],
      duration: 18
    },
    {
      id: 4,
      speaker: 'Client',
      timestamp: '00:45',
      content: `Well, our main issue is with project coordination. We have multiple teams working on different aspects, but communication breaks down frequently.`,
      sentiment: 'negative',
      topics: ['pain-points', 'communication'],
      duration: 20
    },
    {
      id: 5,
      speaker: 'Sales Rep',
      timestamp: '01:05',
      content: `That's exactly the type of challenge our platform was designed to solve. We've helped companies reduce coordination time by up to 60% through our integrated communication suite.`,
      sentiment: 'positive',
      topics: ['solution', 'benefits'],
      duration: 22
    },
    {
      id: 6,
      speaker: 'Client',
      timestamp: '01:27',
      content: `That sounds promising, but I'm concerned about the cost. We're a mid-size company and budget is always a consideration.`,
      sentiment: 'negative',
      topics: ['objection', 'pricing'],
      duration: 16
    }
  ];

  const getSpeakerColor = (speaker) => {
    return speaker === 'Sales Rep' ? 'text-primary' : 'text-success';
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const filteredTranscript = transcriptData?.filter(segment =>
    segment?.content?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    segment?.speaker?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    segment?.topics?.some(topic => topic?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
  );

  const groupedByTopic = transcriptData?.reduce((acc, segment) => {
    segment?.topics?.forEach(topic => {
      if (!acc?.[topic]) acc[topic] = [];
      acc?.[topic]?.push(segment);
    });
    return acc;
  }, {});

  const groupedBySpeaker = transcriptData?.reduce((acc, segment) => {
    if (!acc?.[segment?.speaker]) acc[segment.speaker] = [];
    acc?.[segment?.speaker]?.push(segment);
    return acc;
  }, {});

  const renderChronological = () => (
    <div className="space-y-4">
      {filteredTranscript?.map((segment) => (
        <div
          key={segment?.id}
          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-elevation-1 ${
            selectedSegment?.id === segment?.id
              ? 'border-primary bg-primary/5' :'border-border bg-card'
          }`}
          onClick={() => setSelectedSegment(segment)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className={`font-semibold ${getSpeakerColor(segment?.speaker)}`}>
                {segment?.speaker}
              </span>
              <span className="text-sm text-muted-foreground">{segment?.timestamp}</span>
              <div className={`flex items-center space-x-1 ${getSentimentColor(segment?.sentiment)}`}>
                <Icon name={getSentimentIcon(segment?.sentiment)} size={14} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{segment?.duration}s</span>
            </div>
          </div>
          
          <p className="text-foreground leading-relaxed mb-3">{segment?.content}</p>
          
          <div className="flex flex-wrap gap-2">
            {segment?.topics?.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md capitalize"
              >
                {topic?.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderByTopic = () => (
    <div className="space-y-6">
      {Object.entries(groupedByTopic)?.map(([topic, segments]) => (
        <div key={topic} className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-4 capitalize flex items-center space-x-2">
            <Icon name="Tag" size={16} className="text-primary" />
            <span>{topic?.replace('-', ' ')}</span>
            <span className="text-sm text-muted-foreground">({segments?.length})</span>
          </h4>
          
          <div className="space-y-3">
            {segments?.map((segment) => (
              <div key={segment?.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`font-medium ${getSpeakerColor(segment?.speaker)}`}>
                    {segment?.speaker}
                  </span>
                  <span className="text-sm text-muted-foreground">{segment?.timestamp}</span>
                </div>
                <p className="text-foreground text-sm">{segment?.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBySpeaker = () => (
    <div className="space-y-6">
      {Object.entries(groupedBySpeaker)?.map(([speaker, segments]) => (
        <div key={speaker} className="bg-card border border-border rounded-lg p-4">
          <h4 className={`font-semibold mb-4 flex items-center space-x-2 ${getSpeakerColor(speaker)}`}>
            <Icon name="User" size={16} />
            <span>{speaker}</span>
            <span className="text-sm text-muted-foreground">({segments?.length} segments)</span>
          </h4>
          
          <div className="space-y-3">
            {segments?.map((segment) => (
              <div key={segment?.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{segment?.timestamp}</span>
                  <div className={`flex items-center space-x-1 ${getSentimentColor(segment?.sentiment)}`}>
                    <Icon name={getSentimentIcon(segment?.sentiment)} size={14} />
                  </div>
                </div>
                <p className="text-foreground text-sm">{segment?.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Call Transcript</h3>
            <p className="text-sm text-muted-foreground">Interactive transcript with multiple view modes</p>
          </div>
          
          {/* Search */}
          <div className="relative w-64">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        
        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
          {[
            { id: 'chronological', label: 'Chronological', icon: 'Clock' },
            { id: 'topic', label: 'By Topic', icon: 'Tag' },
            { id: 'speaker', label: 'By Speaker', icon: 'Users' }
          ]?.map((mode) => (
            <button
              key={mode?.id}
              onClick={() => setViewMode(mode?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === mode?.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={mode?.icon} size={14} />
              <span>{mode?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {viewMode === 'chronological' && renderChronological()}
        {viewMode === 'topic' && renderByTopic()}
        {viewMode === 'speaker' && renderBySpeaker()}
      </div>
    </div>
  );
};

export default TranscriptViewer;