"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Timer,
  Brain,
  Zap,
  Target,
  Settings,
  Plug,
} from "lucide-react";
import {
  LiveProcesses,
  AutomationMetrics,
  IntegrationPanel,
  WorkflowVisualization,
} from "@/components/dashboard";

// Mock SLA and Smart Matching components focused on problem-solving
const SLAMonitor = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>🛡️ Anti-Ghosting SLA Enforcement</CardTitle>
        <CardDescription>
          Smart contracts automatically enforce response deadlines with real
          financial penalties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-green-700">Active SLAs</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-red-700">Violations Today</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0.5 ETH</div>
            <div className="text-sm text-blue-700">Penalties Collected</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Company Response SLA</span>
              <div className="text-sm text-gray-600">TechCorp → John Smith</div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">
              6h remaining
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Interview Feedback SLA</span>
              <div className="text-sm text-gray-600">Jane Doe → BlockStart</div>
            </div>
            <Badge className="bg-red-100 text-red-700">
              Violated - 0.1 ETH penalty
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SmartMatching = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>🔍 Scam & Fake Candidate Detection</CardTitle>
        <CardDescription>
          AI-powered analysis detects fake profiles, purchased accounts, and
          malicious actors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-green-700">
              ✅ Verified Candidates
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "Alice Chen",
                  score: 98,
                  reason: "Consistent commit history, verified repos",
                },
                {
                  name: "Bob Wilson",
                  score: 95,
                  reason: "Strong Web3 contributions, active community",
                },
                {
                  name: "Carol Davis",
                  score: 92,
                  reason: "Real projects, verified skills",
                },
              ].map((candidate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-600">
                      {candidate.reason}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {candidate.score}% Real
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-red-700">🚨 Detected Threats</h4>
            <div className="space-y-3">
              {[
                {
                  name: "fake_dev_123",
                  threat: "Purchased GitHub account",
                  confidence: 99,
                },
                {
                  name: "john.crypto.dev",
                  threat: "Cloned portfolio",
                  confidence: 94,
                },
                {
                  name: "web3_expert_pro",
                  threat: "Fake work history",
                  confidence: 87,
                },
              ].map((threat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{threat.name}</div>
                    <div className="text-sm text-gray-600">{threat.threat}</div>
                  </div>
                  <Badge className="bg-red-100 text-red-700">
                    {threat.confidence}% Fake
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface DashboardStats {
  totalProcesses: number;
  completed: number;
  inProgress: number;
  blocked: number;
  completionRate: number;
  averageTimeToHireHours: number;
  processesStartedToday: number;
  slaPerformanceRate: number;
  automationRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProcesses: 0,
    completed: 0,
    inProgress: 0,
    blocked: 0,
    completionRate: 0,
    averageTimeToHireHours: 0,
    processesStartedToday: 0,
    slaPerformanceRate: 0,
    automationRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to backend
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API call to your backend
        setStats({
          totalProcesses: 147,
          completed: 42,
          inProgress: 89,
          blocked: 16,
          completionRate: 89.2,
          averageTimeToHireHours: 156,
          processesStartedToday: 8,
          slaPerformanceRate: 94.7,
          automationRate: 78.3,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading automation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🛡️ Web3 Talent Agent - Anti-Scam Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Solving Web3 recruitment's biggest problems: ghosting, scams, fake
              candidates & long processes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Blockchain Secured</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Circle Layer Powered
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Anti-Ghosting Score
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.slaPerformanceRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                SLA compliance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Verified Candidates
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalProcesses}
              </div>
              <p className="text-xs text-muted-foreground">
                Blockchain-verified profiles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Process Speed
              </CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.averageTimeToHireHours / 24)}d
              </div>
              <p className="text-xs text-muted-foreground">
                vs 90d industry avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scam Prevention
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <p className="text-xs text-muted-foreground">
                Fake profiles blocked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Automation Rate
              </CardTitle>
              <Target className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.automationRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Process automation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Problem-Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Ghosting Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-red-600">
                  <strong>Problem:</strong> 60%+ of candidates/companies
                  disappear mid-process
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Smart contracts enforce SLAs with
                  real penalties
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    94.7% compliance rate
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Users className="h-5 w-5" />
                Fake Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-orange-600">
                  <strong>Problem:</strong> Purchased GitHub accounts, fake
                  portfolios
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> AI analyzes commit patterns,
                  blockchain verification
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    100% verification accuracy
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                Long Processes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-blue-600">
                  <strong>Problem:</strong> 3-6 month hiring cycles, manual
                  screening
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> AI automation reduces time by 80%
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {Math.round(stats.averageTimeToHireHours / 24)} days avg
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <TrendingUp className="h-5 w-5" />
                No Accountability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-purple-600">
                  <strong>Problem:</strong> No consequences for bad behavior
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Immutable reputation scores on
                  Circle Layer
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Permanent track record
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Brain className="h-5 w-5" />
                Skills Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-yellow-600">
                  <strong>Problem:</strong> Hard to verify actual Web3 expertise
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Multi-source AI analysis of real
                  contributions
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">89% accuracy rate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Settings className="h-5 w-5" />
                Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-indigo-600">
                  <strong>Problem:</strong> Black box hiring decisions, bias
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Open algorithms, blockchain audit
                  trail
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Full transparency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="workflow" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Anti-Ghosting
            </TabsTrigger>
            <TabsTrigger value="sla" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              SLA Enforcement
            </TabsTrigger>
            <TabsTrigger value="matching" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Scam Detection
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Process Speed
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center gap-2"
            >
              <Plug className="h-4 w-4" />
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-4">
            <WorkflowVisualization />
          </TabsContent>

          <TabsContent value="processes" className="space-y-4">
            <LiveProcesses />
          </TabsContent>

          <TabsContent value="sla" className="space-y-4">
            <SLAMonitor />
          </TabsContent>

          <TabsContent value="matching" className="space-y-4">
            <SmartMatching />
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <AutomationMetrics />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
