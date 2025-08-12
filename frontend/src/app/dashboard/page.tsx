"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowRight,
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
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-colors mb-2"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Agent Platform
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
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
