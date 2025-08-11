"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Bot,
  Search,
  FileText,
  Activity,
  Target,
  Zap,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
  Eye,
  Building2,
  Bell,
  Database,
  Gavel,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "pending" | "blocked" | "flagged";
  progress: number;
  duration: string;
  automation: string;
  icon: any;
  details: string[];
  riskLevel?: "low" | "medium" | "high" | "critical";
}

export const WorkflowVisualization = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("inst_001");
  const [isPlaying, setIsPlaying] = useState(true);

  const workflowSteps: WorkflowStep[] = [
    {
      id: "transaction_ingestion",
      title: "Transaction Data Ingestion",
      description: "Real-time capture and normalization of DeFi transaction data",
      status: "completed",
      progress: 100,
      duration: "< 1s",
      automation: "Fully Automated",
      icon: Database,
      details: [
        "Multi-blockchain transaction monitoring",
        "Protocol-specific data extraction",
        "Transaction metadata enrichment",
        "Real-time streaming pipeline"
      ],
      riskLevel: "low"
    },
    {
      id: "initial_screening",
      title: "AI-Powered Risk Screening",
      description: "Machine learning algorithms analyze transactions for compliance risks",
      status: "completed",
      progress: 100,
      duration: "0.3s",
      automation: "AI Automated",
      icon: Bot,
      details: [
        "Pattern recognition algorithms",
        "Anomaly detection models",
        "Risk scoring calculations",
        "Historical data correlation"
      ],
      riskLevel: "low"
    },
    {
      id: "regulatory_mapping",
      title: "Regulatory Framework Mapping",
      description: "Map transactions to applicable regulatory requirements",
      status: "completed",
      progress: 100,
      duration: "0.5s",
      automation: "Rule-Based",
      icon: Gavel,
      details: [
        "Jurisdiction identification",
        "Applicable regulations mapping",
        "Compliance requirement matching",
        "Cross-border regulation analysis"
      ],
      riskLevel: "low"
    },
    {
      id: "aml_kyc_check",
      title: "AML/KYC Compliance Check",
      description: "Anti-money laundering and know-your-customer validation",
      status: "active",
      progress: 75,
      duration: "2.1s",
      automation: "Hybrid AI + Manual",
      icon: Shield,
      details: [
        "Sanctions list screening",
        "PEP (Politically Exposed Person) checks",
        "Source of funds analysis",
        "Beneficial ownership verification"
      ],
      riskLevel: "medium"
    },
    {
      id: "protocol_analysis",
      title: "Protocol Security Analysis",
      description: "Deep analysis of smart contracts and protocol mechanics",
      status: "active",
      progress: 45,
      duration: "5.8s",
      automation: "AI + Expert Review",
      icon: Search,
      details: [
        "Smart contract vulnerability scanning",
        "Protocol mechanism review",
        "Liquidity risk assessment",
        "Governance token analysis"
      ],
      riskLevel: "high"
    },
    {
      id: "reporting_generation",
      title: "Compliance Report Generation",
      description: "Automated generation of regulatory compliance reports",
      status: "pending",
      progress: 0,
      duration: "3.0s",
      automation: "Template-Based",
      icon: FileText,
      details: [
        "Regulatory report templates",
        "Custom formatting per jurisdiction",
        "Audit trail documentation",
        "Executive summary generation"
      ],
      riskLevel: "low"
    },
    {
      id: "stakeholder_notification",
      title: "Stakeholder Notification",
      description: "Notify relevant parties of compliance status and actions required",
      status: "pending",
      progress: 0,
      duration: "1.0s",
      automation: "Conditional Logic",
      icon: Bell,
      details: [
        "Risk-based alerting",
        "Stakeholder role mapping",
        "Escalation procedures",
        "Communication templates"
      ],
      riskLevel: "medium"
    },
    {
      id: "continuous_monitoring",
      title: "Continuous Monitoring",
      description: "Ongoing surveillance of approved protocols and transactions",
      status: "pending",
      progress: 0,
      duration: "Ongoing",
      automation: "Fully Automated",
      icon: Eye,
      details: [
        "Real-time monitoring dashboard",
        "Threshold-based alerts",
        "Behavioral pattern analysis",
        "Performance metric tracking"
      ],
      riskLevel: "low"
    }
  ];

  const mockInstitutions = [
    {
      id: "inst_001",
      name: "JPMorgan Chase & Co.",
      type: "Investment Bank",
      currentProcess: "Protocol Security Analysis",
      compliance: 94.2
    },
    {
      id: "inst_002", 
      name: "Goldman Sachs Group",
      type: "Investment Bank",
      currentProcess: "AML/KYC Compliance Check", 
      compliance: 87.6
    },
    {
      id: "inst_003",
      name: "Bank of America Corp",
      type: "Commercial Bank",
      currentProcess: "Continuous Monitoring",
      compliance: 96.8
    }
  ];

  const getStepIcon = (step: WorkflowStep) => {
    const IconComponent = step.icon;
    return <IconComponent className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-gray-600 bg-gray-100";
      case "blocked":
        return "text-red-600 bg-red-100";
      case "flagged":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "active":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-600" />;
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const currentStep = workflowSteps.find(step => step.status === "active");
  const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
  const totalSteps = workflowSteps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Compliance Workflow Visualization
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time view of institutional DeFi compliance processes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            {mockInstitutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>

          <Button
            variant={isPlaying ? "outline" : "default"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="font-medium"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Institution Overview */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                {mockInstitutions.find(i => i.id === selectedInstitution)?.name}
              </CardTitle>
              <CardDescription>
                {mockInstitutions.find(i => i.id === selectedInstitution)?.type} • 
                Currently: {mockInstitutions.find(i => i.id === selectedInstitution)?.currentProcess}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-blue-600">
                {mockInstitutions.find(i => i.id === selectedInstitution)?.compliance}%
              </div>
              <div className="text-sm text-gray-600">Compliance Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-gray-600">
                {completedSteps}/{totalSteps} steps completed
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            {currentStep && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Currently processing: <strong>{currentStep.title}</strong></span>
                <span className="text-gray-500">• ETA: {currentStep.duration}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="grid gap-4">
        {workflowSteps.map((step, index) => (
          <Card
            key={step.id}
            className={`transition-all duration-300 hover:shadow-md ${
              step.status === "active" ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                      step.status
                    )}`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  
                  {index < workflowSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-16 mt-2 ${
                        step.status === "completed" ? "bg-green-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        
                        {step.riskLevel && (
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getRiskColor(step.riskLevel)}`} />
                            <span className="text-xs text-gray-600 uppercase font-medium">
                              {step.riskLevel} risk
                            </span>
                          </div>
                        )}

                        <Badge
                          variant="outline"
                          className={`${getStatusColor(step.status)} border font-medium`}
                        >
                          {getStatusIcon(step.status)}
                          <span className="ml-1 capitalize">{step.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>

                    <div className="text-right ml-4">
                      <div className="font-semibold text-gray-900">{step.duration}</div>
                      <div className="text-xs text-gray-500">{step.automation}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {step.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <Progress 
                        value={step.progress} 
                        className={`h-2 ${
                          step.status === "active" ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">12.7s</div>
            <p className="text-xs text-gray-600">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rate</CardTitle>
            <Bot className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">94.2%</div>
            <p className="text-xs text-gray-600">Fully automated steps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-purple-600">99.1%</div>
            <p className="text-xs text-gray-600">Compliance validation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
      description: "AI optimizes job description for Web3 talent attraction",
      status: "completed",
      progress: 100,
      duration: "2 min",
      automation: "AI + Smart Contract",
      icon: Target,
      details: [
        "Smart contract creates SLA with automatic deadlines",
        "AI extracts skills and requirements",
        "Circle Layer reputation stakes locked",
        "Skill weight matrix generated (Solidity: 40%, React: 30%)",
      ],
    },
    {
      id: "candidate_discovery",
      title: "AI Candidate Discovery",
      description:
        "Multi-source intelligent candidate finding across platforms",
      status: "completed",
      progress: 100,
      duration: "15 min",
      automation: "AI Web Scraping",
      icon: Search,
      details: [
        "GitHub: 47 candidates analyzed",
        "LinkedIn: 23 profiles scraped",
        "Web3 communities: 12 found",
        "Blockchain activity verified for all",
      ],
    },
    {
      id: "verification",
      title: "Scam Detection & Verification",
      description: "AI verifies real candidates, blocks fake profiles",
      status: "completed",
      progress: 100,
      duration: "8 min",
      automation: "AI + Blockchain",
      icon: Shield,
      details: [
        "Fake profile detection: 99.2% accuracy",
        "Cross-platform verification completed",
        "Real contribution analysis: 82 candidates verified",
        "3 fake profiles blocked automatically",
      ],
    },
    {
      id: "scoring",
      title: "Smart Scoring & Ranking",
      description: "AI scores candidates on multiple dimensions",
      status: "completed",
      progress: 100,
      duration: "5 min",
      automation: "ML Algorithm",
      icon: TrendingUp,
      details: [
        "Technical Skills (35%): GitHub analysis",
        "Experience Match (25%): 5+ years average",
        "Reputation Score (20%): Circle Layer verified",
        "Top 12 candidates ranked and ready",
      ],
    },
    {
      id: "outreach",
      title: "Automated Personalized Outreach",
      description: "AI sends custom messages based on GitHub projects",
      status: "active",
      progress: 75,
      duration: "2 hours",
      automation: "AI Communication",
      icon: MessageSquare,
      details: [
        "Personalized messages sent to top 12 candidates",
        "9 responses received (75% response rate)",
        "6 interested, 2 need more info, 1 not available",
        "Auto follow-ups scheduled for 2 unclear responses",
      ],
    },
    {
      id: "scheduling",
      title: "Smart Interview Scheduling",
      description: "Automatic calendar coordination and SLA creation",
      status: "active",
      progress: 50,
      duration: "1 day",
      automation: "Calendar AI + SLAs",
      icon: Calendar,
      details: [
        "6 candidates confirmed for interviews",
        "Smart calendar scheduling in progress",
        "SLA contracts created for each interview",
        "Anti-ghosting penalties activated",
      ],
    },
    {
      id: "interviews",
      title: "Interview Process Automation",
      description: "Automated reminders, feedback collection, and analysis",
      status: "pending",
      progress: 0,
      duration: "3 days",
      automation: "AI + Notifications",
      icon: Users,
      details: [
        "Automated interview reminders scheduled",
        "Real-time feedback collection system ready",
        "AI sentiment analysis prepared",
        "Next steps automation configured",
      ],
    },
    {
      id: "decision",
      title: "AI-Assisted Decision Making",
      description: "Aggregate data and predict hiring success",
      status: "pending",
      progress: 0,
      duration: "1 day",
      automation: "Predictive AI",
      icon: Bot,
      details: [
        "Data aggregation from all sources",
        "Success prediction model ready",
        "Historical hiring pattern analysis",
        "Risk assessment and recommendations",
      ],
    },
    {
      id: "offer",
      title: "Automated Offer & Negotiation",
      description: "Smart contract escrow and negotiation handling",
      status: "pending",
      progress: 0,
      duration: "2 days",
      automation: "Smart Contracts",
      icon: CheckCircle,
      details: [
        "Smart contract escrow prepared",
        "Salary negotiation parameters set",
        "Circle Layer reputation tracking active",
        "Anti-ghosting protection enabled",
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "active":
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case "blocked":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "active":
        return "border-blue-200 bg-blue-50";
      case "blocked":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const currentStep = workflowSteps.find((step) => step.status === "active");
  const completedSteps = workflowSteps.filter(
    (step) => step.status === "completed"
  ).length;
  const totalProgress = (completedSteps / workflowSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Complete Workflow Automation
              </CardTitle>
              <CardDescription>
                End-to-end AI-powered recruitment with blockchain enforcement
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Play"} Demo
              </Button>
              <Badge className="bg-blue-100 text-blue-700">
                Live Job: Senior Solidity Developer
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedSteps}/{workflowSteps.length} steps completed
              </span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>4 steps completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>2 steps active</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span>3 steps remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <Card
              key={step.id}
              className={`transition-all duration-200 ${getStatusColor(
                step.status
              )}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Step Number & Status */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-current">
                      {getStatusIcon(step.status)}
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-2 ${
                          step.status === "completed"
                            ? "bg-green-300"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {step.automation}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {step.duration}
                        </span>
                        {step.status === "active" && (
                          <ChevronRight className="h-4 w-4 text-blue-600 animate-pulse" />
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700">{step.description}</p>

                    {/* Progress Bar */}
                    {step.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-1.5" />
                      </div>
                    )}

                    {/* Step Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Activity */}
      {currentStep && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5 animate-pulse" />
              Currently Active: {currentStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-blue-700">{currentStep.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Progress:</span>
                  <Progress value={currentStep.progress} className="w-32 h-2" />
                  <span className="text-sm">{currentStep.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">ETA:</span>
                  <span className="text-sm">{currentStep.duration}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Workflow Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-green-700">SLA Compliance</div>
              <div className="text-xs text-gray-600">vs 40% industry avg</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7 days</div>
              <div className="text-sm text-blue-700">Avg Hire Time</div>
              <div className="text-xs text-gray-600">
                vs 90 days industry avg
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99%</div>
              <div className="text-sm text-purple-700">Fake Detection</div>
              <div className="text-xs text-gray-600">
                AI-powered verification
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">80%</div>
              <div className="text-sm text-orange-700">Cost Reduction</div>
              <div className="text-xs text-gray-600">
                vs traditional methods
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
