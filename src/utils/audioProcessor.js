// Audio processing utilities for VoxiFlow
export class AudioProcessor {
  constructor() {
    this.apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY;
    this.baseUrl = 'https://api.perplexity.ai/chat/completions';
  }

  // Validate uploaded file
  validateFile(file) {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'video/mp4', 'video/mov'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload MP3, WAV, M4A, FLAC, MP4, or MOV files.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 100MB.');
    }

    return true;
  }

  // Convert audio to base64 for processing
  async convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Simulate transcription process (replace with actual API call)
  async transcribeAudio(file, onProgress) {
    try {
      // Validate file first
      this.validateFile(file);

      // Simulate processing steps
      const steps = [
        { progress: 20, message: 'Uploading file...' },
        { progress: 40, message: 'Processing audio...' },
        { progress: 60, message: 'Transcribing speech...' },
        { progress: 80, message: 'Identifying speakers...' },
        { progress: 100, message: 'Analysis complete!' }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        onProgress(step.progress, step.message);
      }

      // Return mock transcript data
      return this.generateMockTranscript();
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  // Generate AI insights using Perplexity API
  async generateInsights(transcript) {
    try {
      const prompt = `Analyze this sales call transcript and provide insights:
      
${transcript.map(item => `${item.speaker}: ${item.text}`).join('\n')}

Please provide:
1. Key discussion points
2. Sentiment analysis
3. Action items
4. Opportunities identified
5. Potential objections
6. Next steps recommendations

Format as JSON with these sections.`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseInsights(data.choices[0].message.content);
    } catch (error) {
      console.error('Insights generation failed:', error);
      return this.generateMockInsights();
    }
  }

  // Parse AI response into structured insights
  parseInsights(aiResponse) {
    try {
      return JSON.parse(aiResponse);
    } catch {
      // Fallback to mock data if parsing fails
      return this.generateMockInsights();
    }
  }

  // Generate mock transcript for demo purposes
  generateMockTranscript() {
    return [
      {
        speaker: 'Sales Rep',
        text: 'Good morning! Thank you for taking the time to speak with me today about our enterprise solution.',
        timestamp: 15,
        confidence: 0.95,
        emotions: [{ type: 'confident', confidence: 0.8 }]
      },
      {
        speaker: 'Client',
        text: 'Hi there! Yes, I\'m interested in learning how this could help streamline our current workflow.',
        timestamp: 45,
        confidence: 0.92,
        emotions: [{ type: 'interested', confidence: 0.75 }]
      },
      {
        speaker: 'Sales Rep',
        text: 'Great! Let me walk you through our key features and how they align with your specific needs.',
        timestamp: 75,
        confidence: 0.94,
        emotions: [{ type: 'enthusiastic', confidence: 0.85 }]
      }
    ];
  }

  // Generate mock insights
  generateMockInsights() {
    return {
      keyPoints: [
        'Client showed strong interest in workflow automation',
        'Budget discussion indicates $50K-$100K range',
        'Decision timeline: Q1 2025 implementation'
      ],
      sentiment: 'Positive',
      actionItems: [
        'Send detailed pricing proposal',
        'Schedule technical demo with IT team',
        'Follow up within 48 hours'
      ],
      opportunities: [
        'Upsell opportunity for premium features',
        'Potential for multi-year contract',
        'Referral opportunity mentioned'
      ],
      objections: [
        'Concerns about integration complexity',
        'Budget approval process timeline'
      ],
      nextSteps: [
        'Prepare customized demo',
        'Connect with technical stakeholders',
        'Provide ROI calculations'
      ]
    };
  }
}

export default AudioProcessor;
