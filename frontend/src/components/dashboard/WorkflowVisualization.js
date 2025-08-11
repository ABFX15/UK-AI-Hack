"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowVisualization = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const WorkflowVisualization = () => {
    const [selectedJob, setSelectedJob] = (0, react_1.useState)("job_001");
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const workflowSteps = [
        {
            id: "job_creation",
            title: "Job Posted & AI Optimized",
            description: "AI optimizes job description for Web3 talent attraction",
            status: "completed",
            progress: 100,
            duration: "2 min",
            automation: "AI + Smart Contract",
            icon: lucide_react_1.Target,
            details: [
                "Smart contract creates SLA with automatic deadlines",
                "AI extracts skills and requirements",
                "Circle Layer reputation stakes locked",
                "Skill weight matrix generated (Solidity: 40%, React: 30%)",
            ],
        },
        {
            id: "candidate_discovery",
            title: "AI Candidate Discovery",
            description: "Multi-source intelligent candidate finding across platforms",
            status: "completed",
            progress: 100,
            duration: "15 min",
            automation: "AI Web Scraping",
            icon: lucide_react_1.Search,
            details: [
                "GitHub: 47 candidates analyzed",
                "LinkedIn: 23 profiles scraped",
                "Web3 communities: 12 found",
                "Blockchain activity verified for all",
            ],
        },
        {
            id: "verification",
            title: "Scam Detection & Verification",
            description: "AI verifies real candidates, blocks fake profiles",
            status: "completed",
            progress: 100,
            duration: "8 min",
            automation: "AI + Blockchain",
            icon: lucide_react_1.Shield,
            details: [
                "Fake profile detection: 99.2% accuracy",
                "Cross-platform verification completed",
                "Real contribution analysis: 82 candidates verified",
                "3 fake profiles blocked automatically",
            ],
        },
        {
            id: "scoring",
            title: "Smart Scoring & Ranking",
            description: "AI scores candidates on multiple dimensions",
            status: "completed",
            progress: 100,
            duration: "5 min",
            automation: "ML Algorithm",
            icon: lucide_react_1.TrendingUp,
            details: [
                "Technical Skills (35%): GitHub analysis",
                "Experience Match (25%): 5+ years average",
                "Reputation Score (20%): Circle Layer verified",
                "Top 12 candidates ranked and ready",
            ],
        },
        {
            id: "outreach",
            title: "Automated Personalized Outreach",
            description: "AI sends custom messages based on GitHub projects",
            status: "active",
            progress: 75,
            duration: "2 hours",
            automation: "AI Communication",
            icon: lucide_react_1.MessageSquare,
            details: [
                "Personalized messages sent to top 12 candidates",
                "9 responses received (75% response rate)",
                "6 interested, 2 need more info, 1 not available",
                "Auto follow-ups scheduled for 2 unclear responses",
            ],
        },
        {
            id: "scheduling",
            title: "Smart Interview Scheduling",
            description: "Automatic calendar coordination and SLA creation",
            status: "active",
            progress: 50,
            duration: "1 day",
            automation: "Calendar AI + SLAs",
            icon: lucide_react_1.Calendar,
            details: [
                "6 candidates confirmed for interviews",
                "Smart calendar scheduling in progress",
                "SLA contracts created for each interview",
                "Anti-ghosting penalties activated",
            ],
        },
        {
            id: "interviews",
            title: "Interview Process Automation",
            description: "Automated reminders, feedback collection, and analysis",
            status: "pending",
            progress: 0,
            duration: "3 days",
            automation: "AI + Notifications",
            icon: lucide_react_1.Users,
            details: [
                "Automated interview reminders scheduled",
                "Real-time feedback collection system ready",
                "AI sentiment analysis prepared",
                "Next steps automation configured",
            ],
        },
        {
            id: "decision",
            title: "AI-Assisted Decision Making",
            description: "Aggregate data and predict hiring success",
            status: "pending",
            progress: 0,
            duration: "1 day",
            automation: "Predictive AI",
            icon: lucide_react_1.Bot,
            details: [
                "Data aggregation from all sources",
                "Success prediction model ready",
                "Historical hiring pattern analysis",
                "Risk assessment and recommendations",
            ],
        },
        {
            id: "offer",
            title: "Automated Offer & Negotiation",
            description: "Smart contract escrow and negotiation handling",
            status: "pending",
            progress: 0,
            duration: "2 days",
            automation: "Smart Contracts",
            icon: lucide_react_1.CheckCircle,
            details: [
                "Smart contract escrow prepared",
                "Salary negotiation parameters set",
                "Circle Layer reputation tracking active",
                "Anti-ghosting protection enabled",
            ],
        },
    ];
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-600" });
            case "active":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-blue-600 animate-pulse" });
            case "blocked":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-gray-400" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "border-green-200 bg-green-50";
            case "active":
                return "border-blue-200 bg-blue-50";
            case "blocked":
                return "border-red-200 bg-red-50";
            default:
                return "border-gray-200 bg-gray-50";
        }
    };
    const currentStep = workflowSteps.find((step) => step.status === "active");
    const completedSteps = workflowSteps.filter((step) => step.status === "completed").length;
    const totalProgress = (completedSteps / workflowSteps.length) * 100;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6 text-blue-600" }), "Complete Workflow Automation"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "End-to-end AI-powered recruitment with blockchain enforcement" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setIsPlaying(!isPlaying), className: "flex items-center gap-2", children: [isPlaying ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4" })), isPlaying ? "Pause" : "Play", " Demo"] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "bg-blue-100 text-blue-700", children: "Live Job: Senior Solidity Developer" })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Overall Progress" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: [completedSteps, "/", workflowSteps.length, " steps completed"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: totalProgress, className: "h-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { children: "4 steps completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "2 steps active" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4 text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { children: "3 steps remaining" })] })] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: workflowSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: `transition-all duration-200 ${getStatusColor(step.status)}`, children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-current", children: getStatusIcon(step.status) }), index < workflowSteps.length - 1 && ((0, jsx_runtime_1.jsx)("div", { className: `w-0.5 h-12 mt-2 ${step.status === "completed"
                                                    ? "bg-green-300"
                                                    : "bg-gray-300"}` }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-lg", children: step.title }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: step.automation })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: step.duration }), step.status === "active" && ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4 text-blue-600 animate-pulse" }))] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-700", children: step.description }), step.progress > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { children: [step.progress, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: step.progress, className: "h-1.5" })] })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: step.details.map((detail, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-1.5 h-1.5 bg-current rounded-full opacity-60" }), detail] }, i))) })] })] }) }) }, step.id));
                }) }), currentStep && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-blue-200 bg-blue-50", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 animate-pulse" }), "Currently Active: ", currentStep.title] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-blue-700", children: currentStep.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Progress:" }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: currentStep.progress, className: "w-32 h-2" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm", children: [currentStep.progress, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "ETA:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: currentStep.duration })] })] })] }) })] })), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "\uD83D\uDE80 Workflow Benefits" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "95%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-700", children: "SLA Compliance" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "vs 40% industry avg" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "7 days" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-700", children: "Avg Hire Time" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "vs 90 days industry avg" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-purple-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: "99%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-purple-700", children: "Fake Detection" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "AI-powered verification" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-orange-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: "80%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-orange-700", children: "Cost Reduction" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "vs traditional methods" })] })] }) })] })] }));
};
exports.WorkflowVisualization = WorkflowVisualization;
//# sourceMappingURL=WorkflowVisualization.js.map