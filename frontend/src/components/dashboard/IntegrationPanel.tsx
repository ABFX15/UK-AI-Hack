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
  GitBranch,
  Linkedin,
  Github,
  Calendar,
  Mail,
  Database,
  Key,
  Shield,
  Cloud,
  Zap,
  Activity,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category:
    | "talent_sourcing"
    | "communication"
    | "storage"
    | "blockchain"
    | "ai_ml"
    | "analytics";
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
    id: "github",
    name: "GitHub",
    description: "Analyze developer profiles, repositories, and contributions",
    category: "talent_sourcing",
    status: "connected",
    enabled: true,
    lastSync: "2 minutes ago",
    apiCalls: 847,
    rateLimit: 5000,
    icon: <Github className="h-5 w-5" />,
    authRequired: true,
    healthScore: 98,
    features: [
      "Profile Analysis",
      "Repository Stats",
      "Contribution Graphs",
      "Skills Detection",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn API",
    description: "Access professional profiles and networking data",
    category: "talent_sourcing",
    status: "connected",
    enabled: true,
    lastSync: "15 minutes ago",
    apiCalls: 234,
    rateLimit: 1000,
    icon: <Linkedin className="h-5 w-5" />,
    authRequired: true,
    healthScore: 95,
    features: [
      "Profile Data",
      "Experience History",
      "Skills Endorsements",
      "Network Analysis",
    ],
  },
  {
    id: "circle_layer",
    name: "Circle Layer",
    description: "Blockchain-based reputation and smart contracts",
    category: "blockchain",
    status: "connected",
    enabled: true,
    lastSync: "1 minute ago",
    apiCalls: 123,
    rateLimit: 10000,
    icon: <Shield className="h-5 w-5" />,
    authRequired: true,
    healthScore: 100,
    features: [
      "Reputation Scoring",
      "Smart Contracts",
      "SLA Enforcement",
      "Anti-Ghosting",
    ],
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Automated interview scheduling and calendar management",
    category: "communication",
    status: "connected",
    enabled: false,
    lastSync: "1 hour ago",
    apiCalls: 45,
    rateLimit: 2000,
    icon: <Calendar className="h-5 w-5" />,
    authRequired: true,
    healthScore: 87,
    features: [
      "Auto Scheduling",
      "Availability Check",
      "Meeting Reminders",
      "Time Zone Handling",
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email automation and communication workflows",
    category: "communication",
    status: "error",
    enabled: true,
    lastSync: "Failed",
    apiCalls: 12,
    rateLimit: 50000,
    icon: <Mail className="h-5 w-5" />,
    authRequired: true,
    healthScore: 23,
    features: [
      "Email Templates",
      "Automation Workflows",
      "Analytics",
      "Delivery Tracking",
    ],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Primary database for application data",
    category: "storage",
    status: "connected",
    enabled: true,
    lastSync: "Real-time",
    apiCalls: 2847,
    rateLimit: 0,
    icon: <Database className="h-5 w-5" />,
    authRequired: false,
    healthScore: 99,
    features: [
      "Data Storage",
      "ACID Compliance",
      "Advanced Queries",
      "Backup & Recovery",
    ],
  },
  {
    id: "openai",
    name: "OpenAI GPT-4",
    description: "AI-powered analysis and natural language processing",
    category: "ai_ml",
    status: "connected",
    enabled: true,
    lastSync: "30 seconds ago",
    apiCalls: 456,
    rateLimit: 10000,
    icon: <Zap className="h-5 w-5" />,
    authRequired: true,
    healthScore: 96,
    features: [
      "Profile Analysis",
      "Skill Extraction",
      "Interview Q&A",
      "Matching Algorithms",
    ],
  },
  {
    id: "aws_s3",
    name: "AWS S3",
    description: "File storage for resumes, documents, and media",
    category: "storage",
    status: "pending",
    enabled: false,
    lastSync: "Never",
    apiCalls: 0,
    rateLimit: 0,
    icon: <Cloud className="h-5 w-5" />,
    authRequired: true,
    healthScore: 0,
    features: [
      "File Storage",
      "CDN Distribution",
      "Backup",
      "Scalable Storage",
    ],
  },
];

const categoryIcons = {
  talent_sourcing: <GitBranch className="h-4 w-4" />,
  communication: <Mail className="h-4 w-4" />,
  storage: <Database className="h-4 w-4" />,
  blockchain: <Shield className="h-4 w-4" />,
  ai_ml: <Zap className="h-4 w-4" />,
  analytics: <Activity className="h-4 w-4" />,
};

const categoryColors = {
  talent_sourcing: "bg-blue-100 text-blue-700",
  communication: "bg-green-100 text-green-700",
  storage: "bg-purple-100 text-purple-700",
  blockchain: "bg-yellow-100 text-yellow-700",
  ai_ml: "bg-red-100 text-red-700",
  analytics: "bg-indigo-100 text-indigo-700",
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plug className="h-6 w-6 text-blue-600" />
            Integrations
          </h2>
          <p className="text-gray-600">
            Manage external services and API connections
          </p>
        </div>

        <Button>
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
            <div className="text-2xl font-bold text-green-600">
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
            <div className="text-2xl font-bold text-blue-600">
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
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
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
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search integrations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "talent_sourcing",
            "communication",
            "storage",
            "blockchain",
            "ai_ml",
            "analytics",
          ].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
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
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {integration.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={categoryColors[integration.category]}
                      >
                        {categoryIcons[integration.category]}
                        {integration.category.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getStatusColor(integration.status)}
                      >
                        {getStatusIcon(integration.status)}
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={integration.enabled}
                  onChange={() => toggleIntegration(integration.id)}
                  disabled={
                    integration.status === "error" ||
                    integration.status === "pending"
                  }
                  className="toggle"
                />
              </div>

              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Health and Status */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Health Score</span>
                  <span className="font-medium">
                    {integration.healthScore}%
                  </span>
                </div>
                <Progress value={integration.healthScore} className="h-2" />
              </div>

              {/* API Usage */}
              {integration.rateLimit > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Usage</span>
                    <span className="font-medium">
                      {integration.apiCalls}/{integration.rateLimit}
                    </span>
                  </div>
                  <Progress
                    value={(integration.apiCalls / integration.rateLimit) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Sync */}
              {integration.lastSync && (
                <div className="text-sm text-gray-500">
                  Last sync: {integration.lastSync}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => configureIntegration(integration.id)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection(integration.id)}
                  disabled={integration.status === "pending"}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Test
                </Button>

                {integration.authRequired && (
                  <Button variant="outline" size="sm">
                    <Key className="h-3 w-3 mr-1" />
                    Auth
                  </Button>
                )}

                <Button variant="outline" size="sm">
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
          <CardTitle>Quick Setup Recommendations</CardTitle>
          <CardDescription>
            Suggested integrations to improve your talent matching workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Slack",
                description:
                  "Get real-time notifications about matches and SLA violations",
                category: "communication",
                priority: "high",
              },
              {
                name: "Google Calendar",
                description:
                  "Improved scheduling integration with team calendars",
                category: "communication",
                priority: "medium",
              },
              {
                name: "Stripe",
                description:
                  "Handle payments and financial transactions securely",
                category: "payment",
                priority: "low",
              },
            ].map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
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
                  <div>
                    <h4 className="font-medium">{suggestion.name}</h4>
                    <p className="text-sm text-gray-600">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                <Button size="sm">
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
