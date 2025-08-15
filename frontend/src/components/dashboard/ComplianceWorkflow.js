"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceWorkflow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const ComplianceWorkflow = () => {
    const [selectedInstitution, setSelectedInstitution] = (0, react_1.useState)("inst_001");
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(true);
    const workflowSteps = [
        {
            id: "transaction_ingestion",
            title: "Transaction Data Ingestion",
            description: "Real-time capture and normalization of DeFi transaction data",
            status: "completed",
            progress: 100,
            duration: "< 1s",
            automation: "Fully Automated",
            icon: lucide_react_1.Database,
            details: [
                "Multi-blockchain transaction monitoring",
                "Protocol-specific data extraction",
                "Transaction metadata enrichment",
                "Real-time streaming pipeline",
            ],
            riskLevel: "low",
        },
        {
            id: "initial_screening",
            title: "AI-Powered Risk Screening",
            description: "Machine learning algorithms analyze transactions for compliance risks",
            status: "completed",
            progress: 100,
            duration: "0.3s",
            automation: "AI Automated",
            icon: lucide_react_1.Bot,
            details: [
                "Pattern recognition algorithms",
                "Anomaly detection models",
                "Risk scoring calculations",
                "Historical data correlation",
            ],
            riskLevel: "low",
        },
        {
            id: "regulatory_mapping",
            title: "Regulatory Framework Mapping",
            description: "Map transactions to applicable regulatory requirements",
            status: "completed",
            progress: 100,
            duration: "0.5s",
            automation: "Rule-Based",
            icon: lucide_react_1.Gavel,
            details: [
                "Jurisdiction identification",
                "Applicable regulations mapping",
                "Compliance requirement matching",
                "Cross-border regulation analysis",
            ],
            riskLevel: "low",
        },
        {
            id: "aml_kyc_check",
            title: "AML/KYC Compliance Check",
            description: "Anti-money laundering and know-your-customer validation",
            status: "active",
            progress: 75,
            duration: "2.1s",
            automation: "Hybrid AI + Manual",
            icon: lucide_react_1.Shield,
            details: [
                "Sanctions list screening",
                "PEP (Politically Exposed Person) checks",
                "Source of funds analysis",
                "Beneficial ownership verification",
            ],
            riskLevel: "medium",
        },
        {
            id: "protocol_analysis",
            title: "Protocol Security Analysis",
            description: "Deep analysis of smart contracts and protocol mechanics",
            status: "active",
            progress: 45,
            duration: "5.8s",
            automation: "AI + Expert Review",
            icon: lucide_react_1.Search,
            details: [
                "Smart contract vulnerability scanning",
                "Protocol mechanism review",
                "Liquidity risk assessment",
                "Governance token analysis",
            ],
            riskLevel: "high",
        },
        {
            id: "reporting_generation",
            title: "Compliance Report Generation",
            description: "Automated generation of regulatory compliance reports",
            status: "pending",
            progress: 0,
            duration: "3.0s",
            automation: "Template-Based",
            icon: lucide_react_1.FileText,
            details: [
                "Regulatory report templates",
                "Custom formatting per jurisdiction",
                "Audit trail documentation",
                "Executive summary generation",
            ],
            riskLevel: "low",
        },
        {
            id: "stakeholder_notification",
            title: "Stakeholder Notification",
            description: "Notify relevant parties of compliance status and actions required",
            status: "pending",
            progress: 0,
            duration: "1.0s",
            automation: "Conditional Logic",
            icon: lucide_react_1.Bell,
            details: [
                "Risk-based alerting",
                "Stakeholder role mapping",
                "Escalation procedures",
                "Communication templates",
            ],
            riskLevel: "medium",
        },
        {
            id: "continuous_monitoring",
            title: "Continuous Monitoring",
            description: "Ongoing surveillance of approved protocols and transactions",
            status: "pending",
            progress: 0,
            duration: "Ongoing",
            automation: "Fully Automated",
            icon: lucide_react_1.Eye,
            details: [
                "Real-time monitoring dashboard",
                "Threshold-based alerts",
                "Behavioral pattern analysis",
                "Performance metric tracking",
            ],
            riskLevel: "low",
        },
    ];
    const mockInstitutions = [
        {
            id: "inst_001",
            name: "JPMorgan Chase & Co.",
            type: "Investment Bank",
            currentProcess: "Protocol Security Analysis",
            compliance: 94.2,
        },
        {
            id: "inst_002",
            name: "Goldman Sachs Group",
            type: "Investment Bank",
            currentProcess: "AML/KYC Compliance Check",
            compliance: 87.6,
        },
        {
            id: "inst_003",
            name: "Bank of America Corp",
            type: "Commercial Bank",
            currentProcess: "Continuous Monitoring",
            compliance: 96.8,
        },
    ];
    const getStepIcon = (step) => {
        const IconComponent = step.icon;
        return (0, jsx_runtime_1.jsx)(IconComponent, { className: "h-5 w-5" });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600 bg-green-100";
            case "active":
                return "text-blue-600 bg-blue-100";
            case "pending":
                return "text-gray-600 bg-gray-100";
            case "blocked":
                return "text-red-600 bg-red-100";
            case "flagged":
                return "text-orange-600 bg-orange-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case "low":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "high":
                return "bg-orange-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
            case "active":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-600 animate-spin" });
            case "pending":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-600" });
            case "blocked":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-600" });
            case "flagged":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-orange-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const currentStep = workflowSteps.find((step) => step.status === "active");
    const completedSteps = workflowSteps.filter((step) => step.status === "completed").length;
    const totalSteps = workflowSteps.length;
    const overallProgress = (completedSteps / totalSteps) * 100;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-6 w-6 text-blue-600" }), "Compliance Workflow Visualization"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: "Real-time view of institutional DeFi compliance processes" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("select", { value: selectedInstitution, onChange: (e) => setSelectedInstitution(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium", children: mockInstitutions.map((inst) => ((0, jsx_runtime_1.jsx)("option", { value: inst.id, children: inst.name }, inst.id))) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: isPlaying ? "outline" : "default", size: "sm", onClick: () => setIsPlaying(!isPlaying), className: "font-medium", children: isPlaying ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-4 w-4 mr-2" }), "Pause"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4 mr-2" }), "Resume"] })) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-l-4 border-l-blue-500", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-5 w-5 text-blue-600" }), mockInstitutions.find((i) => i.id === selectedInstitution)
                                                    ?.name] }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { children: [mockInstitutions.find((i) => i.id === selectedInstitution)
                                                    ?.type, " ", "\u2022 Currently:", " ", mockInstitutions.find((i) => i.id === selectedInstitution)
                                                    ?.currentProcess] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-semibold text-blue-600", children: [mockInstitutions.find((i) => i.id === selectedInstitution)
                                                    ?.compliance, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Compliance Score" })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Overall Progress" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600", children: [completedSteps, "/", totalSteps, " steps completed"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: overallProgress, className: "h-3" }), currentStep && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Currently processing: ", (0, jsx_runtime_1.jsx)("strong", { children: currentStep.title })] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-500", children: ["\u2022 ETA: ", currentStep.duration] })] }))] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-4", children: workflowSteps.map((step, index) => ((0, jsx_runtime_1.jsx)(card_1.Card, { className: `transition-all duration-300 hover:shadow-md ${step.status === "active" ? "ring-2 ring-blue-500 shadow-lg" : ""}`, children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`, children: step.status === "completed" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-600" })) : (getStepIcon(step)) }), index < workflowSteps.length - 1 && ((0, jsx_runtime_1.jsx)("div", { className: `w-0.5 h-16 mt-2 ${step.status === "completed"
                                                ? "bg-green-300"
                                                : "bg-gray-200"}` }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900", children: step.title }), step.riskLevel && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${getRiskColor(step.riskLevel)}` }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-600 uppercase font-medium", children: [step.riskLevel, " risk"] })] })), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: `${getStatusColor(step.status)} border font-medium`, children: [getStatusIcon(step.status), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 capitalize", children: step.status })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm", children: step.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right ml-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-900", children: step.duration }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: step.automation })] })] }), step.progress > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs text-gray-600 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { children: [step.progress, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: step.progress, className: `h-2 ${step.status === "active"
                                                        ? "bg-blue-100"
                                                        : "bg-gray-100"}` })] })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2 mt-3", children: step.details.map((detail, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-3 w-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { children: detail })] }, idx))) })] })] }) }) }, step.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Average Processing Time" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-semibold text-blue-600", children: "12.7s" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Per transaction" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Automation Rate" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-semibold text-green-600", children: "94.2%" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Fully automated steps" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Success Rate" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-semibold text-purple-600", children: "99.1%" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Compliance validation" })] })] })] })] }));
};
exports.ComplianceWorkflow = ComplianceWorkflow;
//# sourceMappingURL=ComplianceWorkflow.js.map