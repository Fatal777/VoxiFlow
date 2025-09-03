import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const VoiceRecorder = ({ 
  onRecordingComplete, 
  onTranscriptionComplete,
  className = '',
  maxDuration = 300, // 5 minutes max
  showTranscription = true 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Setup audio analysis for visual feedback
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Convert blob to File with proper audio extension for analysis
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { 
          type: 'audio/webm',
          lastModified: Date.now()
        });
        onRecordingComplete?.(audioFile);
        
        if (showTranscription) {
          await handleTranscription(audioBlob);
        }
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
      startAudioLevelMonitoring();

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      stopAudioLevelMonitoring();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        startTimer();
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        stopTimer();
      }
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAudioLevelMonitoring = () => {
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording && !isPaused) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(Math.min(average / 128, 1));
      }
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  const stopAudioLevelMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setAudioLevel(0);
  };

  const handleTranscription = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      // Convert blob to file for ElevenLabs API
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      // Import ElevenLabs service dynamically to avoid circular imports
      const { ElevenLabsService } = await import('../../utils/elevenLabsService');
      const elevenLabs = new ElevenLabsService();
      
      if (elevenLabs.isConfigured()) {
        const result = await elevenLabs.speechToText(audioFile);
        setTranscription(result.text);
        onTranscriptionComplete?.(result);
      } else {
        setTranscription('Transcription service not configured');
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      setTranscription('Transcription failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setDuration(0);
    setTranscription('');
    setAudioLevel(0);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 space-y-4 ${className}`}>
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full"
            size="lg"
          >
            <Icon name="Mic" size={20} className="mr-2" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={pauseRecording}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              <Icon name={isPaused ? "Play" : "Pause"} size={20} className="mr-2" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button
              onClick={stopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3"
              size="lg"
            >
              <Icon name="Square" size={20} className="mr-2" />
              Stop
            </Button>
          </>
        )}
        
        {(isRecording || duration > 0) && (
          <Button
            onClick={resetRecording}
            variant="ghost"
            size="lg"
            disabled={isRecording}
          >
            <Icon name="RotateCcw" size={20} />
          </Button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-sm font-medium">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
          </div>
          
          {/* Audio Level Visualizer */}
          <div className="flex items-center justify-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-primary rounded-full transition-all duration-100 ${
                  i < audioLevel * 20 ? 'h-8' : 'h-2'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-foreground">
          {formatTime(duration)}
        </div>
        <div className="text-sm text-muted-foreground">
          Max: {formatTime(maxDuration)}
        </div>
      </div>

      {/* Transcription */}
      {showTranscription && (transcription || isTranscribing) && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Live Transcription
          </h4>
          
          {isTranscribing ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              <span className="text-sm">Transcribing...</span>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-3 text-sm text-foreground">
              {transcription || 'No transcription available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
