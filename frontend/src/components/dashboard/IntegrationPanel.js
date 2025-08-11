"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPanel = IntegrationPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const integrations = [
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Github, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Linkedin, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "h-5 w-5" }),
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
    talent_sourcing: (0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "h-4 w-4" }),
    communication: (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4" }),
    storage: (0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-4 w-4" }),
    blockchain: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }),
    ai_ml: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4" }),
    analytics: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" }),
};
const categoryColors = {
    talent_sourcing: "bg-blue-100 text-blue-700",
    communication: "bg-green-100 text-green-700",
    storage: "bg-purple-100 text-purple-700",
    blockchain: "bg-yellow-100 text-yellow-700",
    ai_ml: "bg-red-100 text-red-700",
    analytics: "bg-indigo-100 text-indigo-700",
};
function IntegrationPanel() {
    const [filter, setFilter] = (0, react_1.useState)("all");
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const getStatusColor = (status) => {
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
    const getStatusIcon = (status) => {
        switch (status) {
            case "connected":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
            case "disconnected":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-600" });
            case "error":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" });
            case "pending":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const filteredIntegrations = integrations.filter((integration) => {
        const matchesCategory = filter === "all" || integration.category === filter;
        const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const connectedCount = integrations.filter((i) => i.status === "connected").length;
    const errorCount = integrations.filter((i) => i.status === "error").length;
    const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0);
    const avgHealthScore = integrations.reduce((sum, i) => sum + i.healthScore, 0) /
        integrations.length;
    const toggleIntegration = async (integrationId) => {
        console.log(`Toggling integration: ${integrationId}`);
        // API call to toggle integration would go here
    };
    const configureIntegration = (integrationId) => {
        console.log(`Configuring integration: ${integrationId}`);
        // Open configuration modal or navigate to config page
    };
    const testConnection = async (integrationId) => {
        console.log(`Testing connection for: ${integrationId}`);
        // API call to test connection would go here
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-6 w-6 text-blue-600" }), "Integrations"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage external services and API connections" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }), "Add Integration"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Connected Services" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [connectedCount, "/", integrations.length] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Active integrations" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Health Score" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-blue-600", children: [avgHealthScore.toFixed(0), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Average system health" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "API Calls Today" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: totalApiCalls.toLocaleString() }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Across all services" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Issues" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: errorCount }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Require attention" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search integrations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "max-w-sm" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 flex-wrap", children: [
                            "all",
                            "talent_sourcing",
                            "communication",
                            "storage",
                            "blockchain",
                            "ai_ml",
                            "analytics",
                        ].map((category) => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: filter === category ? "default" : "outline", size: "sm", onClick: () => setFilter(category), children: category === "all"
                                ? "All"
                                : category
                                    .replace("_", " ")
                                    .split(" ")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ") }, category))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredIntegrations.map((integration) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gray-50 rounded-lg", children: integration.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: integration.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: categoryColors[integration.category], children: [categoryIcons[integration.category], integration.category.replace("_", " ")] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: getStatusColor(integration.status), children: [getStatusIcon(integration.status), integration.status] })] })] })] }), (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: integration.enabled, onChange: () => toggleIntegration(integration.id), disabled: integration.status === "error" ||
                                                integration.status === "pending", className: "toggle" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: integration.description })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Health Score" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [integration.healthScore, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: integration.healthScore, className: "h-2" })] }), integration.rateLimit > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "API Usage" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [integration.apiCalls, "/", integration.rateLimit] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: (integration.apiCalls / integration.rateLimit) * 100, className: "h-2" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium mb-2", children: "Features" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: integration.features.map((feature, index) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: feature }, index))) })] }), integration.lastSync && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Last sync: ", integration.lastSync] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 pt-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => configureIntegration(integration.id), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-3 w-3 mr-1" }), "Configure"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => testConnection(integration.id), disabled: integration.status === "pending", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-3 w-3 mr-1" }), "Test"] }), integration.authRequired && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "h-3 w-3 mr-1" }), "Auth"] })), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3 mr-1" }), "Docs"] })] })] })] }, integration.id))) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Quick Setup Recommendations" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Suggested integrations to improve your talent matching workflow" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [
                                {
                                    name: "Slack",
                                    description: "Get real-time notifications about matches and SLA violations",
                                    category: "communication",
                                    priority: "high",
                                },
                                {
                                    name: "Google Calendar",
                                    description: "Improved scheduling integration with team calendars",
                                    category: "communication",
                                    priority: "medium",
                                },
                                {
                                    name: "Stripe",
                                    description: "Handle payments and financial transactions securely",
                                    category: "payment",
                                    priority: "low",
                                },
                            ].map((suggestion, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${suggestion.priority === "high"
                                                    ? "bg-red-500"
                                                    : suggestion.priority === "medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"}` }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: suggestion.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: suggestion.description })] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-3 w-3 mr-1" }), "Connect"] })] }, index))) }) })] })] }));
}
//# sourceMappingURL=IntegrationPanel.js.map