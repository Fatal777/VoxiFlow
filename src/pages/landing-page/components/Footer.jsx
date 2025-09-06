import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "API Documentation", href: "#api" },
        { name: "Integrations", href: "#integrations" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" },
        { name: "Contact", href: "#contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Blog", href: "#blog" },
        { name: "Webinars", href: "#webinars" },
        { name: "Case Studies", href: "#cases" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Security", href: "#security" },
        { name: "Compliance", href: "#compliance" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#twitter" },
    { name: "LinkedIn", icon: "Linkedin", href: "#linkedin" },
    { name: "GitHub", icon: "Github", href: "#github" },
    { name: "YouTube", icon: "Youtube", href: "#youtube" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900/20 border-t border-purple-600/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <Icon name="Mic" size={32} className="text-purple-400 mr-3" />
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">VoxiFlow</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your sales conversations into actionable insights with AI-powered analysis, 
              real-time transcription, and intelligent recommendations.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600/20 border border-gray-600 hover:border-purple-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={18} className="text-gray-400 hover:text-purple-400 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections?.map((section, index) => (
            <motion.div
              key={section?.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">{section?.title}</h3>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.name}>
                    <a
                      href={link?.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                    >
                      {link?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-purple-900/20 border border-purple-600/30 rounded-xl p-8 mb-12"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Stay Updated with VoxiFlow
            </h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on new features, sales insights, and AI advancements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                <span>Subscribe</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="Mic" size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">VoxiFlow</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Copyright */}
              <div className="text-sm text-gray-400">
                &copy; {currentYear} VoxiFlow. All rights reserved.
              </div>
              {/* Trust Badges */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Icon name="Shield" size={16} className="text-green-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Icon name="Award" size={16} className="text-yellow-400" />
                <span>ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;