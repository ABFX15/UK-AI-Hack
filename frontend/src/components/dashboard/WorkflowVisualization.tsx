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
  Users,
  Bot,
  Search,
  MessageSquare,
  Calendar,
  Target,
  Shield,
  Zap,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "pending" | "blocked";
  progress: number;
  duration: string;
  automation: string;
  icon: any;
  details: string[];
}

export const WorkflowVisualization = () => {
  const [selectedJob, setSelectedJob] = useState("job_001");
  const [isPlaying, setIsPlaying] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: "job_creation",
      title: "Job Posted & AI Optimized",
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
