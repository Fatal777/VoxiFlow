import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DemoCallSelector = ({ onSelectDemo, isVisible }) => {
  const [selectedDemo, setSelectedDemo] = useState(null);

  const demoCalls = [
    {
      id: 'demo-1',
      title: 'Software Sales Discovery Call',
      duration: '8:32',
      description: 'Initial discovery call with a potential enterprise client discussing CRM needs',
      participants: ['Sales Rep: Sarah', 'Client: Mike Johnson'],
      tags: ['Discovery', 'Enterprise', 'CRM'],
      sampleData: {
        transcript: `Sales Rep: Hi Mike, thanks for taking the time to speak with me today. I understand you're looking into CRM solutions for your growing team?

Client: Yes, that's right Sarah. We're at about 50 employees now and our current system just isn't cutting it anymore. We need something more robust.

Sales Rep: I completely understand. What specific challenges are you facing with your current setup?

Client: Well, we're losing track of leads, our reporting is practically non-existent, and the team is spending too much time on manual data entry instead of actually selling.

Sales Rep: Those are exactly the pain points our platform addresses. Can you tell me more about your current sales process?

Client: Sure, we typically get leads from our website and trade shows. Right now everything goes into a basic spreadsheet, and honestly, it's a mess. We probably lose 20-30% of leads just because they fall through the cracks.

Sales Rep: That's a significant revenue impact. With our automated lead routing and follow-up sequences, most of our clients see a 40-50% improvement in lead conversion within the first quarter.

Client: That sounds promising. What about reporting? Our CEO is always asking for sales forecasts and I'm basically guessing based on gut feeling.

Sales Rep: Our real-time dashboard gives you complete visibility into your pipeline. You can generate forecasts, track individual rep performance, and identify bottlenecks instantly. Would you like to see a demo of how this works?

Client: Absolutely, that would be great. When can we schedule that?`,
        insights: {
          sentiment: 'Positive',
          keyTopics: ['CRM Solutions', 'Lead Management', 'Reporting', 'Sales Process'],
          talkTimeRatio: { salesRep: 45, client: 55 },
          nextSteps: ['Schedule product demo', 'Prepare ROI analysis', 'Connect with technical team'],
          objections: ['Current system limitations', 'Manual processes'],
          opportunities: ['Enterprise upgrade', 'Team training', 'Integration services']
        }
      }
    },
    {
      id: 'demo-2',
      title: 'Marketing Agency Closing Call',
      duration: '12:15',
      description: 'Final negotiation call with a marketing agency for digital advertising services',
      participants: ['Account Manager: David', 'Client: Lisa Chen'],
      tags: ['Closing', 'Negotiation', 'Marketing'],
      sampleData: {
        transcript: `Account Manager: Hi Lisa, thanks for making time today. I know you've been reviewing our proposal for the past week. What are your thoughts?

Client: Hi David. Overall, I'm impressed with what you've put together. The strategy looks solid and the case studies you shared are compelling. I do have some concerns about the budget though.

Account Manager: I appreciate your honesty. What specific aspects of the budget are concerning you?

Client: Well, the monthly retainer is about 20% higher than what we initially discussed. I understand you've added some additional services, but I need to make sure this fits within our Q4 budget.

Account Manager: I completely understand. Let me break down exactly what's included in that additional 20%. We've added advanced analytics reporting, A/B testing for all campaigns, and dedicated account management. These typically add 30-40% more value than the base package.

Client: That does sound valuable. Can you help me understand the ROI we might see?

Account Manager: Absolutely. Based on your current conversion rates and the improvements we've seen with similar clients, we're projecting a 3.2x return on ad spend within the first 90 days. That would mean an additional $180,000 in revenue for your Q4 campaigns.

Client: Those numbers are attractive. What if we started with a 3-month trial at the original budget, and then scaled up if we hit those targets?

Account Manager: I like your thinking. Let me propose something - we can start at the original budget for the first month, but include all the premium services. If we hit a 2.5x ROAS in month one, we move to the full proposal for months two and three. Does that work?

Client: That sounds fair. What do we need to do to get started?

Account Manager: Perfect! I'll send over the updated agreement this afternoon. We can kick off as early as next Monday if you're ready.`,
        insights: {
          sentiment: 'Very Positive',
          keyTopics: ['Budget Negotiation', 'ROI Projections', 'Service Package', 'Trial Period'],
          talkTimeRatio: { accountManager: 52, client: 48 },
          nextSteps: ['Send updated agreement', 'Schedule kickoff meeting', 'Prepare onboarding materials'],
          objections: ['Budget concerns', 'Risk mitigation'],
          opportunities: ['Upsell premium services', 'Long-term contract', 'Referral potential']
        }
      }
    },
    {
      id: 'demo-3',
      title: 'SaaS Product Demo Call',
      duration: '15:45',
      description: 'Product demonstration for a project management SaaS platform',
      participants: ['Sales Engineer: Alex', 'Client: Jennifer Rodriguez'],
      tags: ['Demo', 'SaaS', 'Product'],
      sampleData: {
        transcript: `Sales Engineer: Good morning Jennifer! I'm excited to show you how our platform can streamline your team's project management. Before we dive in, can you tell me about your current workflow?

Client: Hi Alex! Right now we're using a combination of email, spreadsheets, and sticky notes. It's honestly pretty chaotic, especially with our remote team members.

Sales Engineer: I can imagine how challenging that must be. Let me show you how we can bring all of that into one centralized platform. Are you able to see my screen?

Client: Yes, I can see it perfectly.

Sales Engineer: Great! So this is our main dashboard. As you can see, you get a bird's eye view of all your projects, team workload, and upcoming deadlines. Let's start with project creation. Say you're launching a new marketing campaign...

Client: This interface looks really clean. How long does it typically take to set up a new project?

Sales Engineer: With our templates, you can have a new project up and running in under 2 minutes. Watch this - I'll create a sample marketing campaign project. You can see I'm selecting from pre-built templates, assigning team members, and setting milestones.

Client: Wow, that was fast. What about time tracking? That's been a huge pain point for us.

Sales Engineer: Perfect question! Time tracking is built right into each task. Team members can start and stop timers directly from their task view, or log time manually. Everything automatically feeds into your reporting dashboard.

Client: And this works on mobile too?

Sales Engineer: Absolutely! Let me show you the mobile app. Your team can update tasks, log time, and communicate on the go. We also have offline sync, so they can work without internet and everything syncs when they're back online.

Client: This looks like exactly what we need. What's the pricing like for a team of 15?

Sales Engineer: For 15 users, you'd be looking at our Professional plan, which is $12 per user per month. That includes everything I've shown you plus priority support and advanced reporting.

Client: That's within our budget. Is there a trial period?

Sales Engineer: Yes! We offer a 14-day free trial with full access to all features. I can set that up for you right now if you'd like.`,
        insights: {
          sentiment: 'Highly Positive',
          keyTopics: ['Project Management', 'Team Collaboration', 'Time Tracking', 'Mobile Access', 'Pricing'],
          talkTimeRatio: { salesEngineer: 65, client: 35 },
          nextSteps: ['Set up free trial', 'Schedule follow-up call', 'Provide onboarding resources'],
          objections: ['None identified'],
          opportunities: ['Team expansion', 'Advanced features', 'Annual subscription discount']
        }
      }
    },
    {
      id: 'demo-4',
      title: 'Objection Handling Call',
      duration: '10:28',
      description: 'Follow-up call addressing client concerns about implementation and pricing',
      participants: ['Senior Sales Rep: Maria', 'Client: Robert Kim'],
      tags: ['Objection Handling', 'Follow-up', 'Implementation'],
      sampleData: {
        transcript: `Senior Sales Rep: Hi Robert, thanks for taking my call. I know you had some concerns after our last conversation about the implementation timeline and costs. I'd love to address those today.

Client: Hi Maria. Yes, I've been thinking about it, and I'm worried about the disruption to our current operations. We can't afford any downtime during our busy season.

Senior Sales Rep: I completely understand that concern, Robert. Let me share how we've handled similar situations. We actually have a phased implementation approach specifically designed for businesses like yours that can't afford disruption.

Client: What does that look like exactly?

Senior Sales Rep: We start by running our system in parallel with your current setup for the first month. Your team continues using their familiar tools while we gradually migrate data and train users. There's zero risk of downtime.

Client: That sounds better, but what about the learning curve? My team is already stretched thin.

Senior Sales Rep: Great question. Our average user is fully productive within 3 days of training. We provide dedicated onboarding specialists, and 87% of our clients report their teams are more efficient within the first week.

Client: The other concern is the total cost. When I factor in implementation, training, and the monthly fees, it's a significant investment.

Senior Sales Rep: I hear you on the investment aspect. Let me put this in perspective - what's your current cost of inefficiency? You mentioned your team spends about 2 hours per day on administrative tasks that our system automates.

Client: That's probably accurate, maybe even conservative.

Senior Sales Rep: So for your team of 8, that's 16 hours daily, or about $800 per day in labor costs at your average hourly rate. Our solution pays for itself in less than 3 weeks just from those time savings alone.

Client: I hadn't thought about it that way. What about ongoing support?

Senior Sales Rep: You get unlimited support included in your subscription. Plus, we have a 99.9% uptime guarantee and our support team has an average response time of under 2 hours.

Client: This is starting to make more sense. Can we do a smaller pilot program first?

Senior Sales Rep: Absolutely! We can start with just your core team of 3 users for the first month. If you're happy with the results, we'll expand to the full team. Would that work better for you?

Client: Yes, that would definitely reduce the risk. Let's explore that option.`,
        insights: {
          sentiment: 'Neutral to Positive',
          keyTopics: ['Implementation Concerns', 'Cost Justification', 'Risk Mitigation', 'Pilot Program'],
          talkTimeRatio: { salesRep: 58, client: 42 },
          nextSteps: ['Prepare pilot program proposal', 'Calculate ROI projections', 'Schedule implementation planning'],
          objections: ['Implementation disruption', 'Learning curve', 'Total cost of ownership'],
          opportunities: ['Pilot program', 'Phased rollout', 'Long-term partnership']
        }
      }
    }
  ];

  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    onSelectDemo(demo);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/95 backdrop-blur border border-purple-600/30 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Choose a Demo Sales Call</h3>
      <p className="text-sm text-gray-400 mb-6">
        Select from our realistic sales call scenarios to see VoxiFlow's analysis in action
      </p>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {demoCalls.map((demo) => (
          <motion.div
            key={demo.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectDemo(demo)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedDemo?.id === demo.id
                ? 'border-purple-500 bg-purple-600/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-purple-600/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white text-sm">{demo.title}</h4>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {demo.duration}
              </span>
            </div>
            
            <p className="text-xs text-gray-300 mb-3">{demo.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {demo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-400">
              {demo.participants.join(' • ')}
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg"
        >
          <p className="text-sm text-purple-300">
            ✓ Selected: {selectedDemo.title}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DemoCallSelector;
