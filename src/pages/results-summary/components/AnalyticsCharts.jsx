import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsCharts = () => {
  const sentimentData = [
    { time: '0-2min', positive: 85, neutral: 10, negative: 5 },
    { time: '2-4min', positive: 75, neutral: 15, negative: 10 },
    { time: '4-6min', positive: 60, neutral: 25, negative: 15 },
    { time: '6-8min', positive: 45, neutral: 30, negative: 25 },
    { time: '8-10min', positive: 70, neutral: 20, negative: 10 },
    { time: '10-12min', positive: 80, neutral: 15, negative: 5 },
    { time: '12-14min', positive: 90, neutral: 8, negative: 2 },
    { time: '14-16min', positive: 85, neutral: 12, negative: 3 }
  ];

  const talkTimeData = [
    { name: 'Sales Rep', value: 65, color: '#8A2BE2' },
    { name: 'Client', value: 35, color: '#30D158' }
  ];

  const topicsData = [
    { topic: 'Product Features', mentions: 12, sentiment: 85 },
    { topic: 'Pricing', mentions: 8, sentiment: 45 },
    { topic: 'Implementation', mentions: 6, sentiment: 70 },
    { topic: 'Support', mentions: 4, sentiment: 90 },
    { topic: 'Timeline', mentions: 3, sentiment: 60 },
    { topic: 'Competition', mentions: 2, sentiment: 55 }
  ];

  const outcomeData = [
    { outcome: 'Likely to Close', probability: 75, color: '#30D158' },
    { outcome: 'Needs Follow-up', probability: 20, color: '#FF9F0A' },
    { outcome: 'Unlikely', probability: 5, color: '#FF453A' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="text-foreground font-medium">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sentiment Progression */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sentiment Progression</h3>
            <p className="text-sm text-muted-foreground">Emotional tone throughout the call</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#8E8E93"
                fontSize={12}
              />
              <YAxis 
                stroke="#8E8E93"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#30D158"
                fill="#30D158"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#8E8E93"
                fill="#8E8E93"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#FF453A"
                fill="#FF453A"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Talk Time Distribution */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Clock" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Talk Time Distribution</h3>
            <p className="text-sm text-muted-foreground">Speaking time breakdown</p>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={talkTimeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {talkTimeData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Talk Time']}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          {talkTimeData?.map((item) => (
            <div key={item?.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color }}
              />
              <span className="text-sm text-foreground">{item?.name}</span>
              <span className="text-sm font-medium text-foreground">{item?.value}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Topic Analysis */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="MessageSquare" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Topic Analysis</h3>
            <p className="text-sm text-muted-foreground">Discussion topics and sentiment</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number"
                stroke="#8E8E93"
                fontSize={12}
              />
              <YAxis 
                type="category"
                dataKey="topic"
                stroke="#8E8E93"
                fontSize={12}
                width={100}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'mentions' ? `${value} mentions` : `${value}% positive`,
                  name === 'mentions' ? 'Frequency' : 'Sentiment'
                ]}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <Bar dataKey="mentions" fill="#8A2BE2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Outcome Prediction */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Target" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Outcome Prediction</h3>
            <p className="text-sm text-muted-foreground">AI-powered deal probability</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {outcomeData?.map((item) => (
            <div key={item?.outcome} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item?.outcome}</span>
                <span className="text-sm font-bold" style={{ color: item?.color }}>
                  {item?.probability}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item?.probability}%`,
                    backgroundColor: item?.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Recommendation</span>
          </div>
          <p className="text-sm text-foreground">
            High probability of success. Schedule follow-up within 48 hours to maintain momentum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;