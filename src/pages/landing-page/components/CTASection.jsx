import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/upload-interface');
  };

  const benefits = [
    { icon: 'Zap', text: 'Setup in under 5 minutes' },
    { icon: 'CreditCard', text: 'No credit card required' },
    { icon: 'Users', text: 'Full team collaboration' },
    { icon: 'Shield', text: 'Enterprise-grade security' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-purple-600/30 p-8 sm:p-12 md:p-16 shadow-2xl">

          <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main CTA Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sales Conversations?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              Join thousands of sales professionals who are already using VoxiFlow to extract actionable insights 
              and improve their performance with AI-powered analysis.
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
            >
              {benefits?.map((benefit, index) => (
                <motion.div
                  key={benefit?.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center p-3 sm:p-4 bg-gray-800/50 backdrop-blur-sm border border-purple-600/30 rounded-xl hover:border-purple-400 hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-purple-600/20 border border-purple-400/30 rounded-lg flex items-center justify-center mb-3">
                    <Icon name={benefit?.icon} size={24} className="text-purple-300" />
                  </div>
                  <span className="text-sm font-medium text-white text-center">{benefit?.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button
                variant="default"
                size="xl"
                onClick={handleStartAnalysis}
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Start Free Analysis
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black px-12 py-4 text-xl font-semibold"
                iconName="Calendar"
                iconPosition="left"
              >
                Schedule Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 pt-8 border-t border-purple-600/20"
            >
              <p className="text-sm text-gray-400 mb-6">
                Trusted by sales teams at leading companies worldwide
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {[
                  "TechFlow Solutions",
                  "Enterprise Dynamics", 
                  "Growth Partners",
                  "InnovateCorp",
                  "SalesForce Pro"
                ]?.map((company, index) => (
                  <motion.div
                    key={company}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {company}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-800 border border-purple-600/30 rounded-2xl p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">14 Days</div>
                <div className="text-sm text-gray-400">Free Trial</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">35%</div>
                <div className="text-sm text-gray-400">Average Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">5 Min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;