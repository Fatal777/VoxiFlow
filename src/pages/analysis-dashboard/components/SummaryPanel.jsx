import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AudioPlayer from '../../../components/ui/AudioPlayer';
import { useAnalysis } from '../../../contexts/AnalysisContext';

const SummaryPanel = ({ summary, insights, objections, opportunities }) => {
  const { speechAudio, generateSpeech } = useAnalysis();
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [customSpeechAudio, setCustomSpeechAudio] = useState(null);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'FileText' },
    { id: 'insights', label: 'Insights', icon: 'Lightbulb' },
    { id: 'objections', label: 'Objections', icon: 'AlertTriangle' },
    { id: 'opportunities', label: 'Opportunities', icon: 'Target' }
  ];

  // Generate speech for specific content
  const handleGenerateSpeech = async (text) => {
    try {
      setIsGeneratingSpeech(true);
      const speechData = await generateSpeech(text);
      setCustomSpeechAudio(speechData);
    } catch (error) {
      console.error('Failed to generate speech:', error);
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600/20';
      case 'negative': return 'bg-red-600/20';
      case 'neutral': return 'bg-gray-600/20';
      default: return 'bg-gray-800';
    }
  };

  const renderSummaryContent = () => (
    <div className="space-y-6">
      {/* Key Points */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Icon name="CheckCircle" size={16} className="text-purple-400 mr-2" />
          Key Discussion Points
        </h4>
        <div className="space-y-3">
          {summary?.keyPoints?.map((point, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-6 h-6 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-white flex-1">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Minute-by-Minute Analysis */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Icon name="Clock" size={16} className="text-purple-400 mr-2" />
          Timeline Analysis
        </h4>
        <div className="space-y-2">
          {summary?.timeline?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg">
              <div className="text-xs text-gray-400 font-mono w-12">
                {Math.floor(item?.timestamp / 60)}:{(item?.timestamp % 60)?.toString()?.padStart(2, '0')}
              </div>
              <div className={`w-3 h-3 rounded-full ${getSentimentBg(item?.sentiment)}`} />
              <p className="text-sm text-white flex-1">{item?.summary}</p>
              <div className={`text-xs px-2 py-1 rounded-full ${getSentimentBg(item?.sentiment)} ${getSentimentColor(item?.sentiment)}`}>
                {item?.sentiment}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="p-4 bg-gradient-to-r from-purple-600/10 to-purple-600/5 rounded-lg border border-purple-600/20">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Overall Call Sentiment</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getSentimentBg(summary?.overallSentiment)}`} />
            <span className={`text-sm font-medium ${getSentimentColor(summary?.overallSentiment)}`}>
              {summary?.overallSentiment?.charAt(0)?.toUpperCase() + summary?.overallSentiment?.slice(1)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-300">{summary?.sentimentReason}</p>
      </div>
    </div>
  );

  const renderInsightsContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sentiment Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sentiment</h3>
            <Button
              onClick={() => handleGenerateSpeech('sentiment')}
              size="sm"
              variant="outline"
              className="text-purple-400 border-purple-600/30 hover:bg-purple-600/20"
            >
              <Icon name="Volume2" size={16} className="mr-2" />
              Listen
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              insights?.sentiment?.overall === 'positive' ? 'bg-green-600/20 text-green-400' :
              insights?.sentiment?.overall === 'negative' ? 'bg-red-600/20 text-red-400' :
              'bg-gray-600/20 text-gray-400'
            }`}>
              <Icon 
                name={
                  insights?.sentiment?.overall === 'positive' ? 'TrendingUp' :
                  insights?.sentiment?.overall === 'negative' ? 'TrendingDown' :
                  'Minus'
                } 
                size={20} 
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-white capitalize truncate">
                {insights?.sentiment?.overall || 'Neutral'}
              </p>
              <p className="text-sm text-gray-400">
                {Math.round((insights?.sentiment?.confidence || 0.5) * 100)}% confidence
              </p>
            </div>
          </div>
        </div>
        {/* Key Points Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Key Points</h3>
            <Button
              onClick={() => handleGenerateSpeech('keyPoints')}
              size="sm"
              variant="outline"
              className="text-purple-400 border-purple-600/30 hover:bg-purple-600/20"
            >
              <Icon name="Volume2" size={16} className="mr-2" />
              Listen
            </Button>
          </div>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {insights?.keyPoints?.length > 0 ? (
              insights.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white break-words">{point.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{point.timestamp} - {point.speaker}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No key points identified yet.</p>
            )}
          </div>
        </div>
        {/* Summary Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Summary</h3>
            <Button
              onClick={() => handleGenerateSpeech('summary')}
              size="sm"
              variant="outline"
              className="text-purple-400 border-purple-600/30 hover:bg-purple-600/20"
            >
              <Icon name="Volume2" size={16} className="mr-2" />
              Listen
            </Button>
          </div>
          <div className="text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
            {insights?.summary || 'No summary available yet. Upload and analyze a call to see AI-generated insights.'}
          </div>
        </div>
      </div>
      {insights?.map((insight, index) => (
        <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
            className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight?.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                  insight?.priority === 'medium'? 'bg-yellow-600/20 text-yellow-400' : 'bg-green-600/20 text-green-400'
                }`}>
                  <Icon name={insight?.icon} size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{insight?.title}</h4>
                  <p className="text-xs text-gray-400">{insight?.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight?.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                  insight?.priority === 'medium'? 'bg-yellow-600/20 text-yellow-400' : 'bg-green-600/20 text-green-400'
                }`}>
                  {insight?.priority}
                </span>
                <Icon 
                  name={expandedInsight === index ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-gray-400" 
                />
              </div>
            </div>
          </button>
          
          {expandedInsight === index && (
            <div className="px-4 pb-4 border-t border-gray-700 bg-gray-800/20">
              <p className="text-sm text-white mt-3 mb-3">{insight?.description}</p>
              {insight?.recommendations && (
                <div>
                  <h5 className="text-xs font-semibold text-white mb-2">Recommendations:</h5>
                  <ul className="space-y-1">
                    {insight?.recommendations?.map((rec, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start">
                        <Icon name="ArrowRight" size={12} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderObjectionsContent = () => (
    <div className="space-y-4">
      {objections?.map((objection, index) => (
        <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gradient-to-r from-purple-600/5 to-transparent">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="AlertTriangle" size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{objection?.type}</h4>
                <span className="text-xs text-gray-400">
                  {Math.floor(objection?.timestamp / 60)}:{(objection?.timestamp % 60)?.toString()?.padStart(2, '0')}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{objection?.content}</p>
              
              {objection?.response && (
                <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <h5 className="text-xs font-semibold text-green-400 mb-1">Response Given:</h5>
                  <p className="text-sm text-white">{objection?.response}</p>
                </div>
              )}
              
              {objection?.suggestedResponse && (
                <div className="mt-3 p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                  <h5 className="text-xs font-semibold text-purple-400 mb-1">AI Suggested Response:</h5>
                  <p className="text-sm text-white">{objection?.suggestedResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOpportunitiesContent = () => (
    <div className="space-y-4">
      {opportunities?.map((opportunity, index) => (
        <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gradient-to-r from-green-600/5 to-transparent">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Target" size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{opportunity?.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    opportunity?.confidence > 0.8 ? 'bg-green-600/20 text-green-400' :
                    opportunity?.confidence > 0.6 ? 'bg-yellow-600/20 text-yellow-400': 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {Math.round(opportunity?.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">{opportunity?.description}</p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-white">Next Steps:</h5>
                {opportunity?.nextSteps?.map((step, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Get current tab content for speech generation
  const getCurrentTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return summary?.keyPoints?.join('. ') || 'No summary available';
      case 'insights':
        return insights?.keyPoints?.join('. ') || 'No insights available';
      case 'objections':
        return insights?.objections?.join('. ') || 'No objections identified';
      case 'opportunities':
        return insights?.opportunities?.join('. ') || 'No opportunities identified';
      default:
        return 'No content available';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary': return renderSummaryContent();
      case 'insights': return renderInsightsContent();
      case 'objections': return renderObjectionsContent();
      case 'opportunities': return renderOpportunitiesContent();
      default: return renderSummaryContent();
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio Summary Player */}
      {speechAudio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Icon name="Volume2" size={20} className="text-purple-400 mr-2" />
            AI Summary Audio
          </h3>
          <AudioPlayer
            audioUrl={speechAudio.audioUrl}
            text={speechAudio.text}
            showText={false}
            className="bg-purple-600/5 border border-purple-600/20"
          />
        </div>
      )}

      {/* Custom Speech Audio Player */}
      {customSpeechAudio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Icon name="Headphones" size={20} className="text-purple-400 mr-2" />
            Section Audio
          </h3>
          <AudioPlayer
            audioUrl={customSpeechAudio.audioUrl}
            text={customSpeechAudio.text}
            showText={true}
            className="bg-gray-800/30"
          />
        </div>
      )}

      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }
              `}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Speech Generation Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const currentContent = getCurrentTabContent();
            if (currentContent) {
              handleGenerateSpeech(currentContent);
            }
          }}
          disabled={isGeneratingSpeech}
          className="flex items-center space-x-2"
        >
          {isGeneratingSpeech ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
          ) : (
            <Icon name="Volume2" size={16} />
          )}
          <span>{isGeneratingSpeech ? 'Generating...' : 'Listen'}</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SummaryPanel;