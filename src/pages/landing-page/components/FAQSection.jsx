import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "How accurate is VoxiFlow\'s AI transcription?",
      answer: "VoxiFlow achieves 95%+ accuracy in transcription using advanced AI models. Our system includes speaker identification, handles multiple accents, and continuously improves through machine learning. Background noise filtering and real-time processing ensure high-quality results even in challenging audio conditions."
    },
    {
      question: "What file formats and recording methods are supported?",
      answer: "VoxiFlow supports all major audio formats including MP3, WAV, M4A, and FLAC. You can upload pre-recorded files, record directly through our web interface, or integrate with popular calling platforms. We also support video files (MP4, MOV) and can extract audio automatically."
    },
    {
      question: "How does the AI summarization work?",
      answer: "Our AI analyzes conversation patterns, identifies key topics, extracts action items, and provides sentiment analysis. The system recognizes sales methodologies, tracks objections, highlights opportunities, and generates actionable next steps. All insights are contextually relevant and customizable to your sales process."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. VoxiFlow uses enterprise-grade encryption (AES-256) for data at rest and in transit. We're SOC 2 compliant, GDPR compliant, and never share your data with third parties. You maintain full control over your data with options for automatic deletion and data export."
    },
    {
      question: "Can I integrate VoxiFlow with my existing CRM?",
      answer: "Yes, VoxiFlow integrates with popular CRMs including Salesforce, HubSpot, Pipedrive, and more. Our API allows custom integrations, and we can automatically sync call summaries, action items, and insights directly to your existing workflow and contact records."
    },
    {
      question: "What\'s included in the team collaboration features?",
      answer: "Team features include shared call libraries, collaborative annotations, team performance dashboards, coaching tools, and knowledge base creation. Managers can review calls, provide feedback, track team metrics, and identify best practices to share across the organization."
    },
    {
      question: "How long does it take to process a call?",
      answer: "Processing time depends on call length, but typically takes 2-3 minutes for a 30-minute call. Real-time transcription is available during live calls, and AI analysis begins immediately after upload. You'll receive notifications when processing is complete."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can analyze up to 10 calls during the trial period and experience the complete VoxiFlow platform including AI insights, flowcharts, and team collaboration tools."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about VoxiFlow's AI-powered sales call analysis platform.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs?.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-400/50 hover:bg-gray-800/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq?.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <Icon 
                    name="ChevronDown" 
                    size={24} 
                    className={`transition-colors duration-300 ${
                      openFAQ === index ? 'text-purple-400' : 'text-gray-400'
                    }`} 
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-700">
                      <p className="text-gray-300 leading-relaxed">
                        {faq?.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-400/20 border border-purple-400/30 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to help you get the most out of VoxiFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Icon name="Clock" size={16} className="text-purple-400" />
                <span>24/7 Support Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Icon name="MessageCircle" size={16} className="text-purple-400" />
                <span>Live Chat & Email</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Icon name="Phone" size={16} className="text-purple-400" />
                <span>Phone Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;