import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = () => {
  const [selectedFormats, setSelectedFormats] = useState(['pdf']);
  const [exportOptions, setExportOptions] = useState({
    includeTranscript: true,
    includeAnalytics: true,
    includeFlowchart: true,
    includeRecommendations: true,
    includeAnnotations: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive report with all analysis',
      icon: 'FileText',
      size: '2.4 MB'
    },
    {
      id: 'html',
      name: 'Interactive HTML',
      description: 'Web-based presentation with interactive elements',
      icon: 'Globe',
      size: '1.8 MB'
    },
    {
      id: 'json',
      name: 'Structured Data',
      description: 'Raw data in JSON format for integration',
      icon: 'Code',
      size: '450 KB'
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Transcript and metrics in spreadsheet format',
      icon: 'Table',
      size: '120 KB'
    },
    {
      id: 'flowchart-svg',
      name: 'Flowchart SVG',
      description: 'Vector graphics of conversation flow',
      icon: 'GitBranch',
      size: '85 KB'
    }
  ];

  const handleFormatToggle = (formatId) => {
    setSelectedFormats(prev => 
      prev?.includes(formatId)
        ? prev?.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleOptionToggle = (option) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev?.[option]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExporting(false);
    
    // Show success message or download files
    // console.log('Export completed:', { selectedFormats, exportOptions });
  };

  const getTotalSize = () => {
    const sizes = {
      pdf: 2.4,
      html: 1.8,
      json: 0.45,
      csv: 0.12,
      'flowchart-svg': 0.085
    };
    
    const total = selectedFormats?.reduce((sum, format) => sum + (sizes?.[format] || 0), 0);
    return total?.toFixed(1);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Download" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Export Results</h3>
            <p className="text-sm text-muted-foreground">Download analysis in multiple formats</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Package" size={14} />
            <span>{selectedFormats?.length} format{selectedFormats?.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="HardDrive" size={14} />
            <span>~{getTotalSize()} MB</span>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Export Formats */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Export Formats</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportFormats?.map((format) => (
              <div
                key={format?.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
                  selectedFormats?.includes(format?.id)
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-muted'
                }`}
                onClick={() => handleFormatToggle(format?.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    selectedFormats?.includes(format?.id)
                      ? 'bg-primary text-white' :'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={format?.icon} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-foreground">{format?.name}</h5>
                      <span className="text-xs text-muted-foreground">{format?.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{format?.description}</p>
                  </div>
                  
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedFormats?.includes(format?.id)
                      ? 'border-primary bg-primary' :'border-muted'
                  }`}>
                    {selectedFormats?.includes(format?.id) && (
                      <Icon name="Check" size={12} color="white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Include in Export</h4>
          <div className="space-y-3">
            {[
              { key: 'includeTranscript', label: 'Full Transcript', description: 'Complete conversation with timestamps' },
              { key: 'includeAnalytics', label: 'Analytics & Charts', description: 'Sentiment analysis and performance metrics' },
              { key: 'includeFlowchart', label: 'Conversation Flowchart', description: 'Visual representation of call flow' },
              { key: 'includeRecommendations', label: 'AI Recommendations', description: 'Next steps and improvement suggestions' },
              { key: 'includeAnnotations', label: 'Custom Annotations', description: 'Your notes and highlights' }
            ]?.map((option) => (
              <div
                key={option?.key}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer"
                onClick={() => handleOptionToggle(option?.key)}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                  exportOptions?.[option?.key]
                    ? 'border-primary bg-primary' :'border-muted'
                }`}>
                  {exportOptions?.[option?.key] && (
                    <Icon name="Check" size={12} color="white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-foreground">{option?.label}</h5>
                  <p className="text-xs text-muted-foreground mt-0.5">{option?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedFormats?.length === 0 ? (
              'Select at least one format to export'
            ) : (
              `Ready to export ${selectedFormats?.length} format${selectedFormats?.length !== 1 ? 's' : ''}`
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              disabled={selectedFormats?.length === 0}
            >
              Preview
            </Button>
            
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              iconPosition="left"
              loading={isExporting}
              disabled={selectedFormats?.length === 0}
              onClick={handleExport}
            >
              {isExporting ? 'Exporting...' : 'Export All'}
            </Button>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Recent Exports</h4>
          <div className="space-y-2">
            {[
              { name: 'Sales Call Analysis - Dec 2, 2024.pdf', size: '2.4 MB', date: '2 hours ago' },
              { name: 'Q4 Performance Report.html', size: '1.8 MB', date: '1 day ago' },
              { name: 'Client Meeting Flowchart.svg', size: '85 KB', date: '3 days ago' }
            ]?.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">{file?.size} • {file?.date}</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="p-1">
                  <Icon name="Download" size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;