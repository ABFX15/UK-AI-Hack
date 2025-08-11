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
  Building2,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  Zap,
  Shield,
  Activity,
} from "lucide-react";

interface ComplianceProcess {
  id: string;
  institutionName: string;
  processType: string;
  region: string;
  currentStage: string;
  status: "monitoring" | "flagged" | "violation" | "resolved";
  progress: number;
  timeRemaining: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  automated: boolean;
  lastUpdate: string;
  nextAction: string;
}

const mockProcesses: ComplianceProcess[] = [
  {
    id: "comp_001",
    institutionName: "JPMorgan Chase",
    processType: "DeFi Transaction Monitoring",
    region: "US_SEC",
    currentStage: "real_time_analysis",
    status: "monitoring",
    progress: 98,
    timeRemaining: "Continuous",
    riskLevel: "low",
    automated: true,
    lastUpdate: "2 minutes ago",
    nextAction: "Continue monitoring",
  },
  {
    id: "comp_002",
    institutionName: "Goldman Sachs",
    processType: "AML Transaction Review",
    region: "US_SEC",
    currentStage: "investigation_required",
    status: "flagged",
    progress: 45,
    timeRemaining: "24h",
    riskLevel: "high",
    automated: false,
    lastUpdate: "15 minutes ago",
    nextAction: "Manual review required",
  },
  {
    id: "comp_003",
    institutionName: "Bank of America",
    processType: "Protocol Risk Assessment",
    region: "US_SEC",
    currentStage: "security_audit",
    status: "monitoring",
    progress: 75,
    timeRemaining: "3d 12h",
    riskLevel: "medium",
    automated: true,
    lastUpdate: "1 hour ago",
    nextAction: "Await audit completion",
  },
  {
    id: "comp_004",
    institutionName: "Wells Fargo",
    processType: "Regulatory Reporting",
    region: "US_SEC",
    currentStage: "compliance_violation",
    status: "violation",
    progress: 100,
    timeRemaining: "Immediate",
    riskLevel: "critical",
    automated: false,
    lastUpdate: "5 minutes ago",
    nextAction: "Emergency response required",
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    real_time_analysis: "bg-blue-100 text-blue-800",
    transaction_monitoring: "bg-purple-100 text-purple-800",
    investigation_required: "bg-orange-100 text-orange-800",
    security_audit: "bg-green-100 text-green-800",
    regulatory_filing: "bg-indigo-100 text-indigo-800",
    compliance_review: "bg-yellow-100 text-yellow-800",
    compliance_violation: "bg-red-100 text-red-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };
  return colors[stage] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "monitoring":
      return <Activity className="h-4 w-4 text-blue-600" />;
    case "flagged":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "violation":
      return <PauseCircle className="h-4 w-4 text-red-600" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getRiskIndicator = (riskLevel: string) => {
  const colors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        colors[riskLevel as keyof typeof colors]
      }`}
    />
  );
};

export function ComplianceProcesses() {
  const [filter, setFilter] = useState<"all" | "automated" | "critical">("all");
  const [processes, setProcesses] =
    useState<ComplianceProcess[]>(mockProcesses);

  const filteredProcesses = processes.filter((process) => {
    switch (filter) {
      case "critical":
        return (
          process.riskLevel === "critical" || process.status === "violation"
        );
      case "automated":
        return process.automated;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Live Compliance Processes
          </h2>
          <p className="text-gray-600">
            Real-time monitoring of institutional DeFi compliance
          </p>
        </div>
      </div>

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
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical Issues (
            {
              processes.filter(
                (p) => p.riskLevel === "critical" || p.status === "violation"
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
      </div>

      {/* Process List */}
      <div className="grid gap-4">
        {filteredProcesses.map((process) => (
          <Card
            key={process.id}
            className={`border-l-4 transition-all duration-300 hover:shadow-md ${
              process.riskLevel === "critical"
                ? "border-l-red-500 bg-red-50"
                : process.riskLevel === "high"
                ? "border-l-orange-500 bg-orange-50"
                : process.riskLevel === "medium"
                ? "border-l-yellow-500 bg-yellow-50"
                : "border-l-green-500 bg-green-50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {process.institutionName}
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
                    {getRiskIndicator(process.riskLevel)}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {process.region}
                    </span>
                    <span>{process.processType}</span>
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

            <CardContent className="pt-0 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance Progress</span>
                  <span
                    className={`font-medium ${
                      process.status === "violation"
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
                    process.riskLevel === "critical"
                      ? "bg-red-100"
                      : process.riskLevel === "high"
                      ? "bg-orange-100"
                      : process.riskLevel === "medium"
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
                  {process.status === "violation" && (
                    <Button size="sm" variant="destructive">
                      Resolve Violation
                    </Button>
                  )}

                  {process.status === "monitoring" && (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}

                  {process.status === "flagged" && (
                    <Button size="sm" variant="secondary">
                      Investigate
                    </Button>
                  )}
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-gray-500">
                Last updated: {process.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProcesses.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No compliance processes match the current filter.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
