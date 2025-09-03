import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import VoiceRecorder from '../../../components/ui/VoiceRecorder';

const RecordingInterface = ({ onRecordingComplete, isVisible }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Mock waveform data for visualization
  const [waveformData, setWaveformData] = useState(Array(50)?.fill(0));

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Simulate audio level changes
      const levelInterval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
        setWaveformData(prev => [
          ...prev?.slice(1),
          Math.random() * 80 + 20
        ]);
      }, 100);

      return () => {
        clearInterval(levelInterval);
      };
    } else {
      clearInterval(timerRef?.current);
    }

    return () => clearInterval(timerRef?.current);
  }, [isRecording, isPaused]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
      setHasPermission(true);
      stream?.getTracks()?.forEach(track => track?.stop());
      return true;
    } catch (error) {
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    const hasAccess = await requestMicrophonePermission();
    if (!hasAccess) return;

    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks?.push(event?.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        onRecordingComplete(file);
        stream?.getTracks()?.forEach(track => track?.stop());
      };

      mediaRecorderRef?.current?.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioLevel(0);
      setWaveformData(Array(50)?.fill(0));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef?.current?.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef?.current?.pause();
        setIsPaused(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <VoiceRecorder
        onRecordingComplete={onRecordingComplete}
        onTranscriptionComplete={(result) => {
          console.log('Transcription result:', result);
        }}
        maxDuration={1800} // 30 minutes for sales calls
        showTranscription={true}
        className="w-full"
      />
    </div>
  );
};

export default RecordingInterface;