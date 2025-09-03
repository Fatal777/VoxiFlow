import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import VoiceInput from './VoiceInput';
import AudioPlayer from './AudioPlayer';
import { useAnalysis } from '../../contexts/AnalysisContext';
import Input from './Input';

const GlobalVoxaAssistant = () => {
  const { generateSpeech } = useAnalysis();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Hello! I'm Voxa AI, your intelligent sales assistant. I'm here to help you with call analysis, insights, and sales strategies. How can I assist you today?`,
      timestamp: new Date(Date.now() - 300000),
      priority: 'high',
      audioUrl: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: 'analysis', label: 'Call Analysis', icon: 'BarChart3' },
    { id: 'insights', label: 'Get Insights', icon: 'Lightbulb' },
    { id: 'strategies', label: 'Sales Tips', icon: 'Target' },
    { id: 'help', label: 'Help', icon: 'HelpCircle' }
  ];

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
        'analysis': "I can help you analyze your sales calls! Upload a recording through the Upload Interface, and I'll provide detailed insights including sentiment analysis, key discussion points, objections, and opportunities. Would you like me to guide you through the process?",
        'insights': "Here are some key insights I can provide: 1) Real-time sentiment tracking during calls, 2) Identification of buying signals and objections, 3) Conversation flow analysis, 4) Action item extraction, 5) Follow-up recommendations. What specific insights are you looking for?",
        'strategies': "Great sales strategies I recommend: 1) Active listening - focus on understanding client needs, 2) Ask open-ended questions to uncover pain points, 3) Present solutions that directly address their challenges, 4) Handle objections with empathy and data, 5) Always have clear next steps. What area would you like to improve?",
        'help': "I'm here to help! I can assist with: 1) Analyzing your sales calls, 2) Providing conversation insights, 3) Suggesting follow-up strategies, 4) Handling objections, 5) Improving your sales techniques. You can also use voice commands - just click the microphone icon!",
        'default': "I understand you're looking for assistance. I'm Voxa AI, and I specialize in sales call analysis and providing actionable insights to improve your sales performance. What specific area would you like help with today?"
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
      'analysis': 'analysis',
      'insights': 'insights', 
      'strategies': 'strategies',
      'help': 'help'
    };
    
    handleSendMessage(actionLabels[actionId] || actionId);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Voxa AI</h3>
              <p className="text-xs text-white/80">Sales Assistant</p>
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
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
                ? 'bg-primary text-white' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            }`}>
              <Icon name={message.type === 'user' ? 'User' : 'Bot'} size={16} />
            </div>
            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-primary text-white ml-8'
                  : 'bg-muted text-foreground mr-8'
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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Bot" size={16} className="text-white" />
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
          placeholder="Ask me anything about sales..."
          className="w-full"
          disabled={isTyping}
        />
        
        {/* Text Input */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
            placeholder="Or type your question..."
            className="flex-1"
            onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage(inputValue)}
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

export default GlobalVoxaAssistant;
