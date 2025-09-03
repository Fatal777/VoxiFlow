import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Header from '../../components/ui/Header';
import Footer from '../landing-page/components/Footer';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const { success, error } = useNotification();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    timezone: user?.timezone || 'UTC',
    language: user?.language || 'en'
  });
  
  const [profileImage, setProfileImage] = useState(user?.avatar_url || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        ...formData,
        avatar_url: profileImage
      });
      
      success('Profile updated successfully!', {
        title: 'Success',
        duration: 4000
      });
      setIsEditing(false);
    } catch (err) {
      error('Failed to update profile. Please try again.', {
        title: 'Update Failed',
        duration: 6000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      timezone: user?.timezone || 'UTC',
      language: user?.language || 'en'
    });
    setProfileImage(user?.avatar_url || null);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Calls', value: '247', icon: 'Phone' },
    { label: 'Hours Analyzed', value: '156', icon: 'Clock' },
    { label: 'Success Rate', value: '87%', icon: 'TrendingUp' },
    { label: 'Team Rank', value: '#3', icon: 'Award' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400 text-lg">Manage your account information and preferences</p>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl p-6 sticky top-32"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon name="User" size={32} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Icon name="Camera" size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <h3 className="text-xl font-semibold text-white mt-4">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-gray-400">{formData.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                          <Icon name={stat.icon} size={16} className="text-purple-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{stat.label}</span>
                      </div>
                      <span className="text-white font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSaving ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Icon name="Save" size={16} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-gray-900/50 backdrop-blur border border-purple-600/30 rounded-2xl p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
                
                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Company & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                        placeholder="Enter your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 rounded-xl px-4 py-3 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 rounded-xl px-4 py-3"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Kolkata">India</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800/50 border border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 rounded-xl px-4 py-3"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="zh">Chinese</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
