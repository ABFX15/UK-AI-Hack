"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationMetrics = AutomationMetrics;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
const automationRules = [
    {
        id: "compliance_monitoring",
        name: "Real-time Compliance Monitoring",
        description: "AI continuously monitors DeFi transactions for regulatory violations",
        type: "compliance_monitoring",
        enabled: true,
        successRate: 98.7,
        timeSaved: 45.2,
        triggerCount: 15420,
    },
    {
        id: "risk_assessment",
        name: "Automated Protocol Risk Assessment",
        description: "AI analyzes smart contracts and audits for security vulnerabilities",
        type: "risk_assessment",
        enabled: true,
        successRate: 94.3,
        timeSaved: 72.5,
        triggerCount: 89,
    },
    {
        id: "violation_detection",
        name: "AML/KYC Violation Detection",
        description: "Machine learning detects suspicious transaction patterns instantly",
        type: "violation_detection",
        enabled: true,
        successRate: 99.1,
        timeSaved: 12.8,
        triggerCount: 234,
    },
    {
        id: "regulatory_reporting",
        name: "Automated Regulatory Reporting",
        description: "Generates compliance reports for regulatory bodies automatically",
        type: "regulatory_reporting",
        enabled: true,
        successRate: 100,
        timeSaved: 156.0,
        triggerCount: 23,
    },
    {
        id: "protocol_analysis",
        name: "DeFi Protocol Analysis",
        description: "Analyzes new DeFi protocols for institutional compliance approval",
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
function AutomationMetrics() {
    const [automationRate, setAutomationRate] = (0, react_1.useState)(78.3);
    const [totalTimeSaved, setTotalTimeSaved] = (0, react_1.useState)(156.8);
    const [processesAutomated, setProcessesAutomated] = (0, react_1.useState)(1247);
    const [efficiency, setEfficiency] = (0, react_1.useState)(89.2);
    const getTypeIcon = (type) => {
        switch (type) {
            case "compliance_monitoring":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" });
            case "risk_assessment":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4" });
            case "regulatory_reporting":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4" });
            case "violation_detection":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4" });
            case "protocol_analysis":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4" });
        }
    };
    const getTypeColor = (type) => {
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
    const toggleAutomation = async (ruleId) => {
        // Simulate API call to toggle automation rule
        console.log(`Toggling automation rule: ${ruleId}`);
        // You would call your automation API here
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6 text-yellow-500" }), "Compliance Automation Metrics"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Performance and efficiency of automated regulatory compliance processes" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "bg-green-50 text-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-3 w-3 mr-1" }), "AI-Powered"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }), "Configure"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Automation Rate" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4 text-yellow-500" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-yellow-600", children: [automationRate, "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "+5.2% from last month" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Time Saved" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [totalTimeSaved, "h"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "This month" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Processes Automated" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: processesAutomated }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Total this quarter" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Efficiency Score" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-purple-600", children: [efficiency, "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Overall performance" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Automation Rules" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Configure and monitor automated processes" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: automationRules.map((rule) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: `p-2 rounded-lg ${getTypeColor(rule.type)}`, children: getTypeIcon(rule.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: rule.name }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: rule.enabled ? "default" : "secondary", className: rule.enabled ? "bg-green-100 text-green-700" : "", children: rule.enabled ? "Active" : "Inactive" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: rule.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-sm text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Success Rate: ", rule.successRate, "%"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Time Saved: ", rule.timeSaved, "h/process"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Triggers: ", rule.triggerCount] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: rule.successRate, className: "h-2" }) })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: rule.enabled ? "outline" : "default", size: "sm", onClick: () => toggleAutomation(rule.id), children: rule.enabled ? "Disable" : "Enable" })] }, rule.id))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Automation Performance Trends" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Weekly automation vs manual processing" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: performanceData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "week" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "automation", stroke: "#10b981", strokeWidth: 2, name: "Automation %" }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "efficiency", stroke: "#8b5cf6", strokeWidth: 2, name: "Efficiency Score" })] }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Time Savings Distribution" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Where automation saves the most time" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: timeSavingsData, cx: "50%", cy: "50%", outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, value }) => `${name}: ${value}%`, children: timeSavingsData.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {})] }) }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Automation by Process Stage" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Percentage of automated vs manual compliance tasks across regulatory processes" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 400, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: processStageAutomation, layout: "horizontal", children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { type: "number", domain: [0, 100] }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { dataKey: "stage", type: "category", width: 120 }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "automated", stackId: "a", fill: "#10b981", name: "Automated" }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "manual", stackId: "a", fill: "#ef4444", name: "Manual" })] }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-5 w-5 text-purple-600" }), "AI Recommendations"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Suggestions to improve automation efficiency" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [
                                {
                                    priority: "high",
                                    title: "Enable Automatic Escalation",
                                    description: "Currently disabled but could save 12h/week in manual escalations",
                                    impact: "+8% efficiency",
                                },
                                {
                                    priority: "medium",
                                    title: "Optimize Interview Scheduling",
                                    description: "AI suggests improving calendar integration for 94.7% → 98%+ success rate",
                                    impact: "+2.1% time saved",
                                },
                                {
                                    priority: "low",
                                    title: "Expand Onboarding Automation",
                                    description: "Only 45% automated - opportunity to reduce manual work",
                                    impact: "+15% coverage",
                                },
                            ].map((recommendation, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3 p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full mt-2 ${recommendation.priority === "high"
                                            ? "bg-red-500"
                                            : recommendation.priority === "medium"
                                                ? "bg-yellow-500"
                                                : "bg-green-500"}` }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: recommendation.title }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: recommendation.impact })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: recommendation.description })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: "Implement" })] }, index))) }) })] })] }));
}
//# sourceMappingURL=AutomationMetrics.js.map