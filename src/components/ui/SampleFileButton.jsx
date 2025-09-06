import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';

const SampleFileButton = ({ onSampleLoad, disabled = false, className = "" }) => {
  const handleLoadSample = () => {
    // Create a mock sample file for demonstration
    const sampleData = {
      name: 'sample-sales-call.mp3',
      size: 2456789, // ~2.5MB
      type: 'audio/mp3',
      duration: '15:32',
      description: 'Enterprise software sales call with objection handling',
      transcript: `Sales Rep: Thank you for taking the time to speak with me today about our enterprise solution. I understand you're currently evaluating different options for your team.

Prospect: Yes, that's right. We're looking to streamline our current processes, but I have to be honest - we're concerned about the implementation timeline and cost.

Sales Rep: I completely understand those concerns. Let me address the timeline first. Our typical enterprise implementation takes 4-6 weeks, and we provide dedicated support throughout. As for cost, I'd like to show you our ROI calculator that demonstrates how most clients see a 300% return within the first 6 months.

Prospect: That sounds promising, but we've heard similar claims before. What makes your solution different?

Sales Rep: Great question. The key differentiator is our AI-powered automation that reduces manual work by 80%. For a team your size, that translates to saving 40+ hours per week. Would you like me to walk you through a specific use case?

Prospect: Actually, yes. We're particularly interested in how this would work with our existing CRM system.

Sales Rep: Perfect! We have native integrations with all major CRMs. In fact, we can have you up and running with Salesforce in under 2 hours. Let me schedule a technical demo with your IT team - would this Friday work?

Prospect: Friday could work. But I need to understand the pricing structure better first.

Sales Rep: Absolutely. Our enterprise package starts at $50K annually, but given your team size and requirements, I can offer a customized solution. Would you be open to a 30-day pilot program at no cost?

Prospect: Now that's interesting. Tell me more about this pilot program.`,
      insights: {
        sentiment: 'Positive',
        keyTopics: ['Implementation Timeline', 'ROI', 'CRM Integration', 'Pricing'],
        objections: ['Cost concerns', 'Implementation timeline', 'Skepticism about claims'],
        opportunities: ['Pilot program interest', 'Technical demo scheduled', 'CRM integration need'],
        nextSteps: ['Schedule technical demo', 'Prepare pilot program proposal', 'Follow up on pricing']
      }
    };

    // Simulate file selection
    const mockFile = new File(['mock audio data'], sampleData.name, { type: sampleData.type });
    mockFile.sampleData = sampleData;
    
    onSampleLoad(mockFile);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Button
        onClick={handleLoadSample}
        disabled={disabled}
        variant="outline"
        className="w-full border-2 border-dashed border-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 py-6"
      >
        <div className="flex flex-col items-center space-y-2">
          <Icon name="Download" size={24} />
          <div className="text-center">
            <div className="font-semibold">Try Sample File</div>
            <div className="text-sm opacity-80">Load a demo sales call for testing</div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
};

export default SampleFileButton;
