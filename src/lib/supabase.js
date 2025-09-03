import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Authentication functions
export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with social provider
  async signInWithProvider(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database functions for VoxiFlow
export const dbService = {
  // Save call transcript
  async saveTranscript(userId, transcriptData) {
    const { data, error } = await supabase
      .from('transcripts')
      .insert({
        user_id: userId,
        ...transcriptData,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  },

  // Get user transcripts
  async getUserTranscripts(userId) {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Save analysis results
  async saveAnalysis(userId, analysisData) {
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        ...analysisData,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  },

  // Get user analyses
  async getUserAnalyses(userId) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Storage functions for audio files
export const storageService = {
  // Upload audio file
  async uploadAudio(userId, file, fileName) {
    const filePath = `${userId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filePath, file);
    
    if (error) throw error;
    return data;
  },

  // Get audio file URL
  async getAudioUrl(filePath) {
    const { data } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Delete audio file
  async deleteAudio(filePath) {
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([filePath]);
    
    if (error) throw error;
  }
};

export default supabase;
