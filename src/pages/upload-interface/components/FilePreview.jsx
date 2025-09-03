import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreview = ({ file, onRemove, onProcess }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef?.current) {
      if (isPlaying) {
        audioRef?.current?.pause();
      } else {
        audioRef?.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef?.current) {
      setCurrentTime(audioRef?.current?.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef?.current) {
      setDuration(audioRef?.current?.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef?.current) {
      const rect = e?.currentTarget?.getBoundingClientRect();
      const percent = (e?.clientX - rect?.left) / rect?.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!file) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-2">
        {/* File Info Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Icon name="FileAudio" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground truncate max-w-xs">
                {file?.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>{formatFileSize(file?.size)}</span>
                <span>•</span>
                <span>{file?.type}</span>
                {duration > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatTime(duration)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onRemove} className="p-2">
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="space-y-4 mb-6">
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            {/* Waveform Visualization (Mock) */}
            <div className="relative bg-muted/20 rounded-lg p-4 h-20">
              <div className="flex items-end justify-center space-x-1 h-12">
                {Array.from({ length: 60 }, (_, i) => (
                  <div
                    key={i}
                    className={`
                      w-1 bg-primary/30 rounded-full transition-all duration-200
                      ${i < (currentTime / duration) * 60 ? 'bg-primary' : 'bg-primary/30'}
                    `}
                    style={{ 
                      height: `${Math.random() * 80 + 20}%`,
                      cursor: 'pointer'
                    }}
                    onClick={handleSeek}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="w-full bg-muted rounded-full h-2 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (audioRef?.current) {
                    audioRef.current.currentTime = Math.max(0, currentTime - 10);
                  }
                }}
                iconName="SkipBack"
                className="p-2"
              />
              
              <Button
                variant="default"
                size="lg"
                onClick={handlePlayPause}
                iconName={isPlaying ? "Pause" : "Play"}
                className="px-6"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (audioRef?.current) {
                    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }
                }}
                iconName="SkipForward"
                className="p-2"
              />
            </div>
          </div>
        )}

        {/* File Analysis Preview */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-foreground">Analysis Preview</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Users" size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Speakers</p>
              <p className="text-sm font-medium text-foreground">Auto-detect</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Clock" size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium text-foreground">
                {duration > 0 ? formatTime(duration) : 'Calculating...'}
              </p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Globe" size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Language</p>
              <p className="text-sm font-medium text-foreground">Auto-detect</p>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Icon name="Zap" size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Quality</p>
              <p className="text-sm font-medium text-success">Excellent</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>File validated and ready for processing</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onRemove}>
              Remove File
            </Button>
            <Button variant="default" onClick={onProcess} iconName="Play" iconPosition="left">
              Start Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;