import React, { createContext, useContext, useState } from 'react';
import AudioProcessor from '../utils/audioProcessor';
import ElevenLabsService from '../utils/elevenLabsService';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [insights, setInsights] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [error, setError] = useState(null);
  const [speechAudio, setSpeechAudio] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const audioProcessor = new AudioProcessor();
  const elevenLabsService = new ElevenLabsService();

  const startAnalysis = async (file) => {
    try {
      setError(null);
      setCurrentFile(file);
      setProcessingStatus('processing');
      setProcessingProgress(0);

      // Check if this is a demo file with pre-loaded data
      if (file.sampleData) {
        setProcessingMessage('Loading demo data...');
        
        // Simulate processing for demo files
        const steps = [
          { progress: 20, message: 'Processing audio file...' },
          { progress: 50, message: 'Transcribing conversation...' },
          { progress: 80, message: 'Analyzing insights...' },
          { progress: 100, message: 'Analysis complete!' }
        ];

        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setProcessingProgress(step.progress);
          setProcessingMessage(step.message);
        }

        // Convert transcript string to structured format
        const transcriptLines = file.sampleData.transcript.split('\n\n').map((line, index) => {
          const [speaker, ...textParts] = line.split(': ');
          return {
            id: index,
            speaker: speaker.trim(),
            text: textParts.join(': ').trim(),
            timestamp: index * 15 // Mock timestamps
          };
        }).filter(line => line.text);

        setTranscript(transcriptLines);
        setInsights(file.sampleData.insights);
        setProcessingStatus('completed');
        return;
      }

      // Regular file processing
      const transcriptData = await audioProcessor.transcribeAudio(
        file,
        (progress, message) => {
          setProcessingProgress(progress);
          setProcessingMessage(message);
        }
      );

      setTranscript(transcriptData);
      setProcessingMessage('Generating AI insights...');

      // Generate insights
      const insightsData = await generateAnalysis(transcriptData);
      setInsights(insightsData);

      // Generate speech summary if ElevenLabs is configured
      if (elevenLabsService.isConfigured()) {
        setProcessingMessage('Generating audio summary...');
        try {
          const speechData = await elevenLabsService.generateInsightsSpeech(insightsData);
          setSpeechAudio(speechData);
        } catch (speechError) {
          console.error('Speech generation failed:', speechError);
          // Continue without speech - not a critical failure
        }
      }

      setProcessingStatus('completed');
      setProcessingMessage('Analysis complete!');
    } catch (err) {
      setError(err.message);
      setProcessingStatus('error');
      setProcessingMessage('Analysis failed');
    }
  };

  // Generate speech for custom text
  const generateSpeech = async (text, voiceId) => {
    try {
      if (!elevenLabsService.isConfigured()) {
        throw new Error('ElevenLabs API key not configured');
      }
      
      const speechData = await elevenLabsService.generateAssistantSpeech(text, voiceId);
      return speechData;
    } catch (error) {
      console.error('Speech generation failed:', error);
      throw error;
    }
  };

  // Load available voices
  const loadVoices = async () => {
    try {
      const voices = await elevenLabsService.getVoices();
      setAvailableVoices(voices);
      return voices;
    } catch (error) {
      console.error('Failed to load voices:', error);
      return [];
    }
  };

  const resetAnalysis = () => {
    setCurrentFile(null);
    setTranscript([]);
    setInsights(null);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setProcessingMessage('');
    setError(null);
    setSpeechAudio(null);
    
    // Clean up any audio URLs
    if (speechAudio?.audioUrl) {
      elevenLabsService.revokeAudioUrl(speechAudio.audioUrl);
    }
  };

  const value = {
    currentFile,
    transcript,
    insights,
    processingStatus,
    processingProgress,
    processingMessage,
    error,
    speechAudio,
    availableVoices,
    startAnalysis,
    resetAnalysis,
    generateSpeech,
    loadVoices
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export default AnalysisContext;
