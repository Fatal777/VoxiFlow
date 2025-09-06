import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import VoiceInput from '../../../components/ui/VoiceInput';
import AudioPlayer from '../../../components/ui/AudioPlayer';
import { useAnalysis } from '../../../contexts/AnalysisContext';
import Input from '../../../components/ui/Input';

const VoxaAssistant = ({ isOpen, onToggle, recommendations, insights }) => {
  const { generateSpeech } = useAnalysis();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Hello! I'm Voxa AI, your intelligent sales assistant. I've analyzed your call and have several insights to share. How can I help you improve your sales performance?`,
      timestamp: new Date(Date.now() - 300000),
      priority: 'high',
      audioUrl: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: 'objections', label: 'Handle Objections', icon: 'Shield' },
    { id: 'opportunities', label: 'Find Opportunities', icon: 'Target' },
    { id: 'next-steps', label: 'Next Steps', icon: 'ArrowRight' },
    { id: 'follow-up', label: 'Follow-up Strategy', icon: 'Calendar' }
  ];

  const priorityRecommendations = recommendations?.filter(rec => rec?.priority === 'high')?.slice(0, 3);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(async () => {
      const responses = {
        'objections': "I noticed the client mentioned budget concerns around the 15-minute mark. Here's how to address this: 1) Acknowledge their concern, 2) Present ROI data showing 300% return within 6 months, 3) Offer flexible payment terms. Would you like me to draft a follow-up email addressing these points?",
        'opportunities': "Great question! I identified 3 key opportunities: 1) They mentioned expanding to 3 new locations - perfect for our enterprise package, 2) Current manual processes taking 40+ hours/week - our automation saves 80% of that time, 3) They're evaluating competitors next month - we should schedule a technical demo ASAP.",
        'next-steps': "Based on the call analysis, here are your prioritized next steps: 1) Send detailed ROI calculator within 24 hours, 2) Schedule technical demo with their IT team by Friday, 3) Prepare competitive analysis document, 4) Follow up on decision timeline - they mentioned Q1 implementation. Shall I help draft any of these communications?",
        'default': "I understand you're asking about the call analysis. Let me provide some specific insights based on what I heard. The client showed strong interest in automation features and mentioned current pain points with manual processes. What specific aspect would you like me to elaborate on?"
      };

      const responseContent = responses[content.toLowerCase()] || responses['default'];
      
      // Generate speech for assistant response
      let audioUrl = null;
      try {
        const speechData = await generateSpeech(responseContent);
        audioUrl = speechData?.audioUrl;
      } catch (error) {
        console.error('Failed to generate speech for assistant response:', error);
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        priority: 'medium',
        audioUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionId) => {
    const actionLabels = {
      'objections': 'objections',
      'opportunities': 'opportunities', 
      'next-steps': 'next-steps',
      'follow-up': 'What follow-up strategy do you recommend?'
    };
    
    handleSendMessage(actionLabels[actionId] || actionId);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Icon name="MessageCircle" size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Icon name="Mic" size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Voxa AI</h3>
              <p className="text-xs text-white/80">Sales Assistant</p>
            </div>
          </div>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              variant="outline"
              size="sm"
              className="text-xs h-8 justify-start"
              disabled={isTyping}
            >
              <Icon name={action.icon} size={12} className="mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white border-2 border-purple-600'
            }`}>
              <Icon name={message.type === 'user' ? 'User' : 'Mic'} size={16} className={message.type === 'user' ? 'text-white' : 'text-purple-600'} />
            </div>
            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white ml-8'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-8'
              }`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Voxa AI</span>
                    {message?.priority === 'high' && (
                      <Icon name="AlertCircle" size={12} className="text-warning" />
                    )}
                  </div>
                )}
                <div className="text-sm whitespace-pre-line">{message?.content}</div>
                
                {/* Audio Player for Assistant Messages */}
                {message.type === 'assistant' && message.audioUrl && (
                  <div className="mt-3">
                    <AudioPlayer
                      audioUrl={message.audioUrl}
                      text={message.content}
                      showText={false}
                      className="bg-purple-50 dark:bg-purple-900/20"
                    />
                  </div>
                )}
              </div>
              <div className={`text-xs mt-1 ${
                message?.type === 'user' ? 'text-right text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white border-2 border-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Mic" size={16} className="text-purple-600" />
            </div>
            <div className="flex-1 bg-muted rounded-lg p-3 mr-8">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Voice Input */}
        <VoiceInput
          onTranscript={handleSendMessage}
          placeholder="Ask me about your call analysis..."
          className="w-full"
          disabled={isTyping}
        />
        
        {/* Text Input */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
            placeholder="Or type your question..."
            className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage(inputValue)}
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue?.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoxaAssistant;
