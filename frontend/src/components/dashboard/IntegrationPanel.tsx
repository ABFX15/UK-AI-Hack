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
import { Input } from "@/components/ui/input";
import {
  Plug,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Shield,
  Database,
  Key,
  Cloud,
  Zap,
  Activity,
  FileText,
  Building2,
  Globe,
  Lock,
  Gavel,
  TrendingUp,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category:
    | "regulatory_apis"
    | "blockchain_analysis"
    | "data_storage"
    | "ai_compliance"
    | "reporting"
    | "monitoring";
  status: "connected" | "disconnected" | "error" | "pending";
  enabled: boolean;
  lastSync?: string;
  apiCalls: number;
  rateLimit: number;
  icon: React.ReactNode;
  authRequired: boolean;
  healthScore: number;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: "sec_edgar",
    name: "SEC EDGAR API",
    description: "Real-time access to SEC filings and regulatory updates",
    category: "regulatory_apis",
    status: "connected",
    enabled: true,
    lastSync: "2 minutes ago",
    apiCalls: 847,
    rateLimit: 5000,
    icon: <Gavel className="h-5 w-5" />,
    authRequired: true,
    healthScore: 98,
    features: [
      "Filing Access",
      "Regulatory Updates",
      "Form Analysis",
      "Compliance Alerts",
    ],
  },
  {
    id: "finra_trace",
    name: "FINRA TRACE",
    description: "Trade reporting and compliance system integration",
    category: "regulatory_apis",
    status: "connected",
    enabled: true,
    lastSync: "15 minutes ago",
    apiCalls: 234,
    rateLimit: 1000,
    icon: <Building2 className="h-5 w-5" />,
    authRequired: true,
    healthScore: 95,
    features: [
      "Trade Reporting",
      "Market Data",
      "Compliance Monitoring",
      "Risk Assessment",
    ],
  },
  {
    id: "chainalysis",
    name: "Chainalysis",
    description: "Blockchain analytics and AML/KYC compliance tools",
    category: "blockchain_analysis",
    status: "connected",
    enabled: true,
    lastSync: "1 minute ago",
    apiCalls: 123,
    rateLimit: 10000,
    icon: <Shield className="h-5 w-5" />,
    authRequired: true,
    healthScore: 100,
    features: [
      "Transaction Analysis",
      "AML Screening",
      "Risk Scoring",
      "Sanctions Monitoring",
    ],
  },
  {
    id: "elliptic",
    name: "Elliptic",
    description: "Advanced blockchain analytics and compliance monitoring",
    category: "blockchain_analysis",
    status: "connected",
    enabled: false,
    lastSync: "1 hour ago",
    apiCalls: 45,
    rateLimit: 2000,
    icon: <Activity className="h-5 w-5" />,
    authRequired: true,
    healthScore: 87,
    features: [
      "Wallet Analysis",
      "Entity Identification",
      "Compliance Reporting",
      "Investigation Tools",
    ],
  },
  {
    id: "aws_compliance",
    name: "AWS Compliance Services",
    description: "Cloud-based compliance and audit trail management",
    category: "data_storage",
    status: "error",
    enabled: true,
    lastSync: "Failed",
    apiCalls: 12,
    rateLimit: 50000,
    icon: <Cloud className="h-5 w-5" />,
    authRequired: true,
    healthScore: 23,
    features: [
      "Audit Trails",
      "Data Encryption",
      "Compliance Logs",
      "Secure Storage",
    ],
  },
  {
    id: "postgresql_compliance",
    name: "PostgreSQL Compliance DB",
    description: "Secure database for regulatory and compliance data",
    category: "data_storage",
    status: "connected",
    enabled: true,
    lastSync: "Real-time",
    apiCalls: 2847,
    rateLimit: 0,
    icon: <Database className="h-5 w-5" />,
    authRequired: false,
    healthScore: 99,
    features: [
      "Encrypted Storage",
      "Audit Logs",
      "Data Integrity",
      "Compliance Queries",
    ],
  },
  {
    id: "openai_compliance",
    name: "OpenAI Compliance AI",
    description: "AI-powered regulatory analysis and risk assessment",
    category: "ai_compliance",
    status: "connected",
    enabled: true,
    lastSync: "30 seconds ago",
    apiCalls: 456,
    rateLimit: 10000,
    icon: <Zap className="h-5 w-5" />,
    authRequired: true,
    healthScore: 96,
    features: [
      "Risk Analysis",
      "Document Review",
      "Regulatory Intelligence",
      "Compliance Scoring",
    ],
  },
  {
    id: "thomson_reuters",
    name: "Thomson Reuters",
    description: "Regulatory intelligence and compliance content services",
    category: "reporting",
    status: "pending",
    enabled: false,
    lastSync: "Never",
    apiCalls: 0,
    rateLimit: 0,
    icon: <FileText className="h-5 w-5" />,
    authRequired: true,
    healthScore: 0,
    features: [
      "Regulatory Updates",
      "Compliance Guides",
      "Risk Intelligence",
      "Global Coverage",
    ],
  },
  {
    id: "mica_eu",
    name: "EU MiCA Regulatory API",
    description: "European crypto-asset regulation compliance monitoring",
    category: "regulatory_apis",
    status: "connected",
    enabled: true,
    lastSync: "5 minutes ago",
    apiCalls: 167,
    rateLimit: 3000,
    icon: <Globe className="h-5 w-5" />,
    authRequired: true,
    healthScore: 92,
    features: [
      "MiCA Compliance",
      "EU Regulations",
      "Cross-border Monitoring",
      "Licensing Requirements",
    ],
  },
  {
    id: "sumsub_kyc",
    name: "Sumsub KYC/AML",
    description: "Identity verification and anti-money laundering compliance",
    category: "monitoring",
    status: "connected",
    enabled: true,
    lastSync: "10 minutes ago",
    apiCalls: 89,
    rateLimit: 5000,
    icon: <Lock className="h-5 w-5" />,
    authRequired: true,
    healthScore: 94,
    features: [
      "Identity Verification",
      "Document Analysis",
      "Sanctions Screening",
      "Ongoing Monitoring",
    ],
  },
];

