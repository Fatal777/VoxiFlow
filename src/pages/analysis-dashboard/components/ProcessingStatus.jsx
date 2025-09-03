import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ status, progress, currentStage, estimatedTime }) => {
  const stages = [
    { id: 'upload', label: 'Upload Complete', icon: 'Upload' },
    { id: 'transcription', label: 'Transcribing Audio', icon: 'Mic' },
    { id: 'analysis', label: 'AI Analysis', icon: 'Brain' },
    { id: 'insights', label: 'Generating Insights', icon: 'Lightbulb' },
    { id: 'complete', label: 'Analysis Complete', icon: 'CheckCircle' }
  ];

  const getStageStatus = (stageId) => {
    const currentIndex = stages?.findIndex(s => s?.id === currentStage);
    const stageIndex = stages?.findIndex(s => s?.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing': return 'text-primary';
      case 'completed': return 'text-success';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return 'Loader';
      case 'completed': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon()} 
            size={24} 
            className={`${getStatusColor()} ${status === 'processing' ? 'animate-spin' : ''}`} 
          />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Processing Status</h3>
            <p className="text-sm text-muted-foreground">
              {status === 'processing' ? `Estimated time: ${estimatedTime}` : 
               status === 'completed' ? 'Analysis completed successfully' :
               status === 'error'? 'Processing encountered an error' : 'Preparing for analysis'}
            </p>
          </div>
        </div>
        
        {status === 'processing' && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className={`
              h-full transition-all duration-500 ease-out rounded-full
              ${status === 'completed' ? 'bg-success' : 
                status === 'error'? 'bg-destructive' : 'bg-gradient-to-r from-primary to-primary/70'}
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Processing Stages */}
      <div className="space-y-4">
        {stages?.map((stage, index) => {
          const stageStatus = getStageStatus(stage?.id);
          
          return (
            <div key={stage?.id} className="flex items-center space-x-4">
              {/* Stage Icon */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${stageStatus === 'completed' 
                  ? 'bg-success/20 border-success text-success' :
                  stageStatus === 'active' ?'bg-primary/20 border-primary text-primary': 'bg-muted/20 border-muted text-muted-foreground'
                }
              `}>
                {stageStatus === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : stageStatus === 'active' ? (
                  <Icon name={stage?.icon} size={16} className="animate-pulse" />
                ) : (
                  <Icon name={stage?.icon} size={16} />
                )}
              </div>
              {/* Stage Info */}
              <div className="flex-1">
                <div className={`
                  text-sm font-medium transition-colors duration-300
                  ${stageStatus === 'completed' 
                    ? 'text-success' :
                    stageStatus === 'active' ?'text-primary': 'text-muted-foreground'
                  }
                `}>
                  {stage?.label}
                </div>
                
                {stageStatus === 'active' && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {stage?.id === 'transcription' && 'Using ElevenLabs API for high-accuracy transcription...'}
                    {stage?.id === 'analysis' && 'Analyzing conversation patterns and sentiment...'}
                    {stage?.id === 'insights' && 'Generating actionable recommendations...'}
                  </div>
                )}
              </div>
              {/* Stage Status */}
              <div className="flex-shrink-0">
                {stageStatus === 'completed' && (
                  <Icon name="CheckCircle" size={20} className="text-success" />
                )}
                {stageStatus === 'active' && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              {/* Connector Line */}
              {index < stages?.length - 1 && (
                <div className="absolute left-9 mt-10 w-0.5 h-6 bg-border" />
              )}
            </div>
          );
        })}
      </div>
      {/* Additional Info */}
      {status === 'processing' && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">Processing in progress</p>
              <p className="text-muted-foreground">
                Your call is being analyzed using advanced AI models. You can navigate to other sections 
                while processing continues in the background.
              </p>
            </div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">Processing Error</p>
              <p className="text-muted-foreground mb-3">
                There was an issue processing your audio file. Please try uploading again or contact support.
              </p>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                Retry Processing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingStatus;