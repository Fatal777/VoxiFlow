-- VoxiFlow Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    credits_remaining INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio files table
CREATE TABLE public.audio_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    duration_seconds INTEGER,
    file_url TEXT NOT NULL,
    upload_status TEXT DEFAULT 'uploaded' CHECK (upload_status IN ('uploading', 'uploaded', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis sessions table
CREATE TABLE public.analysis_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    audio_file_id UUID REFERENCES public.audio_files(id) ON DELETE CASCADE NOT NULL,
    session_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress_percentage INTEGER DEFAULT 0,
    processing_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE public.transcripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE NOT NULL,
    content JSONB NOT NULL, -- Stores transcript with timestamps and speaker info
    word_count INTEGER,
    confidence_score DECIMAL(3,2),
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis insights table
CREATE TABLE public.analysis_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE NOT NULL,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('summary', 'sentiment', 'keywords', 'action_items', 'questions', 'objections', 'next_steps')),
    content JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation metrics table
CREATE TABLE public.conversation_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE NOT NULL,
    total_duration INTEGER NOT NULL,
    speaker_talk_time JSONB, -- {"speaker_1": 120, "speaker_2": 180}
    interruption_count INTEGER DEFAULT 0,
    silence_duration INTEGER DEFAULT 0,
    pace_analysis JSONB,
    emotion_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared reports table
CREATE TABLE public.shared_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE NOT NULL,
    shared_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    share_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs
CREATE TABLE public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Audio files policies
CREATE POLICY "Users can view own audio files" ON public.audio_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audio files" ON public.audio_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audio files" ON public.audio_files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own audio files" ON public.audio_files
    FOR DELETE USING (auth.uid() = user_id);

-- Analysis sessions policies
CREATE POLICY "Users can view own analysis sessions" ON public.analysis_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis sessions" ON public.analysis_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis sessions" ON public.analysis_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Transcripts policies
CREATE POLICY "Users can view own transcripts" ON public.transcripts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analysis_sessions 
            WHERE id = transcripts.session_id AND user_id = auth.uid()
        )
    );

-- Analysis insights policies
CREATE POLICY "Users can view own insights" ON public.analysis_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analysis_sessions 
            WHERE id = analysis_insights.session_id AND user_id = auth.uid()
        )
    );

-- Conversation metrics policies
CREATE POLICY "Users can view own metrics" ON public.conversation_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analysis_sessions 
            WHERE id = conversation_metrics.session_id AND user_id = auth.uid()
        )
    );

-- Shared reports policies
CREATE POLICY "Users can view own shared reports" ON public.shared_reports
    FOR SELECT USING (auth.uid() = shared_by);

CREATE POLICY "Users can insert own shared reports" ON public.shared_reports
    FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Public can view public shared reports" ON public.shared_reports
    FOR SELECT USING (is_public = TRUE);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_files_updated_at
    BEFORE UPDATE ON public.audio_files
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_sessions_updated_at
    BEFORE UPDATE ON public.analysis_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_audio_files_user_id ON public.audio_files(user_id);
CREATE INDEX idx_analysis_sessions_user_id ON public.analysis_sessions(user_id);
CREATE INDEX idx_analysis_sessions_status ON public.analysis_sessions(status);
CREATE INDEX idx_transcripts_session_id ON public.transcripts(session_id);
CREATE INDEX idx_analysis_insights_session_id ON public.analysis_insights(session_id);
CREATE INDEX idx_analysis_insights_type ON public.analysis_insights(insight_type);
CREATE INDEX idx_conversation_metrics_session_id ON public.conversation_metrics(session_id);
CREATE INDEX idx_shared_reports_token ON public.shared_reports(share_token);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', false);

-- Storage policies
CREATE POLICY "Users can upload own audio files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'audio-files' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own audio files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'audio-files' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own audio files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'audio-files' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
