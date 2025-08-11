"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceProcesses = ComplianceProcesses;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const mockProcesses = [
    {
        id: "comp_001",
        institutionName: "JPMorgan Chase",
        processType: "DeFi Transaction Monitoring",
        region: "US_SEC",
        currentStage: "real_time_analysis",
        status: "monitoring",
        progress: 98,
        timeRemaining: "Continuous",
        riskLevel: "low",
        automated: true,
        lastUpdate: "2 minutes ago",
        nextAction: "Continue monitoring",
    },
    {
        id: "comp_002",
        institutionName: "Goldman Sachs",
        processType: "AML Transaction Review",
        region: "US_SEC",
        currentStage: "investigation_required",
        status: "flagged",
        progress: 45,
        timeRemaining: "24h",
        riskLevel: "high",
        automated: false,
        lastUpdate: "15 minutes ago",
        nextAction: "Manual review required",
    },
    {
        id: "comp_003",
        institutionName: "Bank of America",
        processType: "Protocol Risk Assessment",
        region: "US_SEC",
        currentStage: "security_audit",
        status: "monitoring",
        progress: 75,
        timeRemaining: "3d 12h",
        riskLevel: "medium",
        automated: true,
        lastUpdate: "1 hour ago",
        nextAction: "Await audit completion",
    },
    {
        id: "comp_004",
        institutionName: "Wells Fargo",
        processType: "Regulatory Reporting",
        region: "US_SEC",
        currentStage: "compliance_violation",
        status: "violation",
        progress: 100,
        timeRemaining: "Immediate",
        riskLevel: "critical",
        automated: false,
        lastUpdate: "5 minutes ago",
        nextAction: "Emergency response required",
    },
];
const getStageColor = (stage) => {
    const colors = {
        real_time_analysis: "bg-blue-100 text-blue-800",
        transaction_monitoring: "bg-purple-100 text-purple-800",
        investigation_required: "bg-orange-100 text-orange-800",
        security_audit: "bg-green-100 text-green-800",
        regulatory_filing: "bg-indigo-100 text-indigo-800",
        compliance_review: "bg-yellow-100 text-yellow-800",
        compliance_violation: "bg-red-100 text-red-800",
        resolved: "bg-emerald-100 text-emerald-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
};
const getStatusIcon = (status) => {
    switch (status) {
        case "monitoring":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-blue-600" });
        case "flagged":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-orange-600" });
        case "violation":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.PauseCircle, { className: "h-4 w-4 text-red-600" });
        case "resolved":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-600" });
    }
};
const getRiskIndicator = (riskLevel) => {
    const colors = {
        low: "bg-green-500",
        medium: "bg-yellow-500",
        high: "bg-orange-500",
        critical: "bg-red-500",
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `w-3 h-3 rounded-full ${colors[riskLevel]}` }));
};
function ComplianceProcesses() {
    const [filter, setFilter] = (0, react_1.useState)("all");
    const [processes, setProcesses] = (0, react_1.useState)(mockProcesses);
    const filteredProcesses = processes.filter((process) => {
        switch (filter) {
            case "critical":
                return (process.riskLevel === "critical" || process.status === "violation");
            case "automated":
                return process.automated;
            default:
                return true;
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-6 w-6 text-blue-500" }), "Live Compliance Processes"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Real-time monitoring of institutional DeFi compliance" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "all" ? "default" : "outline", size: "sm", onClick: () => setFilter("all"), children: ["All Processes (", processes.length, ")"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "critical" ? "default" : "outline", size: "sm", onClick: () => setFilter("critical"), children: ["Critical Issues (", processes.filter((p) => p.riskLevel === "critical" || p.status === "violation").length, ")"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "automated" ? "default" : "outline", size: "sm", onClick: () => setFilter("automated"), children: ["Automated (", processes.filter((p) => p.automated).length, ")"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4", children: filteredProcesses.map((process) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: `border-l-4 transition-all duration-300 hover:shadow-md ${process.riskLevel === "critical"
                        ? "border-l-red-500 bg-red-50"
                        : process.riskLevel === "high"
                            ? "border-l-orange-500 bg-orange-50"
                            : process.riskLevel === "medium"
                                ? "border-l-yellow-500 bg-yellow-50"
                                : "border-l-green-500 bg-green-50"}`, children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: process.institutionName }), process.automated && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-3 w-3 mr-1" }), "Auto"] })), getRiskIndicator(process.riskLevel)] }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-4 w-4" }), process.region] }), (0, jsx_runtime_1.jsx)("span", { children: process.processType })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getStatusIcon(process.status), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getStageColor(process.currentStage), children: process.currentStage.replace("_", " ") })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "pt-0 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Compliance Progress" }), (0, jsx_runtime_1.jsx)("span", { className: `font-medium ${process.status === "violation"
                                                        ? "text-red-600"
                                                        : "text-gray-600"}`, children: process.timeRemaining })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: process.progress, className: `h-2 ${process.riskLevel === "critical"
                                                ? "bg-red-100"
                                                : process.riskLevel === "high"
                                                    ? "bg-orange-100"
                                                    : process.riskLevel === "medium"
                                                        ? "bg-yellow-100"
                                                        : "bg-green-100"}` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: process.nextAction })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [process.status === "violation" && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "destructive", children: "Resolve Violation" })), process.status === "monitoring" && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: "View Details" })), process.status === "flagged" && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "secondary", children: "Investigate" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Last updated: ", process.lastUpdate] })] })] }, process.id))) }), filteredProcesses.length === 0 && ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), (0, jsx_runtime_1.jsx)("p", { children: "No compliance processes match the current filter." })] }) }) }))] }));
}
//# sourceMappingURL=ComplianceProcesses.js.map