import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OpportunityHighlights = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const opportunities = [
    {
      id: 1,
      type: 'upsell',
      title: 'Premium Feature Upsell',
      description: 'Client expressed interest in advanced analytics capabilities during minute 12:30',
      priority: 'high',
      confidence: 85,
      potentialValue: '$15,000',
      timestamp: '12:30',
      context: `Client mentioned: "We really need better reporting capabilities for our executive team. The basic dashboards aren't giving us the insights we need."`,
      recommendation: 'Schedule a demo of the premium analytics suite within the next 48 hours',
      nextSteps: [
        'Send premium analytics demo video',
        'Schedule technical deep-dive call',
        'Prepare ROI calculator for their use case'
      ]
    },
    {
      id: 2,
      type: 'expansion',
      title: 'Multi-Department Expansion',
      description: 'Mentioned other departments facing similar challenges',
      priority: 'medium',
      confidence: 70,
      potentialValue: '$45,000',
      timestamp: '08:45',
      context: `Client said: "Our marketing and HR teams are dealing with the same workflow issues. They've been asking about solutions too."`,
      recommendation: 'Propose enterprise-wide implementation with department-specific customizations',
      nextSteps: [
        'Request stakeholder meeting with all departments',
        'Prepare enterprise pricing proposal',
        'Create department-specific use case presentations'
      ]
    },
    {
      id: 3,
      type: 'referral',
      title: 'Partner Network Referral',
      description: 'Client mentioned industry connections with similar needs',
      priority: 'medium',
      confidence: 60,
      potentialValue: '$25,000',
      timestamp: '16:20',
      context: `Client noted: "I know several companies in our industry association who are struggling with the same problems."`,
      recommendation: 'Establish referral partnership and request introductions',
      nextSteps: [
        'Send referral program details',
        'Request warm introductions',
        'Prepare industry-specific case studies'
      ]
    },
    {
      id: 4,
      type: 'renewal',
      title: 'Early Renewal Opportunity',
      description: 'Strong satisfaction indicators suggest early renewal potential',
      priority: 'low',
      confidence: 75,
      potentialValue: '$30,000',
      timestamp: '19:15',
      context: `Client expressed: "This solution would solve so many of our current headaches. We need something like this in place as soon as possible."`,
      recommendation: 'Propose multi-year contract with early implementation discount',
      nextSteps: [
        'Prepare multi-year pricing options',
        'Schedule contract discussion',
        'Offer implementation acceleration program'
      ]
    }
  ];

  const objections = [
    {
      id: 1,
      type: 'price',
      title: 'Budget Concerns',
      description: 'Client expressed concern about upfront investment',
      timestamp: '14:20',
      severity: 'medium',
      context: `"The pricing seems steep for our current budget allocation. We'd need to see significant ROI to justify this investment."`,
      response: 'Addressed with ROI calculator and flexible payment terms',
      status: 'resolved',
      followUp: 'Send detailed ROI analysis with industry benchmarks'
    },
    {
      id: 2,
      type: 'timeline',
      title: 'Implementation Timeline',
      description: 'Concerns about deployment speed and team availability',
      timestamp: '10:15',
      severity: 'low',
      context: `"Our team is already stretched thin. We can't afford a lengthy implementation that disrupts our current operations."`,
      response: 'Explained phased rollout approach and dedicated support',
      status: 'resolved',
      followUp: 'Provide detailed implementation timeline with milestones'
    },
    {
      id: 3,
      type: 'technical',
      title: 'Integration Complexity',
      description: 'Questions about compatibility with existing systems',
      timestamp: '06:30',
      severity: 'high',
      context: `"We have a complex tech stack with several legacy systems. Integration is always a nightmare for us."`,
      response: 'Scheduled technical consultation with solutions architect',
      status: 'pending',
      followUp: 'Arrange technical discovery call with their IT team'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upsell': return 'TrendingUp';
      case 'expansion': return 'Building';
      case 'referral': return 'Users';
      case 'renewal': return 'RefreshCw';
      case 'price': return 'DollarSign';
      case 'timeline': return 'Clock';
      case 'technical': return 'Settings';
      default: return 'Circle';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'pending': return 'text-warning';
      case 'escalated': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Opportunities */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
              <Icon name="Target" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Opportunities Identified</h3>
              <p className="text-sm text-muted-foreground">Potential revenue and expansion opportunities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-success">
              <Icon name="DollarSign" size={14} />
              <span className="font-medium">$115K</span>
              <span className="text-muted-foreground">potential value</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Target" size={14} />
              <span>{opportunities?.length} opportunities</span>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {opportunities?.map((opportunity) => (
              <div
                key={opportunity?.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
                  selectedOpportunity?.id === opportunity?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-muted'
                }`}
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
                      <Icon name={getTypeIcon(opportunity?.type)} size={16} className="text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{opportunity?.title}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity?.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getPriorityColor(opportunity?.priority)}`}>
                      <Icon name={getPriorityIcon(opportunity?.priority)} size={14} />
                      <span className="text-xs font-medium capitalize">{opportunity?.priority}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>{opportunity?.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="DollarSign" size={12} />
                      <span className="font-medium">{opportunity?.potentialValue}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-muted-foreground">
                      {opportunity?.confidence}% confidence
                    </div>
                    <div className="w-12 bg-muted rounded-full h-1.5">
                      <div
                        className="bg-success rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${opportunity?.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Objections */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Objections & Concerns</h3>
              <p className="text-sm text-muted-foreground">Client concerns and resolution status</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={14} />
              <span className="font-medium">2</span>
              <span className="text-muted-foreground">resolved</span>
            </div>
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="Clock" size={14} />
              <span className="font-medium">1</span>
              <span className="text-muted-foreground">pending</span>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {objections?.map((objection) => (
              <div
                key={objection?.id}
                className="p-4 border border-border rounded-lg hover:shadow-elevation-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      objection?.severity === 'high' ? 'bg-error/10' :
                      objection?.severity === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                    }`}>
                      <Icon 
                        name={getTypeIcon(objection?.type)} 
                        size={16} 
                        className={getSeverityColor(objection?.severity)} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{objection?.title}</h4>
                      <p className="text-sm text-muted-foreground">{objection?.description}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                    objection?.status === 'resolved' ? 'bg-success/10 text-success' :
                    objection?.status === 'pending'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                  }`}>
                    {objection?.status}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  <Icon name="Quote" size={12} className="inline mr-1" />
                  {objection?.context}
                </div>
                
                <div className="text-sm text-foreground mb-2">
                  <strong>Response:</strong> {objection?.response}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    <span>{objection?.timestamp}</span>
                  </div>
                  
                  <div className="text-xs text-primary">
                    {objection?.followUp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                    <Icon name={getTypeIcon(selectedOpportunity?.type)} size={20} className="text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedOpportunity?.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity?.description}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={() => setSelectedOpportunity(null)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Context */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Context</h4>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground italic">"{selectedOpportunity?.context}"</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    <span>Timestamp: {selectedOpportunity?.timestamp}</span>
                  </div>
                </div>
              </div>
              
              {/* Recommendation */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Recommendation</h4>
                <p className="text-sm text-foreground">{selectedOpportunity?.recommendation}</p>
              </div>
              
              {/* Next Steps */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Next Steps</h4>
                <div className="space-y-2">
                  {selectedOpportunity?.nextSteps?.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="DollarSign" size={14} />
                    <span className="font-medium">{selectedOpportunity?.potentialValue}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="Target" size={14} />
                    <span>{selectedOpportunity?.confidence}% confidence</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Add to CRM
                  </Button>
                  <Button variant="default" size="sm">
                    Schedule Follow-up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityHighlights;