"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Brain,
  DollarSign,
  Globe,
  Zap,
  Building2,
  Eye,
  FileText,
  Clock,
  ArrowRight,
  Star,
  Users,
  Target,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const [animatedStats, setAnimatedStats] = useState({
    complianceScore: 0,
    institutionsServed: 0,
    riskReduction: 0,
    costSavings: 0,
  });

  // Animate stats on page load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats((prev) => ({
        complianceScore: Math.min(prev.complianceScore + 2, 98.7),
        institutionsServed: Math.min(prev.institutionsServed + 1, 47),
        riskReduction: Math.min(prev.riskReduction + 3, 85),
        costSavings: Math.min(prev.costSavings + 0.5, 12.3),
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0 px-6 py-2 text-sm font-bold">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered • Circle Layer • Enterprise Ready
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                DeFi Compliance
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              AI-powered regulatory compliance and risk management engine for
              institutional DeFi.
              <strong className="text-white">
                {" "}
                Stop losing millions to compliance violations.
              </strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Live Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Demo Report
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {animatedStats.complianceScore.toFixed(1)}%
                </div>
                <div className="text-blue-200 font-medium">
                  Compliance Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {Math.round(animatedStats.institutionsServed)}
                </div>
                <div className="text-blue-200 font-medium">
                  Institutions Served
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {Math.round(animatedStats.riskReduction)}%
                </div>
                <div className="text-blue-200 font-medium">Risk Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  ${animatedStats.costSavings.toFixed(1)}M
                </div>
                <div className="text-blue-200 font-medium">
                  Avg. Cost Savings
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Banks Are Losing <span className="text-red-600">Billions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manual compliance monitoring can't keep up with the complexity of
              DeFi. One violation can cost millions in fines and destroy
              institutional reputation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-white shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-700">
                  $10B+ Annual Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Financial institutions face massive regulatory fines for DeFi
                  non-compliance across multiple jurisdictions.
                </p>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Critical Business Risk
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-orange-700">
                  Manual Impossibility
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Human analysts can't monitor thousands of DeFi protocols in
                  real-time across changing regulations.
                </p>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  Scaling Problem
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-white shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl text-yellow-700">
                  Reputation Damage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  One compliance violation can destroy decades of institutional
                  trust and regulatory relationships.
                </p>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Trust Crisis
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Compliance Officer
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform monitors every DeFi transaction in
              real-time, ensuring 99%+ compliance accuracy across all major
              regulatory frameworks.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-blue-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-700">
                  AI Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Advanced ML algorithms analyze DeFi protocols across 6 risk
                  dimensions with 98.7% accuracy.
                </p>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  99%+ Detection Rate
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl text-emerald-700">
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Continuous transaction monitoring with instant violation
                  detection and automated remediation.
                </p>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  24/7 Protection
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-700">
                  Auto Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Automated compliance reports for SEC, MiCA, FCA, FSA with 90%+
                  time savings.
                </p>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Regulatory Ready
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                10x+ ROI
              </span>{" "}
              in Year One
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Massive cost savings, avoided fines, and the ability to safely
              enter the $2T+ DeFi market.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Cost Savings Breakdown
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      $5-15M Avoided Fines
                    </div>
                    <div className="text-gray-600">
                      Prevent regulatory violations before they happen
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      $3-8M Staff Savings
                    </div>
                    <div className="text-gray-600">
                      Reduce compliance team by 80%+ with automation
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      $10-50M+ Revenue
                    </div>
                    <div className="text-gray-600">
                      Safe access to high-yield DeFi opportunities
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold mb-2">
                  Enterprise Package
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Complete institutional compliance solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>Real-time transaction monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>AI-powered risk assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>Automated regulatory reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>24/7 compliance dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>Multi-jurisdiction support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <span>Emergency violation alerts</span>
                </div>
                <div className="pt-6">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold"
                    >
                      Start Free Trial
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Leading Institutions
            </h2>
            <p className="text-xl text-gray-600">
              Join 47+ major financial institutions using our platform
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-60">
            {/* Bank logos would go here */}
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block text-emerald-400">DeFi Compliance?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the institutions already saving millions with AI-powered
            compliance automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-lg shadow-2xl"
              >
                <Activity className="h-5 w-5 mr-2" />
                View Live Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold">
                DeFi Compliance Platform
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered regulatory compliance for institutional DeFi
            </p>
            <div className="flex justify-center space-x-6">
              <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                Built on Circle Layer
              </Badge>
              <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                Enterprise Ready
              </Badge>
              <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                SOC 2 Compliant
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
