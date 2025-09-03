import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedSettings = ({ isVisible, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    speakerIdentification: true,
    analysisDepth: 'comprehensive',
    outputFormat: 'detailed',
    languageDetection: true,
    sentimentAnalysis: true,
    keywordExtraction: true,
    competitiveAnalysis: false,
    customPrompts: '',
    confidenceThreshold: 0.8,
    ...settings
  });

  const analysisDepthOptions = [
    { value: 'basic', label: 'Basic Analysis', description: 'Essential insights and summary' },
    { value: 'standard', label: 'Standard Analysis', description: 'Comprehensive analysis with key metrics' },
    { value: 'comprehensive', label: 'Comprehensive Analysis', description: 'Deep analysis with advanced insights' },
    { value: 'enterprise', label: 'Enterprise Analysis', description: 'Full analysis with custom reporting' }
  ];

  const outputFormatOptions = [
    { value: 'summary', label: 'Summary Only', description: 'Key points and action items' },
    { value: 'detailed', label: 'Detailed Report', description: 'Complete analysis with visualizations' },
    { value: 'presentation', label: 'Presentation Format', description: 'Slide-ready format for sharing' },
    { value: 'custom', label: 'Custom Format', description: 'Tailored to your specifications' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      speakerIdentification: true,
      analysisDepth: 'comprehensive',
      outputFormat: 'detailed',
      languageDetection: true,
      sentimentAnalysis: true,
      keywordExtraction: true,
      competitiveAnalysis: false,
      customPrompts: '',
      confidenceThreshold: 0.8
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-elevation-modal animate-spring">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Advanced Settings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure analysis parameters and output preferences
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-96 overflow-y-auto">
          {/* Analysis Configuration */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Analysis Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Analysis Depth"
                  description="Choose the level of analysis detail"
                  options={analysisDepthOptions}
                  value={localSettings?.analysisDepth}
                  onChange={(value) => handleSettingChange('analysisDepth', value)}
                />

                <Select
                  label="Output Format"
                  description="Select preferred report format"
                  options={outputFormatOptions}
                  value={localSettings?.outputFormat}
                  onChange={(value) => handleSettingChange('outputFormat', value)}
                />
              </div>

              <div className="mt-6">
                <Input
                  label="Confidence Threshold"
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  description="Minimum confidence level for insights (0.1 - 1.0)"
                  value={localSettings?.confidenceThreshold}
                  onChange={(e) => handleSettingChange('confidenceThreshold', parseFloat(e?.target?.value))}
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Analysis Features</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Speaker Identification"
                description="Identify and separate different speakers"
                checked={localSettings?.speakerIdentification}
                onChange={(e) => handleSettingChange('speakerIdentification', e?.target?.checked)}
              />

              <Checkbox
                label="Language Detection"
                description="Automatically detect conversation language"
                checked={localSettings?.languageDetection}
                onChange={(e) => handleSettingChange('languageDetection', e?.target?.checked)}
              />

              <Checkbox
                label="Sentiment Analysis"
                description="Analyze emotional tone throughout call"
                checked={localSettings?.sentimentAnalysis}
                onChange={(e) => handleSettingChange('sentimentAnalysis', e?.target?.checked)}
              />

              <Checkbox
                label="Keyword Extraction"
                description="Extract important keywords and phrases"
                checked={localSettings?.keywordExtraction}
                onChange={(e) => handleSettingChange('keywordExtraction', e?.target?.checked)}
              />

              <Checkbox
                label="Competitive Analysis"
                description="Identify mentions of competitors"
                checked={localSettings?.competitiveAnalysis}
                onChange={(e) => handleSettingChange('competitiveAnalysis', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Custom Prompts */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Custom Analysis Prompts</h4>
            <Input
              label="Additional Instructions"
              type="textarea"
              placeholder="Enter specific analysis instructions or focus areas..."
              description="Provide custom prompts to guide the AI analysis"
              value={localSettings?.customPrompts}
              onChange={(e) => handleSettingChange('customPrompts', e?.target?.value)}
              className="min-h-24"
            />
          </div>

          {/* Processing Options */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Processing Options</h4>
            
            <div className="p-4 bg-muted/20 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Priority Processing</p>
                  <p className="text-xs text-muted-foreground">Process file with higher priority</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-warning" />
                  <span className="text-xs text-warning font-medium">Premium</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Real-time Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified when processing completes</p>
                </div>
                <Checkbox
                  checked
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="ghost" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;