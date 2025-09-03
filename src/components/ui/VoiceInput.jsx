import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useAnalysis } from '../../contexts/AnalysisContext';

const VoiceInput = ({ 
  onTranscript, 
  placeholder = "Ask a question about your analysis...",
  className = '',
  disabled = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { generateSpeech } = useAnalysis();
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // Convert blob to file for ElevenLabs API
      const audioFile = new File([audioBlob], 'voice-input.webm', { type: 'audio/webm' });
      
      // Import ElevenLabs service
      const { ElevenLabsService } = await import('../../utils/elevenLabsService');
      const elevenLabs = new ElevenLabsService();
      
      if (elevenLabs.isConfigured()) {
        const result = await elevenLabs.speechToText(audioFile);
        setTranscript(result.text);
        onTranscript?.(result.text);
      } else {
        setTranscript('Speech-to-text service not configured');
      }
    } catch (error) {
      console.error('Speech processing failed:', error);
      setTranscript('Failed to process speech');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript?.(transcript.trim());
      setTranscript('');
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-3 ${className}`}>
      {/* Voice Input Controls */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isProcessing}
          className={`flex-shrink-0 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
          size="sm"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
          )}
        </Button>

        <div className="flex-1">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={isListening ? "Listening..." : placeholder}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            disabled={isListening || isProcessing}
          />
        </div>

        {transcript && (
          <>
            <Button
              onClick={clearTranscript}
              variant="ghost"
              size="sm"
              disabled={isListening || isProcessing}
            >
              <Icon name="X" size={16} />
            </Button>
            
            <Button
              onClick={handleSubmit}
              variant="default"
              size="sm"
              disabled={isListening || isProcessing}
            >
              <Icon name="Send" size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Status Indicator */}
      {(isListening || isProcessing) && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-primary animate-spin'
          }`} />
          <span>
            {isListening ? 'Listening... Click to stop' : 'Processing speech...'}
          </span>
        </div>
      )}

      {/* Transcript Preview */}
      {transcript && !isListening && !isProcessing && (
        <div className="bg-muted/30 rounded p-3 text-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-muted-foreground">Transcript: </span>
              <span className="text-foreground">{transcript}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
