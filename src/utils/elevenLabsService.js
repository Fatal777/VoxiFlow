// ElevenLabs Text-to-Speech Service for VoxiFlow
export class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    this.defaultVoiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam voice (professional male)
  }

  // Get available voices (limited to analysis-appropriate voices)
  async getVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter to only professional/business-appropriate voices
      const businessVoices = data.voices.filter(voice => 
        voice.category === 'premade' && 
        ['Adam', 'Bella', 'Rachel', 'Antoni', 'Arnold', 'Josh', 'Sam'].includes(voice.name)
      );
      
      return businessVoices.length > 0 ? businessVoices : data.voices.slice(0, 5);
    } catch (error) {
      console.error('Error fetching voices:', error);
      return this.getMockVoices();
    }
  }

  // Convert speech to text using ElevenLabs STT
  async speechToText(audioFile, options = {}) {
    try {
      const {
        model_id = 'eleven_english_sts_v2',
        language_code = 'en'
      } = options;

      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('model_id', model_id);
      formData.append('language_code', language_code);

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Speech-to-text failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.text,
        confidence: data.confidence || 0.9,
        language: data.language || 'en',
        duration: data.duration || 0
      };
    } catch (error) {
      console.error('Error in speech-to-text:', error);
      throw error;
    }
  }

  // Convert text to speech (restricted to analysis content only)
  async textToSpeech(text, voiceId = this.defaultVoiceId, options = {}) {
    try {
      // Validate text is analysis-related (basic content filtering)
      if (!this.isAnalysisContent(text)) {
        throw new Error('Content not permitted for text-to-speech conversion');
      }

      // Limit text length to prevent abuse (max 2000 characters for analysis summaries)
      if (text.length > 2000) {
        text = text.substring(0, 2000) + '...';
      }

      const {
        model_id = 'eleven_monolingual_v1',
        voice_settings = {
          stability: 0.6,
          similarity_boost: 0.7,
          style: 0.0,
          use_speaker_boost: true
        }
      } = options;

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings
        }),
      });

      if (!response.ok) {
        throw new Error(`Text-to-speech failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      return this.createAudioUrl(audioBlob);
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      throw error;
    }
  }

  // Create audio URL from blob
  createAudioUrl(audioBlob) {
    return URL.createObjectURL(audioBlob);
  }

  // Generate speech for AI assistant responses
  async generateAssistantSpeech(message, voiceId = this.defaultVoiceId) {
    try {
      const audioUrl = await this.textToSpeech(message, voiceId, {
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.7,
          style: 0.2,
          use_speaker_boost: true
        }
      });

      return {
        audioUrl,
        text: message,
        voiceId,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to generate assistant speech:', error);
      return null;
    }
  }

  // Generate speech for insights summary
  async generateInsightsSpeech(insights) {
    try {
      const summaryText = this.formatInsightsForSpeech(insights);
      return await this.generateAssistantSpeech(summaryText);
    } catch (error) {
      console.error('Failed to generate insights speech:', error);
      return null;
    }
  }

  // Format insights object into natural speech text
  formatInsightsForSpeech(insights) {
    let speechText = "Here's your sales call analysis summary. ";

    if (insights.keyPoints && insights.keyPoints.length > 0) {
      speechText += "Key discussion points include: ";
      speechText += insights.keyPoints.slice(0, 3).join(", ") + ". ";
    }

    if (insights.sentiment) {
      speechText += `The overall sentiment was ${insights.sentiment.toLowerCase()}. `;
    }

    if (insights.actionItems && insights.actionItems.length > 0) {
      speechText += "Your next action items are: ";
      speechText += insights.actionItems.slice(0, 2).join(", and ") + ". ";
    }

    if (insights.opportunities && insights.opportunities.length > 0) {
      speechText += "I've identified several opportunities including ";
      speechText += insights.opportunities[0] + ". ";
    }

    speechText += "Would you like me to elaborate on any of these points?";

    return speechText;
  }

  // Get mock voices for fallback
  getMockVoices() {
    return [
      {
        voice_id: 'pNInz6obpgDQGcFmaJgB',
        name: 'Adam',
        category: 'premade',
        description: 'Professional male voice'
      },
      {
        voice_id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Bella',
        category: 'premade',
        description: 'Professional female voice'
      },
      {
        voice_id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel',
        category: 'premade',
        description: 'Calm female voice'
      }
    ];
  }

  // Clean up audio URLs to prevent memory leaks
  revokeAudioUrl(audioUrl) {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
  }

  // Validate content is analysis-related (prevents arbitrary TTS usage)
  isAnalysisContent(text) {
    const analysisKeywords = [
      'analysis', 'summary', 'insight', 'recommendation', 'action item',
      'sentiment', 'opportunity', 'objection', 'key point', 'discussion',
      'call', 'conversation', 'sales', 'meeting', 'client', 'customer',
      'follow up', 'next step', 'timeline', 'budget', 'proposal'
    ];
    
    const lowerText = text.toLowerCase();
    return analysisKeywords.some(keyword => lowerText.includes(keyword)) || 
           text.length < 50; // Allow short responses
  }

  // Check if API key is configured
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'your-elevenlabs-api-key-here';
  }
}

export default ElevenLabsService;
