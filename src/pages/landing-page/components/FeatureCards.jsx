import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeatureCards = () => {
  const features = [
    {
      icon: 'Mic',
      title: 'AI-Powered Transcription',
      description: 'Advanced speech-to-text with speaker identification, timestamp markers, and real-time processing for accurate conversation capture.',
      highlights: ['Real-time processing', 'Speaker identification', 'Timestamp accuracy'],
      gradient: 'from-blue-500/20 to-primary/20'
    },
    {
      icon: 'Brain',
      title: 'Intelligent Summarization',
      description: 'AI-driven analysis extracts key insights, sentiment analysis, and actionable recommendations from every sales conversation.',
      highlights: ['Key insights extraction', 'Sentiment analysis', 'Action recommendations'],
      gradient: 'from-primary/20 to-purple-500/20'
    },
    {
      icon: 'GitBranch',
      title: 'Visual Flowcharts',
      description: 'Interactive conversation mapping with decision trees, objection tracking, and visual representation of call dynamics.',
      highlights: ['Conversation mapping', 'Decision trees', 'Interactive visualization'],
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: 'BarChart3',
      title: 'Performance Analytics',
      description: 'Comprehensive dashboards with talk-time ratios, outcome predictions, and comparative analysis across multiple calls.',
      highlights: ['Talk-time analysis', 'Outcome predictions', 'Comparative insights'],
      gradient: 'from-green-500/20 to-primary/20'
    },
    {
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Share insights, collaborate on analysis, and build team-wide knowledge base for improved sales performance.',
      highlights: ['Shared insights', 'Team knowledge base', 'Collaborative analysis'],
      gradient: 'from-orange-500/20 to-primary/20'
    },
    {
      icon: 'Shield',
      title: 'Enterprise Security',
      description: 'Bank-level encryption, privacy protection, and secure data handling with compliance to industry standards.',
      highlights: ['Data encryption', 'Privacy protection', 'Compliance ready'],
      gradient: 'from-red-500/20 to-primary/20'
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for Sales Excellence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your sales conversations into actionable insights with our comprehensive suite of AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              
              <div className="relative bg-gray-900 border border-purple-600/30 rounded-xl p-8 shadow-lg hover:border-purple-400 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-600/20 border border-purple-400/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon name={feature?.icon} size={28} className="text-purple-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white hover:text-purple-300 transition-colors duration-300">
                    {feature?.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature?.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 pt-4 border-t border-purple-600/20">
                    {feature?.highlights?.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span className="text-sm text-gray-400">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm">
            <Icon name="Sparkles" size={16} />
            <span>All features included in every plan</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;