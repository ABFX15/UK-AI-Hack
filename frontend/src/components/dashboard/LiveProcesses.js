"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveProcesses = LiveProcesses;
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
        institutionName: "JPMorgan Chase & Co.",
        processType: "Real-time Protocol Monitoring",
        region: "US/SEC",
        currentStage: "Active Surveillance",
        status: "monitoring",
        progress: 98,
        timeRemaining: "Continuous",
        riskLevel: "low",
        automated: true,
        lastUpdate: "2 minutes ago",
        nextAction: "Continue real-time monitoring",
        protocolsMonitored: 15,
        transactionsAnalyzed: 2847,
        complianceScore: 94.5,
    },
    {
        id: "comp_002",
        institutionName: "Goldman Sachs Group Inc.",
        processType: "AML Compliance Review",
        region: "US/CFTC",
        currentStage: "Transaction Investigation",
        status: "flagged",
        progress: 65,
        timeRemaining: "18h 30m",
        riskLevel: "high",
        automated: false,
        lastUpdate: "12 minutes ago",
        nextAction: "Manual review of flagged transactions",
        protocolsMonitored: 8,
        transactionsAnalyzed: 156,
        complianceScore: 76.2,
    },
    {
        id: "comp_003",
        institutionName: "Bank of America Corp.",
        processType: "Protocol Security Assessment",
        region: "US/OCC",
        currentStage: "Smart Contract Audit",
        status: "investigating",
        progress: 45,
        timeRemaining: "2d 14h",
        riskLevel: "medium",
        automated: true,
        lastUpdate: "1 hour ago",
        nextAction: "Await security audit results",
        protocolsMonitored: 12,
        transactionsAnalyzed: 934,
        complianceScore: 87.8,
    },
    {
        id: "comp_004",
        institutionName: "Wells Fargo & Company",
        processType: "Regulatory Violation Response",
        region: "US/FINRA",
        currentStage: "Emergency Protocol",
        status: "violation",
        progress: 100,
        timeRemaining: "IMMEDIATE",
        riskLevel: "critical",
        automated: false,
        lastUpdate: "3 minutes ago",
        nextAction: "Executive escalation required",
        protocolsMonitored: 3,
        transactionsAnalyzed: 45,
        complianceScore: 32.1,
    },
];
const getStageColor = (stage) => {
    const colors = {
        "Active Surveillance": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg",
        "Transaction Investigation": "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
        "Smart Contract Audit": "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg",
        "Emergency Protocol": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse",
        "Multi-Jurisdictional Review": "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg",
        "Compliance Assessment": "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",
    };
    return (colors[stage] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white");
};
const getStatusIcon = (status) => {
    switch (status) {
        case "monitoring":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5 text-blue-500" });
        case "flagged":
            return ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-amber-500 animate-bounce" }));
        case "violation":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-5 w-5 text-red-500 animate-ping" });
        case "investigating":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5 text-purple-500 animate-spin" });
        case "resolved":
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-emerald-500" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-gray-500" });
    }
};
const getRiskBadge = (riskLevel) => {
    const styles = {
        low: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-300 shadow-sm",
        medium: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-300 shadow-sm",
        high: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300 shadow-sm animate-pulse",
        critical: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-lg animate-pulse",
    };
    return ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: `${styles[riskLevel]} font-semibold px-3 py-1 text-xs uppercase tracking-wider`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-3 w-3 mr-1" }), riskLevel, " RISK"] }));
};
function LiveProcesses() {
    const [filter, setFilter] = (0, react_1.useState)("all");
    const [processes, setProcesses] = (0, react_1.useState)(mockProcesses);
    const filteredProcesses = processes.filter((process) => {
        switch (filter) {
            case "critical":
                return (process.riskLevel === "critical" || process.status === "violation");
            case "active":
                return (process.status === "monitoring" || process.status === "investigating");
            case "violations":
                return process.status === "violation" || process.status === "flagged";
            default:
                return true;
        }
    });
    const criticalCount = processes.filter((p) => p.riskLevel === "critical" || p.status === "violation").length;
    const activeCount = processes.filter((p) => p.status === "monitoring" || p.status === "investigating").length;
    const violationCount = processes.filter((p) => p.status === "violation" || p.status === "flagged").length;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-4xl font-bold mb-2 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-white/20 rounded-2xl backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-8 w-8" }) }), "Live Compliance Processes"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-blue-100 font-medium", children: "Real-time monitoring of institutional DeFi compliance activities" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3 text-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: "Live Updates" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-2xl p-6 shadow-xl border border-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "all" ? "default" : "outline", size: "lg", className: `${filter === "all"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                                : "hover:bg-gray-50"} font-semibold px-6 py-3 rounded-xl transition-all duration-300`, onClick: () => setFilter("all"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-5 w-5 mr-2" }), "All Processes", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "ml-3 bg-white/30 text-current border-0", children: processes.length })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "critical" ? "destructive" : "outline", size: "lg", className: `${filter === "critical"
                                ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
                                : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"} font-semibold px-6 py-3 rounded-xl transition-all duration-300`, onClick: () => setFilter("critical"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 mr-2" }), "Critical Issues", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `ml-3 ${filter === "critical" ? "bg-white/30" : "bg-red-100"} text-current border-0`, children: criticalCount })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "active" ? "default" : "outline", size: "lg", className: `${filter === "active"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                                : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"} font-semibold px-6 py-3 rounded-xl transition-all duration-300`, onClick: () => setFilter("active"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5 mr-2" }), "Active Monitoring", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `ml-3 ${filter === "active" ? "bg-white/30" : "bg-emerald-100"} text-current border-0`, children: activeCount })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: filter === "violations" ? "destructive" : "outline", size: "lg", className: `${filter === "violations"
                                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
                                : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"} font-semibold px-6 py-3 rounded-xl transition-all duration-300`, onClick: () => setFilter("violations"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-5 w-5 mr-2" }), "Violations", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: `ml-3 ${filter === "violations" ? "bg-white/30" : "bg-orange-100"} text-current border-0`, children: violationCount })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-6", children: filteredProcesses.map((process) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: `h-2 ${process.status === "violation"
                                ? "bg-gradient-to-r from-red-500 to-pink-500"
                                : process.status === "flagged"
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                    : process.status === "investigating"
                                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                        : "bg-gradient-to-r from-blue-500 to-cyan-500"}` }), (0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl", children: getStatusIcon(process.status) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-2xl font-bold text-gray-900 mb-1", children: process.institutionName }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [process.automated && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 font-semibold px-3 py-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4 mr-1" }), "AI Automated"] })), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `${getStageColor(process.currentStage)} font-semibold px-4 py-2 text-sm`, children: process.currentStage })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2 font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5 text-blue-500" }), process.processType] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2 font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-5 w-5 text-indigo-500" }), process.region] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: getRiskBadge(process.riskLevel) })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-blue-600 mb-1", children: process.protocolsMonitored }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-blue-700", children: "Protocols Monitored" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-emerald-600 mb-1", children: process.transactionsAnalyzed.toLocaleString() }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-emerald-700", children: "Transactions Analyzed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-3xl font-bold text-purple-600 mb-1", children: [process.complianceScore, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-purple-700", children: "Compliance Score" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Timer, { className: "h-5 w-5 text-blue-500" }), "Process Status"] }), (0, jsx_runtime_1.jsx)("span", { className: `text-lg font-bold px-4 py-2 rounded-full ${process.status === "violation"
                                                        ? "bg-red-100 text-red-700"
                                                        : process.status === "flagged"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-blue-100 text-blue-700"}`, children: process.timeRemaining })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: process.progress, className: `h-4 ${process.status === "violation"
                                                ? "bg-red-200"
                                                : process.status === "flagged"
                                                    ? "bg-amber-200"
                                                    : "bg-blue-200"}` }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right mt-2 text-sm font-medium text-gray-600", children: [process.progress, "% Complete"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-5 w-5 text-indigo-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-500 uppercase tracking-wide", children: "Next Action" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold text-gray-900", children: process.nextAction })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [process.status === "violation" && ((0, jsx_runtime_1.jsxs)(button_1.Button, { className: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-4 w-4 mr-2" }), "Escalate Now"] })), process.status === "flagged" && ((0, jsx_runtime_1.jsxs)(button_1.Button, { className: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4 mr-2" }), "Investigate"] })), (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 mr-2" }), "View Details"] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" }), "Last updated: ", (0, jsx_runtime_1.jsx)("strong", { children: process.lastUpdate })] }), (0, jsx_runtime_1.jsxs)("span", { className: "font-mono bg-white px-3 py-1 rounded-lg border", children: ["ID: ", process.id] })] })] })] }, process.id))) }), filteredProcesses.length === 0 && ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "border-dashed border-2 border-gray-300", children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "py-16 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 text-blue-600" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "No compliance processes found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-lg max-w-md mx-auto", children: filter === "critical"
                                ? "Excellent! No critical issues detected. All processes are operating within acceptable risk parameters."
                                : "Try adjusting your filters to see more compliance processes." })] }) }))] }));
}
//# sourceMappingURL=LiveProcesses.js.map