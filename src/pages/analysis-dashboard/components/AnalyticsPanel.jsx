import React, { useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsPanel = ({ analytics }) => {
  const [activeMetric, setActiveMetric] = useState('talkTime');

  const metrics = [
    { id: 'talkTime', label: 'Talk Time', icon: 'Clock', color: '#8A2BE2' },
    { id: 'sentiment', label: 'Sentiment', icon: 'Heart', color: '#30D158' },
    { id: 'engagement', label: 'Engagement', icon: 'Activity', color: '#FF9F0A' },
    { id: 'keywords', label: 'Keywords', icon: 'Hash', color: '#FF453A' }
  ];

  const COLORS = ['#8A2BE2', '#30D158', '#FF9F0A', '#FF453A', '#007AFF'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.name?.includes('Time') ? 's' : 
               entry?.name?.includes('Score') ? '/10' : 
               entry?.name?.includes('Percentage') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTalkTimeAnalysis = () => (
    <div className="space-y-6">
      {/* Talk Time Ratio */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="text-primary mr-2" />
          Talk Time Distribution
        </h4>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.talkTimeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics?.talkTimeData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {analytics?.talkTimeData?.map((entry, index) => (
            <div key={entry?.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <span className="text-sm text-foreground">{entry?.name}: {entry?.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Speaking Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analytics?.speakingPatterns?.map((pattern, index) => (
          <div key={index} className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{pattern?.speaker}</span>
              <Icon name="User" size={16} className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Time</span>
                <span className="text-foreground font-medium">{pattern?.totalTime}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Turn</span>
                <span className="text-foreground font-medium">{pattern?.avgTurnLength}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interruptions</span>
                <span className="text-foreground font-medium">{pattern?.interruptions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSentimentAnalysis = () => (
    <div className="space-y-6">
      {/* Sentiment Progression */}
      <div className="bg-gradient-to-r from-success/10 to-success/5 p-6 rounded-lg border border-success/20">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="text-success mr-2" />
          Sentiment Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics?.sentimentProgression}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#8E8E93"
              fontSize={12}
            />
            <YAxis 
              stroke="#8E8E93"
              fontSize={12}
              domain={[-1, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sentiment"
              stroke="#30D158"
              fill="url(#sentimentGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#30D158" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#30D158" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Emotion Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {analytics?.emotionBreakdown?.map((emotion, index) => (
          <div key={index} className="p-4 bg-card border border-border rounded-lg text-center">
            <div className="text-2xl mb-2">{emotion?.emoji}</div>
            <div className="text-sm font-medium text-foreground mb-1">{emotion?.name}</div>
            <div className="text-lg font-bold text-primary">{emotion?.percentage}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${emotion?.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEngagementAnalysis = () => (
    <div className="space-y-6">
      {/* Engagement Score */}
      <div className="bg-gradient-to-r from-warning/10 to-warning/5 p-6 rounded-lg border border-warning/20">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={20} className="text-warning mr-2" />
          Engagement Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {analytics?.engagementScore}/10
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {analytics?.interactionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Interaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {analytics?.responseTime}s
            </div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Engagement Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Engagement Timeline</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics?.engagementTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="minute" 
              stroke="#8E8E93"
              fontSize={12}
            />
            <YAxis 
              stroke="#8E8E93"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#FF9F0A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderKeywordAnalysis = () => (
    <div className="space-y-6">
      {/* Top Keywords */}
      <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 p-6 rounded-lg border border-destructive/20">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Hash" size={20} className="text-destructive mr-2" />
          Keyword Frequency
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {analytics?.topKeywords?.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
              <span className="text-sm font-medium text-foreground">{keyword?.word}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{keyword?.count}</span>
                <div className="w-12 bg-muted rounded-full h-2">
                  <div 
                    className="bg-destructive h-2 rounded-full"
                    style={{ width: `${(keyword?.count / analytics?.topKeywords?.[0]?.count) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Distribution */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Topic Distribution</h4>
        <div className="space-y-3">
          {analytics?.topics?.map((topic, index) => (
            <div key={index} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{topic?.name}</span>
                <span className="text-sm text-muted-foreground">{topic?.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${topic?.percentage}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {topic?.keywords?.map((kw, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMetric) {
      case 'talkTime': return renderTalkTimeAnalysis();
      case 'sentiment': return renderSentimentAnalysis();
      case 'engagement': return renderEngagementAnalysis();
      case 'keywords': return renderKeywordAnalysis();
      default: return renderTalkTimeAnalysis();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Performance Analytics</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="Download" iconSize={16}>
            Export
          </Button>
        </div>
        
        {/* Metric Tabs */}
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
          {metrics?.map(metric => (
            <button
              key={metric?.id}
              onClick={() => setActiveMetric(metric?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeMetric === metric?.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={metric?.icon} size={14} />
              <span>{metric?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalyticsPanel;