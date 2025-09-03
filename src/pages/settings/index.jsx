import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    role: 'Sales Manager',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    analysisComplete: true,
    
    // Audio settings
    audioQuality: 'high',
    autoTranscribe: true,
    speakerDetection: true,
    noiseReduction: true,
    
    // Privacy settings
    dataRetention: '90',
    shareAnalytics: false,
    allowRecording: true,
    
    // Display settings
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-5'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'audio', label: 'Audio & Recording', icon: 'Mic' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'Shield' },
    { id: 'display', label: 'Display & Language', icon: 'Monitor' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    try {
      // In a real app, this would save to backend
      console.log('Settings saved:', settings);
      success('Settings saved successfully!', {
        title: 'Settings Updated',
        duration: 3000
      });
    } catch (err) {
      error('Failed to save settings. Please try again.', {
        title: 'Save Failed',
        duration: 5000
      });
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
            <input
              type="text"
              value={settings.company}
              onChange={(e) => handleSettingChange('company', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={settings.role}
              onChange={(e) => handleSettingChange('role', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Rep">Sales Representative</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Director">Director</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Email Notifications</label>
              <p className="text-gray-400 text-sm">Receive updates via email</p>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Push Notifications</label>
              <p className="text-gray-400 text-sm">Browser notifications for real-time updates</p>
            </div>
            <button
              onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Weekly Reports</label>
              <p className="text-gray-400 text-sm">Summary of your call analytics</p>
            </div>
            <button
              onClick={() => handleSettingChange('weeklyReports', !settings.weeklyReports)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklyReports ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Analysis Complete</label>
              <p className="text-gray-400 text-sm">Notify when call analysis is finished</p>
            </div>
            <button
              onClick={() => handleSettingChange('analysisComplete', !settings.analysisComplete)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.analysisComplete ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.analysisComplete ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Audio & Recording Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Audio Quality</label>
            <select
              value={settings.audioQuality}
              onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="low">Low (Faster processing)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Best quality)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Transcribe</label>
              <p className="text-gray-400 text-sm">Automatically transcribe uploaded recordings</p>
            </div>
            <button
              onClick={() => handleSettingChange('autoTranscribe', !settings.autoTranscribe)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoTranscribe ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoTranscribe ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Speaker Detection</label>
              <p className="text-gray-400 text-sm">Identify different speakers in recordings</p>
            </div>
            <button
              onClick={() => handleSettingChange('speakerDetection', !settings.speakerDetection)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.speakerDetection ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.speakerDetection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Noise Reduction</label>
              <p className="text-gray-400 text-sm">Apply noise reduction to improve audio quality</p>
            </div>
            <button
              onClick={() => handleSettingChange('noiseReduction', !settings.noiseReduction)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.noiseReduction ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.noiseReduction ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Retention Period</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="forever">Keep forever</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Share Analytics</label>
              <p className="text-gray-400 text-sm">Help improve our service with anonymous usage data</p>
            </div>
            <button
              onClick={() => handleSettingChange('shareAnalytics', !settings.shareAnalytics)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareAnalytics ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Allow Recording</label>
              <p className="text-gray-400 text-sm">Enable microphone access for live recording</p>
            </div>
            <button
              onClick={() => handleSettingChange('allowRecording', !settings.allowRecording)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowRecording ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowRecording ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Display & Language</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'audio':
        return renderAudioTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'display':
        return renderDisplayTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Icon name="Settings" size={32} className="text-purple-400" />
                  Settings
                </h1>
                <p className="text-gray-400 mt-2">Manage your account preferences and application settings</p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
              >
                Back to Home
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-gray-900 rounded-lg border border-purple-600/30 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-gray-900 rounded-lg border border-purple-600/30 p-6">
                {renderActiveTab()}
                
                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      iconName="Save"
                      iconPosition="left"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
