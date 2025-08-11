"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLAMonitor = SLAMonitor;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
const slaTypes = [
    {
        type: "response_time",
        description: "Initial Response",
        timeLimit: "24h",
        activeCount: 23,
        metCount: 156,
        violatedCount: 8,
        performanceRate: 95.1,
        trend: "up",
    },
    {
        type: "interview_scheduling",
        description: "Interview Scheduling",
        timeLimit: "72h",
        activeCount: 18,
        metCount: 89,
        violatedCount: 12,
        performanceRate: 88.1,
        trend: "down",
        penaltyApplied: 5,
    },
    {
        type: "feedback_delivery",
        description: "Post-Interview Feedback",
        timeLimit: "48h",
        activeCount: 12,
        metCount: 67,
        violatedCount: 6,
        performanceRate: 91.8,
        trend: "stable",
    },
    {
        type: "offer_decision",
        description: "Offer Decision",
        timeLimit: "120h",
        activeCount: 8,
        metCount: 34,
        violatedCount: 3,
        performanceRate: 91.9,
        trend: "up",
    },
];
const performanceData = [
    {
        week: "Week 1",
        responseTime: 96,
        interviewing: 89,
        feedback: 92,
        offers: 94,
    },
    {
        week: "Week 2",
        responseTime: 94,
        interviewing: 87,
        feedback: 90,
        offers: 91,
    },
    {
        week: "Week 3",
        responseTime: 97,
        interviewing: 85,
        feedback: 93,
        offers: 89,
    },
    {
        week: "Week 4",
        responseTime: 95,
        interviewing: 88,
        feedback: 92,
        offers: 92,
    },
];
const violationData = [
    { company: "TechCorp", violations: 8, penalty: 40 },
    { company: "StartupXYZ", violations: 5, penalty: 25 },
    { company: "BigTech Inc", violations: 3, penalty: 15 },
    { company: "CryptoDAO", violations: 2, penalty: 10 },
];
function SLAMonitor() {
    const [selectedPeriod, setSelectedPeriod] = (0, react_1.useState)("7d");
    const [autoEnforcement, setAutoEnforcement] = (0, react_1.useState)(true);
    const totalViolations = slaTypes.reduce((sum, sla) => sum + sla.violatedCount, 0);
    const totalPenalties = violationData.reduce((sum, item) => sum + item.penalty, 0);
    const averagePerformance = slaTypes.reduce((sum, sla) => sum + sla.performanceRate, 0) /
        slaTypes.length;
    const getTrendIcon = (trend) => {
        switch (trend) {
            case "up":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-green-600" });
            case "down":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-4 w-4 text-red-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Timer, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getPerformanceColor = (rate) => {
        if (rate >= 95)
            return "text-green-600";
        if (rate >= 85)
            return "text-yellow-600";
        return "text-red-600";
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "SLA Monitoring" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Real-time tracking of anti-ghosting enforcement" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: `h-5 w-5 ${autoEnforcement ? "text-green-600" : "text-gray-400"}` }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", children: ["Auto-Enforcement: ", autoEnforcement ? "ON" : "OFF"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1 bg-gray-100 rounded-lg p-1", children: ["24h", "7d", "30d"].map((period) => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: selectedPeriod === period ? "default" : "ghost", size: "sm", onClick: () => setSelectedPeriod(period), children: period }, period))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Overall Performance" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [averagePerformance.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "SLA compliance rate" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Active SLAs" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Timer, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: slaTypes.reduce((sum, sla) => sum + sla.activeCount, 0) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Currently monitoring" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Violations" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: totalViolations }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "This period" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Penalties Applied" }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-4 w-4 text-orange-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: totalPenalties }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Reputation points deducted" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "SLA Performance by Type" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Performance metrics for different hiring stages" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4", children: slaTypes.map((sla) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: sla.description }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: [sla.timeLimit, " limit"] }), getTrendIcon(sla.trend), sla.penaltyApplied && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "destructive", className: "text-xs", children: ["-", sla.penaltyApplied, " reputation"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Active: ", sla.activeCount] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Met: ", sla.metCount] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Violated: ", sla.violatedCount] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Performance Rate" }), (0, jsx_runtime_1.jsxs)("span", { className: `font-medium ${getPerformanceColor(sla.performanceRate)}`, children: [sla.performanceRate, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: sla.performanceRate, className: `h-2 ${sla.performanceRate >= 95
                                                        ? "bg-green-100"
                                                        : sla.performanceRate >= 85
                                                            ? "bg-yellow-100"
                                                            : "bg-red-100"}` })] })] }) }, sla.type))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Performance Trends" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "SLA compliance over time" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: performanceData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "week" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { domain: [80, 100] }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "responseTime", stroke: "#10b981", strokeWidth: 2, name: "Response Time" }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "interviewing", stroke: "#3b82f6", strokeWidth: 2, name: "Interviewing" }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "feedback", stroke: "#8b5cf6", strokeWidth: 2, name: "Feedback" }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "offers", stroke: "#f59e0b", strokeWidth: 2, name: "Offers" })] }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Violations by Company" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Companies with the most SLA violations" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: violationData, layout: "horizontal", children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { type: "number" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { dataKey: "company", type: "category", width: 80 }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "violations", fill: "#ef4444", name: "Violations" })] }) }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-600" }), "Recent SLA Violations"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Automatic penalties applied for ghosting violations" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [
                                {
                                    company: "TechCorp",
                                    violation: "Interview Scheduling",
                                    candidate: "Sarah Johnson",
                                    overdue: "6 hours",
                                    penalty: "10 reputation points",
                                    timestamp: "2 hours ago",
                                },
                                {
                                    company: "StartupXYZ",
                                    violation: "Feedback Delivery",
                                    candidate: "Mike Chen",
                                    overdue: "18 hours",
                                    penalty: "15 reputation points",
                                    timestamp: "5 hours ago",
                                },
                                {
                                    company: "BigTech Inc",
                                    violation: "Initial Response",
                                    candidate: "Emma Davis",
                                    overdue: "12 hours",
                                    penalty: "5 reputation points",
                                    timestamp: "1 day ago",
                                },
                            ].map((violation, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-red-900", children: violation.company }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "destructive", children: violation.violation })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-red-700", children: [violation.candidate, " \u2022 Overdue by ", violation.overdue] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-red-900", children: ["-", violation.penalty] }), (0, jsx_runtime_1.jsx)("div", { className: "text-red-600", children: violation.timestamp })] })] }, index))) }) })] })] }));
}
//# sourceMappingURL=SLAMonitor.js.map