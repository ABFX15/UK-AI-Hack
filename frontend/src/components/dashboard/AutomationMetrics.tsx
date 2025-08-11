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
  Zap,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  Bot,
  Target,
  Sparkles,
  Activity,
  BarChart3,
  Users,
  Timer,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type:
    | "compliance_monitoring"
    | "risk_assessment"
    | "regulatory_reporting"
    | "violation_detection"
    | "protocol_analysis";
  enabled: boolean;
  successRate: number;
  timeSaved: number;
  triggerCount: number;
}

const automationRules: AutomationRule[] = [
  {
    id: "compliance_monitoring",
    name: "Real-time Compliance Monitoring",
    description:
      "AI continuously monitors DeFi transactions for regulatory violations",
    type: "compliance_monitoring",
    enabled: true,
    successRate: 98.7,
    timeSaved: 45.2,
    triggerCount: 15420,
  },
  {
    id: "risk_assessment",
    name: "Automated Protocol Risk Assessment",
    description:
      "AI analyzes smart contracts and audits for security vulnerabilities",
    type: "risk_assessment",
    enabled: true,
    successRate: 94.3,
    timeSaved: 72.5,
    triggerCount: 89,
  },
  {
    id: "violation_detection",
    name: "AML/KYC Violation Detection",
    description:
      "Machine learning detects suspicious transaction patterns instantly",
    type: "violation_detection",
    enabled: true,
    successRate: 99.1,
    timeSaved: 12.8,
    triggerCount: 234,
  },
  {
    id: "regulatory_reporting",
    name: "Automated Regulatory Reporting",
    description:
      "Generates compliance reports for regulatory bodies automatically",
    type: "regulatory_reporting",
    enabled: true,
    successRate: 100,
    timeSaved: 156.0,
    triggerCount: 23,
  },
  {
    id: "protocol_analysis",
    name: "DeFi Protocol Analysis",
    description:
      "Analyzes new DeFi protocols for institutional compliance approval",
    type: "protocol_analysis",
    enabled: true,
    successRate: 92.4,
    timeSaved: 24.8,
    triggerCount: 12,
  },
];

const performanceData = [
  { week: "W1", automation: 87, manual: 13, efficiency: 94 },
  { week: "W2", automation: 91, manual: 9, efficiency: 96 },
  { week: "W3", automation: 94, manual: 6, efficiency: 97 },
  { week: "W4", automation: 96, manual: 4, efficiency: 98 },
];

const timeSavingsData = [
  { name: "Compliance Monitoring", value: 45, color: "#8b5cf6" },
  { name: "Risk Assessment", value: 25, color: "#10b981" },
  { name: "Regulatory Reporting", value: 20, color: "#f59e0b" },
  { name: "Protocol Analysis", value: 10, color: "#ef4444" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const processStageAutomation = [
  { stage: "Application", automated: 95, manual: 5 },
  { stage: "Screening", automated: 89, manual: 11 },
  { stage: "Interview Scheduling", automated: 85, manual: 15 },
  { stage: "Feedback Collection", automated: 78, manual: 22 },
  { stage: "Offer Process", automated: 65, manual: 35 },
  { stage: "Onboarding", automated: 45, manual: 55 },
];

export function AutomationMetrics() {
  const [automationRate, setAutomationRate] = useState(78.3);
  const [totalTimeSaved, setTotalTimeSaved] = useState(156.8);
  const [processesAutomated, setProcessesAutomated] = useState(1247);
  const [efficiency, setEfficiency] = useState(89.2);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance_monitoring":
        return <Activity className="h-4 w-4" />;
      case "risk_assessment":
        return <Target className="h-4 w-4" />;
      case "regulatory_reporting":
        return <BarChart3 className="h-4 w-4" />;
      case "violation_detection":
        return <TrendingUp className="h-4 w-4" />;
      case "protocol_analysis":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "compliance_monitoring":
        return "bg-blue-100 text-blue-700";
      case "risk_assessment":
        return "bg-green-100 text-green-700";
      case "regulatory_reporting":
        return "bg-yellow-100 text-yellow-700";
      case "violation_detection":
        return "bg-red-100 text-red-700";
      case "protocol_analysis":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleAutomation = async (ruleId: string) => {
    // Simulate API call to toggle automation rule
    console.log(`Toggling automation rule: ${ruleId}`);
    // You would call your automation API here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Compliance Automation Metrics
          </h2>
          <p className="text-gray-600">
            Performance and efficiency of automated regulatory compliance
            processes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Bot className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Automation Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {automationRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalTimeSaved}h
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processes Automated
            </CardTitle>
            <Bot className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processesAutomated}
            </div>
            <p className="text-xs text-muted-foreground">Total this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efficiency Score
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {efficiency}%
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Configure and monitor automated processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${getTypeColor(rule.type)}`}>
                    {getTypeIcon(rule.type)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge
                        variant={rule.enabled ? "default" : "secondary"}
                        className={
                          rule.enabled ? "bg-green-100 text-green-700" : ""
                        }
                      >
                        {rule.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600">{rule.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Success Rate: {rule.successRate}%</span>
                      <span>Time Saved: {rule.timeSaved}h/process</span>
                      <span>Triggers: {rule.triggerCount}</span>
                    </div>

                    <div className="space-y-1">
                      <Progress value={rule.successRate} className="h-2" />
                    </div>
                  </div>
                </div>

                <Button
                  variant={rule.enabled ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleAutomation(rule.id)}
                >
                  {rule.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Automation Performance Trends</CardTitle>
            <CardDescription>
              Weekly automation vs manual processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="automation"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Automation %"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Efficiency Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Savings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Time Savings Distribution</CardTitle>
            <CardDescription>
              Where automation saves the most time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeSavingsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {timeSavingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Process Stage Automation */}
      <Card>
        <CardHeader>
          <CardTitle>Automation by Process Stage</CardTitle>
          <CardDescription>
            Percentage of automated vs manual compliance tasks across regulatory
            processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processStageAutomation} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="stage" type="category" width={120} />
              <Tooltip />
              <Bar
                dataKey="automated"
                stackId="a"
                fill="#10b981"
                name="Automated"
              />
              <Bar dataKey="manual" stackId="a" fill="#ef4444" name="Manual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Suggestions to improve automation efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                priority: "high",
                title: "Enable Automatic Escalation",
                description:
                  "Currently disabled but could save 12h/week in manual escalations",
                impact: "+8% efficiency",
              },
              {
                priority: "medium",
                title: "Optimize Interview Scheduling",
                description:
                  "AI suggests improving calendar integration for 94.7% → 98%+ success rate",
                impact: "+2.1% time saved",
              },
              {
                priority: "low",
                title: "Expand Onboarding Automation",
                description:
                  "Only 45% automated - opportunity to reduce manual work",
                impact: "+15% coverage",
              },
            ].map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    recommendation.priority === "high"
                      ? "bg-red-500"
                      : recommendation.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {recommendation.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {recommendation.description}
                  </p>
                </div>

                <Button size="sm" variant="outline">
                  Implement
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
