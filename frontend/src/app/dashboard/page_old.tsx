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
  Shield,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Activity,
  DollarSign,
  FileText,
  Clock,
  Target,
  Users,
  Globe,
  Brain,
  Zap,
  Building2,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  LiveProcesses,
  AutomationMetrics,
  IntegrationPanel,
  WorkflowVisualization,
} from "@/components/dashboard";

interface DashboardStats {
  totalInstitutions: number;
  compliantInstitutions: number;
  activeViolations: number;
  totalTransactions: number;
  complianceScore: number;
  riskScore: number;
  reportsGenerated: number;
  regulatoryUpdates: number;
  amlDetections: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInstitutions: 47,
    compliantInstitutions: 45,
    activeViolations: 2,
    totalTransactions: 15420,
    complianceScore: 98.7,
    riskScore: 23.5,
    reportsGenerated: 156,
    regulatoryUpdates: 8,
    amlDetections: 12,
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Shield className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">
                    DeFi Compliance Dashboard
                  </h1>
                  <p className="text-xl text-blue-100 font-medium">
                    AI-powered institutional-grade regulatory compliance
                    monitoring
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <span className="font-semibold">Real-time Monitoring</span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                Circle Layer Secured
              </Badge>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                Compliance Score
              </CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                {stats.complianceScore}%
              </div>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +2.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                Institutions
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {stats.totalInstitutions}
              </div>
              <p className="text-sm text-blue-600">
                Major financial institutions monitored
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                Risk Score
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {stats.riskScore}%
              </div>
              <p className="text-sm text-purple-600">
                Portfolio risk level (Low)
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                AML Detections
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700 mb-2">
                {stats.amlDetections}
              </div>
              <p className="text-sm text-orange-600">
                Suspicious activity alerts
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">
                AI Reports
              </CardTitle>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-700 mb-2">
                {stats.reportsGenerated}
              </div>
              <p className="text-sm text-indigo-600">
                Auto-generated this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">
                $10B+ Annual Risk
              </CardTitle>
              <CardDescription className="text-red-100 text-lg">
                Banks face massive fines for DeFi non-compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-red-100 mb-6">
                Manual monitoring can't keep up with regulatory changes across
                jurisdictions. One violation could cost millions in fines and
                reputational damage.
              </p>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 font-semibold">
                Critical Business Risk
              </Badge>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">
                AI-Powered Solution
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Real-time compliance monitoring & automated reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-blue-100 mb-6">
                Our AI analyzes transactions in real-time, maps regulatory
                requirements, and generates compliance reports automatically
                across all jurisdictions.
              </p>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 font-semibold">
                98.7% Accuracy Rate
              </Badge>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">
                10x+ ROI Potential
              </CardTitle>
              <CardDescription className="text-emerald-100 text-lg">
                Massive cost savings & risk reduction
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-emerald-100 mb-6">
                Save millions in compliance costs, avoid regulatory fines, and
                enable safe institutional DeFi adoption at enterprise scale.
              </p>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 font-semibold">
                Enterprise Ready
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent">
              <TabsTrigger
                value="monitoring"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Eye className="h-5 w-5" />
                Live Monitoring
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Activity className="h-5 w-5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Zap className="h-5 w-5" />
                Workflow
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Globe className="h-5 w-5" />
                Integrations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monitoring" className="space-y-6">
            <LiveProcesses />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AutomationMetrics />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <WorkflowVisualization />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Regulatory Compliance Monitoring Component
const ComplianceMonitor = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>🛡️ Real-Time Compliance Monitoring</CardTitle>
        <CardDescription>
          AI-powered monitoring across all regulatory frameworks with instant
          violation detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <div className="text-sm text-green-700">Compliance Score</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">15,420</div>
            <div className="text-sm text-blue-700">Transactions Monitored</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <div className="text-sm text-yellow-700">Flagged Transactions</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-red-700">Active Violations</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Large Transaction Alert</span>
              <div className="text-sm text-gray-600">
                $2.5M USDC → Compound Protocol
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">
              Pending Review
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">AML Risk Detected</span>
              <div className="text-sm text-gray-600">
                Suspicious transaction pattern identified
              </div>
            </div>
            <Badge className="bg-red-100 text-red-700">
              High Risk - Investigation Required
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Regulatory Update</span>
              <div className="text-sm text-gray-600">
                New SEC DeFi guidance affects 15% of portfolio
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700">Action Required</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Protocol Risk Assessment Component
const RiskAssessment = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>🔍 DeFi Protocol Risk Analysis</CardTitle>
        <CardDescription>
          AI-powered security auditing and compliance assessment of DeFi
          protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-green-700">
              ✅ Approved Protocols
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "Aave V3",
                  score: 95,
                  reason: "Audited, high TVL, regulatory compliant",
                },
                {
                  name: "Compound",
                  score: 92,
                  reason: "Established protocol, institutional grade",
                },
                {
                  name: "Uniswap V3",
                  score: 89,
                  reason: "Decentralized, audited smart contracts",
                },
              ].map((protocol, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{protocol.name}</div>
                    <div className="text-sm text-gray-600">
                      {protocol.reason}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {protocol.score}% Safe
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-red-700">
              🚨 High-Risk Protocols
            </h4>
            <div className="space-y-3">
              {[
                {
                  name: "NewDeFiProtocol",
                  threat: "Unaudited smart contracts",
                  confidence: 94,
                },
                {
                  name: "YieldFarmer Pro",
                  threat: "High impermanent loss risk",
                  confidence: 87,
                },
                {
                  name: "MegaYield",
                  threat: "Regulatory compliance issues",
                  confidence: 91,
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
                    {threat.confidence}% Risk
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
  totalInstitutions: number;
  compliantInstitutions: number;
  activeViolations: number;
  totalTransactions: number;
  complianceScore: number;
  riskScore: number;
  reportsGenerated: number;
  regulatoryUpdates: number;
  amlDetections: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInstitutions: 0,
    compliantInstitutions: 0,
    activeViolations: 0,
    totalTransactions: 0,
    complianceScore: 0,
    riskScore: 0,
    reportsGenerated: 0,
    regulatoryUpdates: 0,
    amlDetections: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to compliance backend
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API call to your compliance backend
        setStats({
          totalInstitutions: 47,
          compliantInstitutions: 45,
          activeViolations: 2,
          totalTransactions: 15420,
          complianceScore: 98.7,
          riskScore: 23.5,
          reportsGenerated: 156,
          regulatoryUpdates: 8,
          amlDetections: 12,
        });
      } catch (error) {
        console.error("Failed to fetch compliance dashboard data:", error);
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
          <p className="mt-4 text-gray-600">Loading compliance dashboard...</p>
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
              🏦 DeFi Regulatory Compliance Platform
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered compliance monitoring, risk assessment, and automated
              regulatory reporting for institutional DeFi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Real-time Monitoring</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Circle Layer Secured
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Compliance Score
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.complianceScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall regulatory compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Institutions Monitored
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalInstitutions}
              </div>
              <p className="text-xs text-muted-foreground">
                Financial institutions tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.riskScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio risk level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AML Detections
              </CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.amlDetections}
              </div>
              <p className="text-xs text-muted-foreground">
                Money laundering alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports Generated
              </CardTitle>
              <FileText className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.reportsGenerated}
              </div>
              <p className="text-xs text-muted-foreground">
                Automated compliance reports
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
                Regulatory Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                🚨 Banks face <strong>billions in fines</strong> for DeFi
                non-compliance. Manual monitoring can't keep up with regulatory
                changes.
              </p>
              <Badge className="bg-red-100 text-red-700">
                High-Stakes Problem
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="h-5 w-5" />
                AI Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                ⚡ Real-time compliance monitoring, risk assessment, and
                automated reporting across all DeFi protocols and transactions.
              </p>
              <Badge className="bg-blue-100 text-blue-700">
                AI-Powered Innovation
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <DollarSign className="h-5 w-5" />
                Business Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                💰 Save millions in compliance costs, avoid regulatory fines,
                enable safe institutional DeFi adoption at scale.
              </p>
              <Badge className="bg-green-100 text-green-700">
                ROI: 10x+ within 12 months
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Real-Time Transaction Monitoring
              </CardTitle>
              <CardDescription>
                Live analysis of DeFi transactions for compliance violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transactions Today</span>
                  <span className="font-medium">
                    {stats.totalTransactions.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flagged for Review</span>
                  <span className="font-medium text-yellow-600">
                    {stats.amlDetections}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Violations</span>
                  <span className="font-medium text-red-600">
                    {stats.activeViolations}
                  </span>
                </div>
                <Progress value={stats.complianceScore} className="h-2" />
                <p className="text-xs text-gray-600">
                  Compliance rate: {stats.complianceScore}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Regulatory Intelligence
              </CardTitle>
              <CardDescription>
                AI-powered analysis of regulatory landscape changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Regulatory Updates</span>
                  <span className="font-medium">{stats.regulatoryUpdates}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Impact Assessment</span>
                  <span className="font-medium text-blue-600">Medium Risk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adaptation Time</span>
                  <span className="font-medium text-green-600">Real-time</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Last update: 2 minutes ago • Next scan: 30 seconds
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem-Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Regulatory Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-red-600">
                  <strong>Problem:</strong> Banks face $10B+ in fines for DeFi
                  compliance violations
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Real-time monitoring prevents
                  violations before they occur
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    98.7% compliance rate
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Shield className="h-5 w-5" />
                Protocol Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-orange-600">
                  <strong>Problem:</strong> Unaudited DeFi protocols pose
                  massive security risks to institutions
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> AI analyzes smart contracts and
                  security audits automatically
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    100% protocol verification accuracy
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                Regulatory Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-blue-600">
                  <strong>Problem:</strong> 30-90 day compliance reviews, manual
                  regulatory assessments
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Real-time AI compliance reduces
                  time by 95%
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Real-time compliance monitoring
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
                <Globe className="h-5 w-5" />
                Regulatory Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-indigo-600">
                  <strong>Problem:</strong> Black box compliance decisions,
                  unclear audit trails
                </p>
                <p className="text-sm text-green-700">
                  <strong>Solution:</strong> Transparent AI decisions, full
                  blockchain audit trail
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Full regulatory transparency
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="compliance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="space-y-4">
            <ComplianceMonitor />
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <RiskAssessment />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AutomationMetrics />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <LiveProcesses />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
