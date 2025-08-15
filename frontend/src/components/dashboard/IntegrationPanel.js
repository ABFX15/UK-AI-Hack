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
        id: "sec_edgar",
        name: "SEC EDGAR API",
        description: "Real-time access to SEC filings and regulatory updates",
        category: "regulatory_apis",
        status: "connected",
        enabled: true,
        lastSync: "2 minutes ago",
        apiCalls: 847,
        rateLimit: 5000,
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Gavel, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Cloud, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-5 w-5" }),
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
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-5 w-5" }),
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
    regulatory_apis: (0, jsx_runtime_1.jsx)(lucide_react_1.Gavel, { className: "h-4 w-4" }),
    blockchain_analysis: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }),
    data_storage: (0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-4 w-4" }),
    ai_compliance: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4" }),
    reporting: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4" }),
    monitoring: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" }),
};
const categoryColors = {
    regulatory_apis: "bg-blue-100 text-blue-700",
    blockchain_analysis: "bg-green-100 text-green-700",
    data_storage: "bg-purple-100 text-purple-700",
    ai_compliance: "bg-yellow-100 text-yellow-700",
    reporting: "bg-red-100 text-red-700",
    monitoring: "bg-indigo-100 text-indigo-700",
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-6 w-6 text-blue-600" }), "Compliance Integrations"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Manage regulatory APIs, blockchain analytics, and compliance monitoring services" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-4 w-4 mr-2" }), "Add Integration"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Connected Services" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-semibold text-green-600", children: [connectedCount, "/", integrations.length] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Active integrations" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Health Score" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-semibold text-blue-600", children: [avgHealthScore.toFixed(0), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Average system health" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "API Calls Today" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-semibold text-purple-600", children: totalApiCalls.toLocaleString() }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Across all services" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Issues" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-semibold text-red-600", children: errorCount }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Require attention" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search compliance integrations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "max-w-sm" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 flex-wrap", children: [
                            "all",
                            "regulatory_apis",
                            "blockchain_analysis",
                            "data_storage",
                            "ai_compliance",
                            "reporting",
                            "monitoring",
                        ].map((category) => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: filter === category ? "default" : "outline", size: "sm", className: "font-medium", onClick: () => setFilter(category), children: category === "all"
                                ? "All"
                                : category
                                    .replace("_", " ")
                                    .split(" ")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ") }, category))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredIntegrations.map((integration) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "hover:shadow-md transition-shadow border-l-4 border-l-blue-500", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gray-50 rounded-lg", children: integration.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg font-semibold", children: integration.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: `${categoryColors[integration.category]} border font-medium`, children: [categoryIcons[integration.category], (0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: integration.category.replace("_", " ") })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: `${getStatusColor(integration.status)} border font-medium`, children: [getStatusIcon(integration.status), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 capitalize", children: integration.status })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: integration.enabled, onChange: () => toggleIntegration(integration.id), disabled: integration.status === "error" ||
                                                    integration.status === "pending", className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" }) })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-sm", children: integration.description })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Health Score" }), (0, jsx_runtime_1.jsxs)("span", { className: `font-semibold ${integration.healthScore >= 95
                                                        ? "text-green-600"
                                                        : integration.healthScore >= 80
                                                            ? "text-yellow-600"
                                                            : "text-red-600"}`, children: [integration.healthScore, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: integration.healthScore, className: `h-2 ${integration.healthScore >= 95
                                                ? "bg-green-100"
                                                : integration.healthScore >= 80
                                                    ? "bg-yellow-100"
                                                    : "bg-red-100"}` })] }), integration.rateLimit > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "API Usage" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: [integration.apiCalls.toLocaleString(), "/", integration.rateLimit.toLocaleString()] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: (integration.apiCalls / integration.rateLimit) * 100, className: "h-2 bg-gray-100" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium mb-2", children: "Core Features" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: integration.features.map((feature, index) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs font-medium", children: feature }, index))) })] }), integration.lastSync && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 bg-gray-50 p-2 rounded", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Last sync:" }), " ", integration.lastSync] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 pt-2 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "font-medium", onClick: () => configureIntegration(integration.id), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-3 w-3 mr-1" }), "Configure"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "font-medium", onClick: () => testConnection(integration.id), disabled: integration.status === "pending", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-3 w-3 mr-1" }), "Test"] }), integration.authRequired && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "h-3 w-3 mr-1" }), "Auth"] })), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3 mr-1" }), "Docs"] })] })] })] }, integration.id))) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5 text-blue-600" }), "Quick Setup Recommendations"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Essential integrations to enhance your compliance monitoring capabilities" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [
                                {
                                    name: "Slack Compliance Alerts",
                                    description: "Get real-time notifications about regulatory violations and critical compliance events",
                                    category: "monitoring",
                                    priority: "high",
                                },
                                {
                                    name: "Bloomberg Regulatory Intelligence",
                                    description: "Access to global regulatory updates and compliance intelligence",
                                    category: "regulatory_apis",
                                    priority: "medium",
                                },
                                {
                                    name: "Azure Compliance Manager",
                                    description: "Cloud-based compliance assessment and audit management",
                                    category: "data_storage",
                                    priority: "medium",
                                },
                            ].map((suggestion, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${suggestion.priority === "high"
                                                    ? "bg-red-500"
                                                    : suggestion.priority === "medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"}` }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: suggestion.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: suggestion.description }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "mt-2 text-xs", children: suggestion.category.replace("_", " ") })] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", className: "font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-3 w-3 mr-1" }), "Connect"] })] }, index))) }) })] })] }));
}
//# sourceMappingURL=IntegrationPanel.js.map