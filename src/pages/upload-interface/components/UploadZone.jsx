import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileSelect, isUploading, uploadProgress, onRecordClick }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      return;
    }
    
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles?.[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.webm']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const generateSampleCall = async () => {
    setIsGenerating(true);
    
    try {
      // ElevenLabs API call to generate sample sales call
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY || 'your-api-key-here'
        },
        body: JSON.stringify({
          text: `Hello, this is Sarah from TechSolutions Inc. I'm calling to follow up on your inquiry about our enterprise software package. I understand you're looking for a solution that can handle your growing customer base while maintaining data security. Our platform has helped companies like yours increase efficiency by 40% while reducing operational costs. I'd love to schedule a quick 15-minute demo to show you exactly how this could work for your business. Would next Tuesday at 2 PM work for you, or would you prefer a different time? I'm confident we can provide exactly what you're looking for.`,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioFile = new File([audioBlob], 'sample-sales-call.mp3', { 
          type: 'audio/mpeg',
          lastModified: Date.now()
        });
        
        // Add metadata to indicate this is a generated sample
        audioFile.sampleData = {
          type: 'generated',
          scenario: 'Enterprise Software Sales Call',
          duration: '2:30',
          participants: ['Sales Rep (Sarah)', 'Prospect (Client)'],
          outcome: 'Demo Scheduled'
        };
        
        onFileSelect(audioFile);
      } else {
        throw new Error('Failed to generate sample call');
      }
    } catch (error) {
      console.error('Error generating sample call:', error);
      alert('Failed to generate sample call. Please check your API key or try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 hover-scale group
          ${isDragActive || dragActive
            ? 'border-purple-400 bg-purple-600/10 shadow-lg'
            : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800/20'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Animated gradient border effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20
          ${isDragActive ? 'opacity-100' : ''}
        `} />

        <div className="relative z-10">
          {isUploading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-600/20 rounded-full">
                <Icon name="Upload" size={32} className="text-purple-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Uploading...</h3>
                <div className="w-full max-w-xs mx-auto bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-300">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`
                flex items-center justify-center w-16 h-16 mx-auto rounded-full transition-all duration-300
                ${isDragActive 
                  ? 'bg-purple-600 text-white scale-110' : 'bg-gray-800 text-gray-400 group-hover:bg-purple-600/20 group-hover:text-purple-400'
                }
              `}>
                <Icon 
                  name={isDragActive ? "Download" : "Upload"} 
                  size={32} 
                  className="transition-transform duration-300"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  {isDragActive ? 'Drop your file here' : 'Upload Sales Call Recording'}
                </h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Drag and drop your audio file here, or click to browse. 
                  Supports MP3, WAV, M4A, AAC, OGG, FLAC, and WEBM formats.
                </p>
                <p className="text-sm text-gray-400">
                  Maximum file size: 100MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="default" iconName="FolderOpen" iconPosition="left" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Files
                </Button>
                <span className="text-gray-400 text-sm">or</span>
                <Button 
                  variant="outline" 
                  iconName="Mic" 
                  iconPosition="left" 
                  className="border-purple-600/30 text-purple-400 hover:bg-purple-600 hover:text-white"
                  onClick={onRecordClick}
                >
                  Record Live
                </Button>
              </div>
              
              {/* Generate Sample Call Section */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="text-center space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Need a sample to test?</h4>
                  <Button 
                    onClick={generateSampleCall}
                    disabled={isUploading || isGenerating}
                    variant="outline"
                    className="border-purple-600/30 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mr-2" />
                        Generating Sample Call...
                      </>
                    ) : (
                      <>
                        <Icon name="Waveform" size={16} className="mr-2" />
                        Generate AI Sales Call
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Powered by ElevenLabs AI - Creates realistic sales conversation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)]?.map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 bg-purple-400/30 rounded-full
                animate-pulse transition-opacity duration-300
                ${isDragActive ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      {/* Supported formats */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 mb-2">Supported formats:</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC', 'WEBM']?.map((format) => (
            <span
              key={format}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md border border-gray-600"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadZone;