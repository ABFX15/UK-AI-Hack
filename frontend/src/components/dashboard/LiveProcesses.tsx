"use client";

import { useState, useEffect } from "react";
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
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

interface HiringProcess {
  id: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  currentStage: string;
  status: "in_progress" | "blocked" | "overdue" | "completed";
  progress: number;
  timeRemaining: string;
  slaStatus: "green" | "yellow" | "red";
  automated: boolean;
  lastUpdate: string;
  nextAction: string;
}

const mockProcesses: HiringProcess[] = [
  {
    id: "proc_001",
    candidateName: "Alex Chen",
    jobTitle: "Senior Solana Developer",
    companyName: "DeFi Protocol Inc",
    currentStage: "technical_interview",
    status: "in_progress",
    progress: 65,
    timeRemaining: "18h",
    slaStatus: "green",
    automated: true,
    lastUpdate: "2 hours ago",
    nextAction: "Schedule final interview",
  },
  {
    id: "proc_002",
    candidateName: "Sarah Johnson",
    jobTitle: "Web3 Frontend Engineer",
    companyName: "NFT Marketplace",
    currentStage: "hr_review",
    status: "overdue",
    progress: 40,
    timeRemaining: "Overdue by 6h",
    slaStatus: "red",
    automated: false,
    lastUpdate: "8 hours ago",
    nextAction: "Escalate to manager",
  },
  {
    id: "proc_003",
    candidateName: "Michael Kim",
    jobTitle: "Smart Contract Auditor",
    companyName: "Security Solutions",
    currentStage: "offer_negotiation",
    status: "in_progress",
    progress: 85,
    timeRemaining: "2d 4h",
    slaStatus: "yellow",
    automated: true,
    lastUpdate: "30 minutes ago",
    nextAction: "Await candidate response",
  },
  {
    id: "proc_004",
    candidateName: "Emma Davis",
    jobTitle: "DeFi Product Manager",
    companyName: "Yield Farm DAO",
    currentStage: "reference_check",
    status: "blocked",
    progress: 75,
    timeRemaining: "Blocked",
    slaStatus: "red",
    automated: false,
    lastUpdate: "1 day ago",
    nextAction: "Contact references",
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    application_submitted: "bg-blue-100 text-blue-800",
    initial_screening: "bg-purple-100 text-purple-800",
    hr_review: "bg-orange-100 text-orange-800",
    technical_interview: "bg-green-100 text-green-800",
    final_interview: "bg-indigo-100 text-indigo-800",
    reference_check: "bg-yellow-100 text-yellow-800",
    offer_negotiation: "bg-pink-100 text-pink-800",
    completed: "bg-emerald-100 text-emerald-800",
  };
  return colors[stage] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in_progress":
      return <PlayCircle className="h-4 w-4 text-blue-600" />;
    case "blocked":
      return <PauseCircle className="h-4 w-4 text-red-600" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getSLAIndicator = (slaStatus: string) => {
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        colors[slaStatus as keyof typeof colors]
      }`}
    />
  );
};

export function LiveProcesses() {
  const [processes, setProcesses] = useState<HiringProcess[]>(mockProcesses);
  const [filter, setFilter] = useState<"all" | "overdue" | "automated">("all");

  const filteredProcesses = processes.filter((process) => {
    switch (filter) {
      case "overdue":
        return process.status === "overdue" || process.slaStatus === "red";
      case "automated":
        return process.automated;
      default:
        return true;
    }
  });

  const handleAdvanceProcess = async (processId: string) => {
    // Simulate API call to advance process
    console.log(`Advancing process ${processId}`);
    // You would call your automation API here
    // await automationService.advanceProcess(processId, newStage, actor);
  };

  const handleResolveBlocker = async (processId: string) => {
    // Simulate API call to resolve blocker
    console.log(`Resolving blocker for process ${processId}`);
    // You would call your automation API here
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Processes ({processes.length})
          </Button>
          <Button
            variant={filter === "overdue" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("overdue")}
          >
            Needs Attention (
            {
              processes.filter(
                (p) => p.status === "overdue" || p.slaStatus === "red"
              ).length
            }
            )
          </Button>
          <Button
            variant={filter === "automated" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("automated")}
          >
            Automated ({processes.filter((p) => p.automated).length})
          </Button>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Updates
        </div>
      </div>

      {/* Process List */}
      <div className="grid gap-4">
        {filteredProcesses.map((process) => (
          <Card key={process.id} className="relative overflow-hidden">
            {/* SLA Status Indicator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-200 to-gray-300">
              <div
                className={`w-full transition-all duration-300 ${
                  process.slaStatus === "green"
                    ? "bg-green-500"
                    : process.slaStatus === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ height: `${process.progress}%` }}
              />
            </div>

            <CardHeader className="pb-3 pl-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {process.candidateName}
                    </CardTitle>
                    {process.automated && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                    {getSLAIndicator(process.slaStatus)}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {process.companyName}
                    </span>
                    <span>{process.jobTitle}</span>
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(process.status)}
                  <Badge className={getStageColor(process.currentStage)}>
                    {process.currentStage.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pl-6 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span
                    className={`font-medium ${
                      process.status === "overdue"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {process.timeRemaining}
                  </span>
                </div>
                <Progress
                  value={process.progress}
                  className={`h-2 ${
                    process.slaStatus === "red"
                      ? "bg-red-100"
                      : process.slaStatus === "yellow"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                />
              </div>

              {/* Next Action & Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4" />
                  <span>{process.nextAction}</span>
                </div>

                <div className="flex gap-2">
                  {process.status === "blocked" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveBlocker(process.id)}
                    >
                      Resolve Blocker
                    </Button>
                  )}

                  {process.status === "in_progress" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceProcess(process.id)}
                    >
                      Advance Stage
                    </Button>
                  )}

                  {process.status === "overdue" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAdvanceProcess(process.id)}
                    >
                      Escalate
                    </Button>
                  )}
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-gray-500 border-t pt-2">
                Last updated: {process.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProcesses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "overdue"
                ? "No overdue processes!"
                : "No processes found"}
            </h3>
            <p className="text-gray-600">
              {filter === "overdue"
                ? "All processes are meeting their SLA requirements."
                : "Try adjusting your filters to see more results."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
