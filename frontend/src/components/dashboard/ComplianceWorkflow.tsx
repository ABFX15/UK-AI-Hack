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

export const ComplianceWorkflow = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("inst_001");
  const [isPlaying, setIsPlaying] = useState(true);

  const workflowSteps: WorkflowStep[] = [
    {
      id: "transaction_ingestion",
      title: "Transaction Data Ingestion",
      description:
        "Real-time capture and normalization of DeFi transaction data",
      status: "completed",
      progress: 100,
      duration: "< 1s",
      automation: "Fully Automated",
      icon: Database,
      details: [
        "Multi-blockchain transaction monitoring",
        "Protocol-specific data extraction",
        "Transaction metadata enrichment",
        "Real-time streaming pipeline",
      ],
      riskLevel: "low",
    },
    {
      id: "initial_screening",
      title: "AI-Powered Risk Screening",
      description:
        "Machine learning algorithms analyze transactions for compliance risks",
      status: "completed",
      progress: 100,
      duration: "0.3s",
      automation: "AI Automated",
      icon: Bot,
      details: [
        "Pattern recognition algorithms",
        "Anomaly detection models",
        "Risk scoring calculations",
        "Historical data correlation",
      ],
      riskLevel: "low",
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
        "Cross-border regulation analysis",
      ],
      riskLevel: "low",
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
        "Beneficial ownership verification",
      ],
      riskLevel: "medium",
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
        "Governance token analysis",
      ],
      riskLevel: "high",
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
        "Executive summary generation",
      ],
      riskLevel: "low",
    },
    {
      id: "stakeholder_notification",
      title: "Stakeholder Notification",
      description:
        "Notify relevant parties of compliance status and actions required",
      status: "pending",
      progress: 0,
      duration: "1.0s",
      automation: "Conditional Logic",
      icon: Bell,
      details: [
        "Risk-based alerting",
        "Stakeholder role mapping",
        "Escalation procedures",
        "Communication templates",
      ],
      riskLevel: "medium",
    },
    {
      id: "continuous_monitoring",
      title: "Continuous Monitoring",
      description:
        "Ongoing surveillance of approved protocols and transactions",
      status: "pending",
      progress: 0,
      duration: "Ongoing",
      automation: "Fully Automated",
      icon: Eye,
      details: [
        "Real-time monitoring dashboard",
        "Threshold-based alerts",
        "Behavioral pattern analysis",
        "Performance metric tracking",
      ],
      riskLevel: "low",
    },
  ];

  const mockInstitutions = [
    {
      id: "inst_001",
      name: "JPMorgan Chase & Co.",
      type: "Investment Bank",
      currentProcess: "Protocol Security Analysis",
      compliance: 94.2,
    },
    {
      id: "inst_002",
      name: "Goldman Sachs Group",
      type: "Investment Bank",
      currentProcess: "AML/KYC Compliance Check",
      compliance: 87.6,
    },
    {
      id: "inst_003",
      name: "Bank of America Corp",
      type: "Commercial Bank",
      currentProcess: "Continuous Monitoring",
      compliance: 96.8,
    },
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

  const currentStep = workflowSteps.find((step) => step.status === "active");
  const completedSteps = workflowSteps.filter(
    (step) => step.status === "completed"
  ).length;
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
                {
                  mockInstitutions.find((i) => i.id === selectedInstitution)
                    ?.name
                }
              </CardTitle>
              <CardDescription>
                {
                  mockInstitutions.find((i) => i.id === selectedInstitution)
                    ?.type
                }{" "}
                • Currently:{" "}
                {
                  mockInstitutions.find((i) => i.id === selectedInstitution)
                    ?.currentProcess
                }
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-blue-600">
                {
                  mockInstitutions.find((i) => i.id === selectedInstitution)
                    ?.compliance
                }
                %
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
                <span>
                  Currently processing: <strong>{currentStep.title}</strong>
                </span>
                <span className="text-gray-500">
                  • ETA: {currentStep.duration}
                </span>
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
                        step.status === "completed"
                          ? "bg-green-300"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {step.title}
                        </h3>

                        {step.riskLevel && (
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getRiskColor(
                                step.riskLevel
                              )}`}
                            />
                            <span className="text-xs text-gray-600 uppercase font-medium">
                              {step.riskLevel} risk
                            </span>
                          </div>
                        )}

                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            step.status
                          )} border font-medium`}
                        >
                          {getStatusIcon(step.status)}
                          <span className="ml-1 capitalize">{step.status}</span>
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <div className="font-semibold text-gray-900">
                        {step.duration}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.automation}
                      </div>
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
                          step.status === "active"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
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
            <CardTitle className="text-sm font-medium">
              Average Processing Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">12.7s</div>
            <p className="text-xs text-gray-600">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Automation Rate
            </CardTitle>
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