const categoryIcons = {
  regulatory_apis: <Gavel className="h-4 w-4" />,
  blockchain_analysis: <Shield className="h-4 w-4" />,
  data_storage: <Database className="h-4 w-4" />,
  ai_compliance: <Zap className="h-4 w-4" />,
  reporting: <FileText className="h-4 w-4" />,
  monitoring: <Activity className="h-4 w-4" />,
};

const categoryColors = {
  regulatory_apis: "bg-blue-100 text-blue-700",
  blockchain_analysis: "bg-green-100 text-green-700",
  data_storage: "bg-purple-100 text-purple-700",
  ai_compliance: "bg-yellow-100 text-yellow-700",
  reporting: "bg-red-100 text-red-700",
  monitoring: "bg-indigo-100 text-indigo-700",
};

export function IntegrationPanel() {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700";
      case "disconnected":
        return "bg-gray-100 text-gray-700";
      case "error":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = filter === "all" || integration.category === filter;
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(
    (i) => i.status === "connected"
  ).length;
  const errorCount = integrations.filter((i) => i.status === "error").length;
  const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0);
  const avgHealthScore =
    integrations.reduce((sum, i) => sum + i.healthScore, 0) /
    integrations.length;

  const toggleIntegration = async (integrationId: string) => {
    console.log(`Toggling integration: ${integrationId}`);
    // API call to toggle integration would go here
  };

  const configureIntegration = (integrationId: string) => {
    console.log(`Configuring integration: ${integrationId}`);
    // Open configuration modal or navigate to config page
  };

  const testConnection = async (integrationId: string) => {
    console.log(`Testing connection for: ${integrationId}`);
    // API call to test connection would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Plug className="h-6 w-6 text-blue-600" />
            Compliance Integrations
          </h2>
          <p className="text-gray-600 mt-1">
            Manage regulatory APIs, blockchain analytics, and compliance
            monitoring services
          </p>
        </div>

        <Button className="font-medium">
          <Plug className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Services
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {connectedCount}/{integrations.length}
            </div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-600">
              {avgHealthScore.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average system health
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-purple-600">
              {totalApiCalls.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              {errorCount}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search compliance integrations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "regulatory_apis",
            "blockchain_analysis",
            "data_storage",
            "ai_compliance",
            "reporting",
            "monitoring",
          ].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              className="font-medium"
              onClick={() => setFilter(category)}
            >
              {category === "all"
                ? "All"
                : category
                    .replace("_", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card
            key={integration.id}
            className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {integration.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`${
                          categoryColors[integration.category]
                        } border font-medium`}
                      >
                        {categoryIcons[integration.category]}
                        <span className="ml-1">
                          {integration.category.replace("_", " ")}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          integration.status
                        )} border font-medium`}
                      >
                        {getStatusIcon(integration.status)}
                        <span className="ml-1 capitalize">
                          {integration.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => toggleIntegration(integration.id)}
                    disabled={
                      integration.status === "error" ||
                      integration.status === "pending"
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
              </div>

              <CardDescription className="text-sm">
                {integration.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Health and Status */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Health Score</span>
                  <span
                    className={`font-semibold ${
                      integration.healthScore >= 95
                        ? "text-green-600"
                        : integration.healthScore >= 80
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {integration.healthScore}%
                  </span>
                </div>
                <Progress
                  value={integration.healthScore}
                  className={`h-2 ${
                    integration.healthScore >= 95
                      ? "bg-green-100"
                      : integration.healthScore >= 80
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                />
              </div>

              {/* API Usage */}
              {integration.rateLimit > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">API Usage</span>
                    <span className="font-semibold text-gray-900">
                      {integration.apiCalls.toLocaleString()}/
                      {integration.rateLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(integration.apiCalls / integration.rateLimit) * 100}
                    className="h-2 bg-gray-100"
                  />
                </div>
              )}

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2">Core Features</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Sync */}
              {integration.lastSync && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Last sync:</span>{" "}
                  {integration.lastSync}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium"
                  onClick={() => configureIntegration(integration.id)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium"
                  onClick={() => testConnection(integration.id)}
                  disabled={integration.status === "pending"}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Test
                </Button>

                {integration.authRequired && (
                  <Button variant="outline" size="sm" className="font-medium">
                    <Key className="h-3 w-3 mr-1" />
                    Auth
                  </Button>
                )}

                <Button variant="outline" size="sm" className="font-medium">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Quick Setup Recommendations
          </CardTitle>
          <CardDescription>
            Essential integrations to enhance your compliance monitoring
            capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Slack Compliance Alerts",
                description:
                  "Get real-time notifications about regulatory violations and critical compliance events",
                category: "monitoring",
                priority: "high",
              },
              {
                name: "Bloomberg Regulatory Intelligence",
                description:
                  "Access to global regulatory updates and compliance intelligence",
                category: "regulatory_apis",
                priority: "medium",
              },
              {
                name: "Azure Compliance Manager",
                description:
                  "Cloud-based compliance assessment and audit management",
                category: "data_storage",
                priority: "medium",
              },
            ].map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      suggestion.priority === "high"
                        ? "bg-red-500"
                        : suggestion.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {suggestion.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {suggestion.category.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <Button size="sm" className="font-medium">
                  <Plug className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
