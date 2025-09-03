import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AudioPlayer = ({ 
  audioUrl, 
  text, 
  onPlay, 
  onPause, 
  onEnded,
  className = '',
  showText = true,
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      if (autoPlay) {
        handlePlay();
      }
    }
  }, [audioUrl, autoPlay]);

  const handlePlay = async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onEnded?.();
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-muted/50 rounded-lg p-4 space-y-3 ${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {showText && text && (
        <div className="text-sm text-muted-foreground bg-background/50 rounded p-3">
          <Icon name="Volume2" size={16} className="inline mr-2" />
          {text}
        </div>
      )}

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={!audioUrl || isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          ) : isPlaying ? (
            <Icon name="Pause" size={16} />
          ) : (
            <Icon name="Play" size={16} />
          )}
        </Button>

        <div className="flex-1 space-y-1">
          <div 
            className="h-2 bg-muted rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-primary rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              setCurrentTime(0);
            }
          }}
          disabled={!audioUrl}
          className="flex-shrink-0"
        >
          <Icon name="RotateCcw" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
