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
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  Building2,
  Globe,
  Activity,
  Zap,
  Bell,
  FileText,
  ArrowRight,
  Sparkles,
  Timer,
} from "lucide-react";

interface ComplianceProcess {
  id: string;
  institutionName: string;
  processType: string;
  region: string;
  currentStage: string;
  status: "monitoring" | "flagged" | "violation" | "resolved" | "investigating";
  progress: number;
  timeRemaining: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  automated: boolean;
  lastUpdate: string;
  nextAction: string;
  protocolsMonitored: number;
  transactionsAnalyzed: number;
  complianceScore: number;
}

const mockProcesses: ComplianceProcess[] = [
  {
    id: "comp_001",
    institutionName: "JPMorgan Chase & Co.",
    processType: "Real-time Protocol Monitoring",
    region: "US/SEC",
    currentStage: "Active Surveillance",
    status: "monitoring",
    progress: 98,
    timeRemaining: "Continuous",
    riskLevel: "low",
    automated: true,
    lastUpdate: "2 minutes ago",
    nextAction: "Continue real-time monitoring",
    protocolsMonitored: 15,
    transactionsAnalyzed: 2847,
    complianceScore: 94.5,
  },
  {
    id: "comp_002",
    institutionName: "Goldman Sachs Group Inc.",
    processType: "AML Compliance Review",
    region: "US/CFTC",
    currentStage: "Transaction Investigation",
    status: "flagged",
    progress: 65,
    timeRemaining: "18h 30m",
    riskLevel: "high",
    automated: false,
    lastUpdate: "12 minutes ago",
    nextAction: "Manual review of flagged transactions",
    protocolsMonitored: 8,
    transactionsAnalyzed: 156,
    complianceScore: 76.2,
  },
  {
    id: "comp_003",
    institutionName: "Bank of America Corp.",
    processType: "Protocol Security Assessment",
    region: "US/OCC",
    currentStage: "Smart Contract Audit",
    status: "investigating",
    progress: 45,
    timeRemaining: "2d 14h",
    riskLevel: "medium",
    automated: true,
    lastUpdate: "1 hour ago",
    nextAction: "Await security audit results",
    protocolsMonitored: 12,
    transactionsAnalyzed: 934,
    complianceScore: 87.8,
  },
  {
    id: "comp_004",
    institutionName: "Wells Fargo & Company",
    processType: "Regulatory Violation Response",
    region: "US/FINRA",
    currentStage: "Emergency Protocol",
    status: "violation",
    progress: 100,
    timeRemaining: "IMMEDIATE",
    riskLevel: "critical",
    automated: false,
    lastUpdate: "3 minutes ago",
    nextAction: "Executive escalation required",
    protocolsMonitored: 3,
    transactionsAnalyzed: 45,
    complianceScore: 32.1,
  },
  {
    id: "comp_005",
    institutionName: "Citigroup Inc.",
    processType: "Cross-Border Compliance Check",
    region: "EU/MiCA",
    currentStage: "Multi-Jurisdictional Review",
    status: "monitoring",
    progress: 82,
    timeRemaining: "4h 15m",
    riskLevel: "medium",
    automated: true,
    lastUpdate: "25 minutes ago",
    nextAction: "Coordinate with EU regulators",
    protocolsMonitored: 9,
    transactionsAnalyzed: 1203,
    complianceScore: 91.3,
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    "Active Surveillance": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg",
    "Transaction Investigation": "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
    "Smart Contract Audit": "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg",
    "Emergency Protocol": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse",
    "Multi-Jurisdictional Review": "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg",
    "Compliance Assessment": "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",
  };
  return colors[stage] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "monitoring":
      return <Eye className="h-5 w-5 text-blue-500" />;
    case "flagged":
      return <AlertTriangle className="h-5 w-5 text-amber-500 animate-bounce" />;
    case "violation":
      return <Bell className="h-5 w-5 text-red-500 animate-ping" />;
    case "investigating":
      return <Activity className="h-5 w-5 text-purple-500 animate-spin" />;
    case "resolved":
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getRiskBadge = (riskLevel: string) => {
  const styles = {
    low: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-300 shadow-sm",
    medium: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300 shadow-sm",
    high: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300 shadow-sm animate-pulse",
    critical: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-lg animate-pulse",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${styles[riskLevel as keyof typeof styles]} font-semibold px-3 py-1 text-xs uppercase tracking-wider`}
    >
      <Shield className="h-3 w-3 mr-1" />
      {riskLevel} RISK
    </Badge>
  );
};

export function LiveProcesses() {
  const [filter, setFilter] = useState<"all" | "critical" | "active" | "violations">("all");
  const [processes, setProcesses] = useState<ComplianceProcess[]>(mockProcesses);

  const filteredProcesses = processes.filter((process) => {
    switch (filter) {
      case "critical":
        return process.riskLevel === "critical" || process.status === "violation";
      case "active":
        return process.status === "monitoring" || process.status === "investigating";
      case "violations":
        return process.status === "violation" || process.status === "flagged";
      default:
        return true;
    }
  });

  const criticalCount = processes.filter(p => p.riskLevel === "critical" || p.status === "violation").length;
  const activeCount = processes.filter(p => p.status === "monitoring" || p.status === "investigating").length;
  const violationCount = processes.filter(p => p.status === "violation" || p.status === "flagged").length;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Activity className="h-8 w-8" />
              </div>
              Live Compliance Processes
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              Real-time monitoring of institutional DeFi compliance activities
            </p>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="font-semibold">Live Updates</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="lg"
            className={`${filter === "all" 
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg" 
              : "hover:bg-gray-50"
            } font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
            onClick={() => setFilter("all")}
          >
            <Globe className="h-5 w-5 mr-2" />
            All Processes
            <Badge variant="secondary" className="ml-3 bg-white/30 text-current border-0">
              {processes.length}
            </Badge>
          </Button>
          
          <Button
            variant={filter === "critical" ? "destructive" : "outline"}
            size="lg"
            className={`${filter === "critical" 
              ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg" 
              : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            } font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
            onClick={() => setFilter("critical")}
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Critical Issues
            <Badge variant="secondary" className={`ml-3 ${filter === "critical" ? "bg-white/30" : "bg-red-100"} text-current border-0`}>
              {criticalCount}
            </Badge>
          </Button>

          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="lg"
            className={`${filter === "active" 
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg" 
              : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
            } font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
            onClick={() => setFilter("active")}
          >
            <Activity className="h-5 w-5 mr-2" />
            Active Monitoring
            <Badge variant="secondary" className={`ml-3 ${filter === "active" ? "bg-white/30" : "bg-emerald-100"} text-current border-0`}>
              {activeCount}
            </Badge>
          </Button>

          <Button
            variant={filter === "violations" ? "destructive" : "outline"}
            size="lg"
            className={`${filter === "violations" 
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg" 
              : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
            } font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
            onClick={() => setFilter("violations")}
          >
            <Bell className="h-5 w-5 mr-2" />
            Violations
            <Badge variant="secondary" className={`ml-3 ${filter === "violations" ? "bg-white/30" : "bg-orange-100"} text-current border-0`}>
              {violationCount}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Process Cards */}
      <div className="grid gap-6">
        {filteredProcesses.map((process) => (
          <Card key={process.id} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            {/* Status indicator bar */}
            <div className={`h-2 ${
              process.status === "violation" ? "bg-gradient-to-r from-red-500 to-pink-500" :
              process.status === "flagged" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
              process.status === "investigating" ? "bg-gradient-to-r from-purple-500 to-indigo-500" :
              "bg-gradient-to-r from-blue-500 to-cyan-500"
            }`}></div>

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      {getStatusIcon(process.status)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                        {process.institutionName}
                      </CardTitle>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        {process.automated && (
                          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 font-semibold px-3 py-1">
                            <Zap className="h-4 w-4 mr-1" />
                            AI Automated
                          </Badge>
                        )}
                        
                        <Badge 
                          className={`${getStageColor(process.currentStage)} font-semibold px-4 py-2 text-sm`}
                        >
                          {process.currentStage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-600">
                    <span className="flex items-center gap-2 font-medium">
                      <FileText className="h-5 w-5 text-blue-500" />
                      {process.processType}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <Globe className="h-5 w-5 text-indigo-500" />
                      {process.region}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {getRiskBadge(process.riskLevel)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Metrics - Enhanced Visual Design */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {process.protocolsMonitored}
                  </div>
                  <div className="text-sm font-medium text-blue-700">Protocols Monitored</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {process.transactionsAnalyzed.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-emerald-700">Transactions Analyzed</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {process.complianceScore}%
                  </div>
                  <div className="text-sm font-medium text-purple-700">Compliance Score</div>
                </div>
              </div>

              {/* Progress Section - Enhanced */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    Process Status
                  </span>
                  <span className={`text-lg font-bold px-4 py-2 rounded-full ${
                    process.status === "violation" ? "bg-red-100 text-red-700" :
                    process.status === "flagged" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {process.timeRemaining}
                  </span>
                </div>
                
                <Progress 
                  value={process.progress} 
                  className={`h-4 ${
                    process.status === "violation" ? "bg-red-200" :
                    process.status === "flagged" ? "bg-amber-200" :
                    "bg-blue-200"
                  }`}
                />
                <div className="text-right mt-2 text-sm font-medium text-gray-600">
                  {process.progress}% Complete
                </div>
              </div>

              {/* Next Action & Controls - Enhanced */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <ArrowRight className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Next Action</div>
                      <div className="text-lg font-semibold text-gray-900">{process.nextAction}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {process.status === "violation" && (
                      <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                        <Bell className="h-4 w-4 mr-2" />
                        Escalate Now
                      </Button>
                    )}
                    
                    {process.status === "flagged" && (
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                        <Eye className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                    )}

                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Timestamp - Enhanced */}
              <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated: <strong>{process.lastUpdate}</strong>
                </span>
                <span className="font-mono bg-white px-3 py-1 rounded-lg border">
                  ID: {process.id}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProcesses.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No compliance processes found
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {filter === "critical" 
                ? "Excellent! No critical issues detected. All processes are operating within acceptable risk parameters."
                : "Try adjusting your filters to see more compliance processes."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    institutionName: "Wells Fargo & Company",
    processType: "Regulatory Violation Response",
    region: "US/FINRA",
    currentStage: "Emergency Protocol",
    status: "violation",
    progress: 100,
    timeRemaining: "IMMEDIATE",
    riskLevel: "critical",
    automated: false,
    lastUpdate: "3 minutes ago",
    nextAction: "Executive escalation required",
    protocolsMonitored: 3,
    transactionsAnalyzed: 45,
    complianceScore: 32.1,
  },
  {
    id: "comp_005",
    institutionName: "Citigroup Inc.",
    processType: "Cross-Border Compliance Check",
    region: "EU/MiCA",
    currentStage: "Multi-Jurisdictional Review",
    status: "monitoring",
    progress: 82,
    timeRemaining: "4h 15m",
    riskLevel: "medium",
    automated: true,
    lastUpdate: "25 minutes ago",
    nextAction: "Coordinate with EU regulators",
    protocolsMonitored: 9,
    transactionsAnalyzed: 1203,
    complianceScore: 91.3,
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    "Active Surveillance": "bg-blue-100 text-blue-800 border-blue-200",
    "Transaction Investigation":
      "bg-orange-100 text-orange-800 border-orange-200",
    "Smart Contract Audit": "bg-purple-100 text-purple-800 border-purple-200",
    "Emergency Protocol": "bg-red-100 text-red-800 border-red-200",
    "Multi-Jurisdictional Review":
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Compliance Assessment": "bg-green-100 text-green-800 border-green-200",
  };
  return colors[stage] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "monitoring":
      return <Eye className="h-4 w-4 text-blue-600" />;
    case "flagged":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "violation":
      return <Bell className="h-4 w-4 text-red-600" />;
    case "investigating":
      return <Activity className="h-4 w-4 text-purple-600" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getRiskBadge = (riskLevel: string) => {
  const styles = {
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    critical: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Badge
      variant="outline"
      className={`${styles[riskLevel as keyof typeof styles]} font-medium`}
    >
      <Shield className="h-3 w-3 mr-1" />
      {riskLevel.toUpperCase()} RISK
    </Badge>
  );
};

export function LiveProcesses() {
  const [filter, setFilter] = useState<
    "all" | "critical" | "active" | "violations"
  >("all");
  const [processes, setProcesses] =
    useState<ComplianceProcess[]>(mockProcesses);

  const filteredProcesses = processes.filter((process) => {
    switch (filter) {
      case "critical":
        return (
          process.riskLevel === "critical" || process.status === "violation"
        );
      case "active":
        return (
          process.status === "monitoring" || process.status === "investigating"
        );
      case "violations":
        return process.status === "violation" || process.status === "flagged";
      default:
        return true;
    }
  });

  const criticalCount = processes.filter(
    (p) => p.riskLevel === "critical" || p.status === "violation"
  ).length;
  const activeCount = processes.filter(
    (p) => p.status === "monitoring" || p.status === "investigating"
  ).length;
  const violationCount = processes.filter(
    (p) => p.status === "violation" || p.status === "flagged"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Live Compliance Processes
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time monitoring of institutional DeFi compliance activities
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Live Updates</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="font-medium"
            onClick={() => setFilter("all")}
          >
            All Processes
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {processes.length}
            </Badge>
          </Button>
          <Button
            variant={filter === "critical" ? "destructive" : "outline"}
            size="sm"
            className="font-medium"
            onClick={() => setFilter("critical")}
          >
            Critical Issues
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {criticalCount}
            </Badge>
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            className="font-medium"
            onClick={() => setFilter("active")}
          >
            Active Monitoring
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {activeCount}
            </Badge>
          </Button>
          <Button
            variant={filter === "violations" ? "destructive" : "outline"}
            size="sm"
            className="font-medium"
            onClick={() => setFilter("violations")}
          >
            Violations
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {violationCount}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Process Cards */}
      <div className="grid gap-4">
        {filteredProcesses.map((process) => (
          <Card
            key={process.id}
            className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(process.status)}
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {process.institutionName}
                      </CardTitle>
                    </div>
                    {process.automated && (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Automated
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {process.processType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {process.region}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getRiskBadge(process.riskLevel)}
                  <Badge
                    variant="outline"
                    className={`${getStageColor(
                      process.currentStage
                    )} border font-medium`}
                  >
                    {process.currentStage}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {process.protocolsMonitored}
                  </div>
                  <div className="text-xs text-gray-600">
                    Protocols Monitored
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {process.transactionsAnalyzed.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Transactions Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {process.complianceScore}%
                  </div>
                  <div className="text-xs text-gray-600">Compliance Score</div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Process Status
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      process.status === "violation"
                        ? "text-red-600"
                        : process.status === "flagged"
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    {process.timeRemaining}
                  </span>
                </div>

                <Progress
                  value={process.progress}
                  className={`h-3 ${
                    process.status === "violation"
                      ? "bg-red-100"
                      : process.status === "flagged"
                      ? "bg-orange-100"
                      : "bg-blue-100"
                  }`}
                />
              </div>

              {/* Next Action & Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4" />
                  <span className="font-medium">{process.nextAction}</span>
                </div>

                <div className="flex gap-2">
                  {process.status === "violation" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="font-medium"
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                  )}

                  {process.status === "flagged" && (
                    <Button size="sm" variant="outline" className="font-medium">
                      <Eye className="h-4 w-4 mr-1" />
                      Investigate
                    </Button>
                  )}

                  <Button size="sm" variant="outline" className="font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Last updated: {process.lastUpdate} • Process ID: {process.id}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProcesses.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No compliance processes found
            </h3>
            <p className="text-gray-600">
              {filter === "critical"
                ? "No critical issues detected. All processes are operating within acceptable risk parameters."
                : "Try adjusting your filters to see more compliance processes."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
