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
  Timer,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface SLAData {
  type: string;
  description: string;
  timeLimit: string;
  activeCount: number;
  metCount: number;
  violatedCount: number;
  performanceRate: number;
  trend: "up" | "down" | "stable";
  penaltyApplied?: number;
}

const slaTypes: SLAData[] = [
  {
    type: "response_time",
    description: "Initial Response",
    timeLimit: "24h",
    activeCount: 23,
    metCount: 156,
    violatedCount: 8,
    performanceRate: 95.1,
    trend: "up",
  },
  {
    type: "interview_scheduling",
    description: "Interview Scheduling",
    timeLimit: "72h",
    activeCount: 18,
    metCount: 89,
    violatedCount: 12,
    performanceRate: 88.1,
    trend: "down",
    penaltyApplied: 5,
  },
  {
    type: "feedback_delivery",
    description: "Post-Interview Feedback",
    timeLimit: "48h",
    activeCount: 12,
    metCount: 67,
    violatedCount: 6,
    performanceRate: 91.8,
    trend: "stable",
  },
  {
    type: "offer_decision",
    description: "Offer Decision",
    timeLimit: "120h",
    activeCount: 8,
    metCount: 34,
    violatedCount: 3,
    performanceRate: 91.9,
    trend: "up",
  },
];

const performanceData = [
  {
    week: "Week 1",
    responseTime: 96,
    interviewing: 89,
    feedback: 92,
    offers: 94,
  },
  {
    week: "Week 2",
    responseTime: 94,
    interviewing: 87,
    feedback: 90,
    offers: 91,
  },
  {
    week: "Week 3",
    responseTime: 97,
    interviewing: 85,
    feedback: 93,
    offers: 89,
  },
  {
    week: "Week 4",
    responseTime: 95,
    interviewing: 88,
    feedback: 92,
    offers: 92,
  },
];

const violationData = [
  { company: "TechCorp", violations: 8, penalty: 40 },
  { company: "StartupXYZ", violations: 5, penalty: 25 },
  { company: "BigTech Inc", violations: 3, penalty: 15 },
  { company: "CryptoDAO", violations: 2, penalty: 10 },
];

export function SLAMonitor() {
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">(
    "7d"
  );
  const [autoEnforcement, setAutoEnforcement] = useState(true);

  const totalViolations = slaTypes.reduce(
    (sum, sla) => sum + sla.violatedCount,
    0
  );
  const totalPenalties = violationData.reduce(
    (sum, item) => sum + item.penalty,
    0
  );
  const averagePerformance =
    slaTypes.reduce((sum, sla) => sum + sla.performanceRate, 0) /
    slaTypes.length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Timer className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SLA Monitoring</h2>
          <p className="text-gray-600">
            Real-time tracking of anti-ghosting enforcement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield
              className={`h-5 w-5 ${
                autoEnforcement ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span className="text-sm font-medium">
              Auto-Enforcement: {autoEnforcement ? "ON" : "OFF"}
            </span>
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["24h", "7d", "30d"] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Performance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {averagePerformance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">SLA compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active SLAs</CardTitle>
            <Timer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {slaTypes.reduce((sum, sla) => sum + sla.activeCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalViolations}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Penalties Applied
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalPenalties}
            </div>
            <p className="text-xs text-muted-foreground">
              Reputation points deducted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SLA Types Performance */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Performance by Type</CardTitle>
          <CardDescription>
            Performance metrics for different hiring stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {slaTypes.map((sla) => (
              <div
                key={sla.type}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{sla.description}</h4>
                    <Badge variant="outline">{sla.timeLimit} limit</Badge>
                    {getTrendIcon(sla.trend)}
                    {sla.penaltyApplied && (
                      <Badge variant="destructive" className="text-xs">
                        -{sla.penaltyApplied} reputation
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Active: {sla.activeCount}</span>
                    <span>Met: {sla.metCount}</span>
                    <span>Violated: {sla.violatedCount}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Performance Rate</span>
                      <span
                        className={`font-medium ${getPerformanceColor(
                          sla.performanceRate
                        )}`}
                      >
                        {sla.performanceRate}%
                      </span>
                    </div>
                    <Progress
                      value={sla.performanceRate}
                      className={`h-2 ${
                        sla.performanceRate >= 95
                          ? "bg-green-100"
                          : sla.performanceRate >= 85
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>SLA compliance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Response Time"
                />
                <Line
                  type="monotone"
                  dataKey="interviewing"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Interviewing"
                />
                <Line
                  type="monotone"
                  dataKey="feedback"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Feedback"
                />
                <Line
                  type="monotone"
                  dataKey="offers"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Offers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violations by Company</CardTitle>
            <CardDescription>
              Companies with the most SLA violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={violationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="company" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="violations" fill="#ef4444" name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Recent SLA Violations
          </CardTitle>
          <CardDescription>
            Automatic penalties applied for ghosting violations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                company: "TechCorp",
                violation: "Interview Scheduling",
                candidate: "Sarah Johnson",
                overdue: "6 hours",
                penalty: "10 reputation points",
                timestamp: "2 hours ago",
              },
              {
                company: "StartupXYZ",
                violation: "Feedback Delivery",
                candidate: "Mike Chen",
                overdue: "18 hours",
                penalty: "15 reputation points",
                timestamp: "5 hours ago",
              },
              {
                company: "BigTech Inc",
                violation: "Initial Response",
                candidate: "Emma Davis",
                overdue: "12 hours",
                penalty: "5 reputation points",
                timestamp: "1 day ago",
              },
            ].map((violation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-900">
                      {violation.company}
                    </span>
                    <Badge variant="destructive">{violation.violation}</Badge>
                  </div>
                  <p className="text-sm text-red-700">
                    {violation.candidate} • Overdue by {violation.overdue}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium text-red-900">
                    -{violation.penalty}
                  </div>
                  <div className="text-red-600">{violation.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
