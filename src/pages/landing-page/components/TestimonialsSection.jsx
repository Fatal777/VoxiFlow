import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "VP of Sales",
      company: "TechFlow Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "VoxiFlow transformed how our sales team analyzes conversations. The AI insights helped us increase our close rate by 35% in just three months. The flowchart visualization is game-changing.",
      rating: 5,
      metrics: { improvement: "35%", timeframe: "3 months" }
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Sales Director",
      company: "Enterprise Dynamics",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The real-time transcription and sentiment analysis give us immediate feedback during calls. Our team's performance has improved dramatically, and we're closing deals faster than ever.",
      rating: 5,
      metrics: { improvement: "42%", timeframe: "2 months" }
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Head of Business Development",
      company: "Growth Partners",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "VoxiFlow\'s AI summarization saves us hours of manual note-taking. The actionable insights and next-step recommendations have revolutionized our follow-up process.",
      rating: 5,
      metrics: { improvement: "28%", timeframe: "4 months" }
    },
    {
      id: 4,
      name: "David Kim",
      role: "Regional Sales Manager",
      company: "InnovateCorp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The team collaboration features and shared insights have created a knowledge base that benefits our entire sales organization. New hires get up to speed 50% faster.",
      rating: 5,
      metrics: { improvement: "50%", timeframe: "6 weeks" }
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const handleTestimonialChange = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentData = testimonials?.[currentTestimonial];

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of sales professionals who have transformed their performance with VoxiFlow
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 border border-purple-600/30 rounded-2xl p-8 md:p-12 shadow-lg relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Icon name="Quote" size={24} className="text-purple-400" />
              </div>

              {/* Content */}
              <div className="pt-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(currentData?.rating)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-medium">
                  "{currentData?.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={currentData?.avatar}
                        alt={currentData?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white">{currentData?.name}</h4>
                      <p className="text-gray-300">{currentData?.role}</p>
                      <p className="text-sm text-purple-600 font-medium">{currentData?.company}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{currentData?.metrics?.improvement}</div>
                      <div className="text-xs text-gray-400">Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-400">{currentData?.metrics?.timeframe}</div>
                      <div className="text-xs text-gray-400">Timeframe</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials?.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-purple-400 scale-125' :'bg-gray-600 hover:bg-purple-400/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => handleTestimonialChange((currentTestimonial - 1 + testimonials?.length) % testimonials?.length)}
              className="p-2 bg-gray-800 border border-purple-600/30 rounded-full hover:border-purple-400 transition-colors duration-300"
            >
              <Icon name="ChevronLeft" size={20} className="text-gray-400" />
            </button>
            
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`p-2 rounded-full border transition-colors duration-300 ${
                isAutoPlaying
                  ? 'bg-purple-600/20 border-purple-400/30 text-purple-400' :'bg-gray-800 border-purple-600/30 text-gray-400 hover:border-purple-400'
              }`}
            >
              <Icon name={isAutoPlaying ? "Pause" : "Play"} size={20} />
            </button>
            
            <button
              onClick={() => handleTestimonialChange((currentTestimonial + 1) % testimonials?.length)}
              className="p-2 bg-gray-800 border border-purple-600/30 rounded-full hover:border-purple-400 transition-colors duration-300"
            >
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden border border-purple-600/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { value: "10,000+", label: "Calls Analyzed" },
              { value: "500+", label: "Sales Teams" },
              { value: "35%", label: "Avg. Improvement" },
              { value: "99.9%", label: "Uptime" }
            ]?.map((stat, index) => (
              <div key={stat?.label} className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-purple-400 mb-2"
                >
                  {stat?.value}
                </motion.div>
                <div className="text-sm text-gray-300 font-medium">{stat?.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;