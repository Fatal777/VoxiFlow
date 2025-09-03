import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileSelect, isUploading, uploadProgress }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      // console.log('Rejected files:', rejectedFiles);
      return;
    }
    
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles?.[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

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
                  Supports MP3, WAV, M4A, AAC, OGG, and FLAC formats.
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
                <Button variant="outline" iconName="Mic" iconPosition="left" className="border-purple-600/30 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Record Live
                </Button>
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
          {['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC']?.map((format) => (
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