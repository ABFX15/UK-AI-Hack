"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MultiAgentDemo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function MultiAgentDemo() {
    const [agents, setAgents] = (0, react_1.useState)({});
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [analysisResult, setAnalysisResult] = (0, react_1.useState)(null);
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const [currentRequest, setCurrentRequest] = (0, react_1.useState)("Should JPMorgan invest $500M in Aave for Q4 2025?");
    const [liveAnalysis, setLiveAnalysis] = (0, react_1.useState)({});
    const messagesEndRef = (0, react_1.useRef)(null);
    const statusInterval = (0, react_1.useRef)(null);
    // Example requests for user to try
    const exampleRequests = [
        "Should JPMorgan invest $500M in Aave for Q4 2025?",
        "Is Compound safe for $200M institutional deposit?",
        "Should BlackRock allocate 5% portfolio to Uniswap LP?",
        "Can Deutsche Bank deploy $1B in MakerDAO vaults?",
    ];
    // Steps in the analysis process
    const analysisSteps = [
        {
            step: 0,
            title: "Ready",
            description: "Enter your institutional DeFi investment question",
        },
        {
            step: 1,
            title: "Research Phase",
            description: "AI agents analyzing protocols and market conditions",
        },
        {
            step: 2,
            title: "Risk Assessment",
            description: "Comprehensive risk evaluation in progress",
        },
        {
            step: 3,
            title: "Compliance Check",
            description: "Regulatory compliance verification",
        },
        {
            step: 4,
            title: "Agent Collaboration",
            description: "AI agents discussing findings and recommendations",
        },
        {
            step: 5,
            title: "Strategy Formation",
            description: "Creating investment execution strategy",
        },
        {
            step: 6,
            title: "Analysis Complete",
            description: "Investment recommendation ready",
        },
    ];
    // Agent status colors and icons
    const getAgentStatusColor = (status) => {
        switch (status) {
            case "idle":
                return "bg-gray-100 text-gray-600";
            case "researching":
                return "bg-blue-100 text-blue-700 animate-pulse";
            case "analyzing":
                return "bg-purple-100 text-purple-700 animate-pulse";
            case "collaborating":
                return "bg-orange-100 text-orange-700 animate-pulse";
            case "executing":
                return "bg-green-100 text-green-700 animate-pulse";
            case "completed":
                return "bg-emerald-100 text-emerald-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    const getAgentIcon = (agent_id) => {
        switch (agent_id) {
            case "research_agent":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-5 w-5" });
            case "risk_agent":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5" });
            case "regulatory_agent":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" });
            case "execution_agent":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5" });
            case "coordinator_agent":
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-5 w-5" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5" });
        }
    };
    // Update analysis step based on agent progress
    (0, react_1.useEffect)(() => {
        if (!isRunning)
            return;
        const agentList = Object.values(agents);
        const completedAgents = agentList.filter((a) => a.status === "completed").length;
        const researchingAgents = agentList.filter((a) => a.status === "researching").length;
        const analyzingAgents = agentList.filter((a) => a.status === "analyzing").length;
        const collaboratingAgents = agentList.filter((a) => a.status === "collaborating").length;
        const executingAgents = agentList.filter((a) => a.status === "executing").length;
        if (executingAgents > 0)
            setCurrentStep(5);
        else if (collaboratingAgents > 0)
            setCurrentStep(4);
        else if (analyzingAgents > 0)
            setCurrentStep(3);
        else if (researchingAgents > 0)
            setCurrentStep(2);
        else if (completedAgents === agentList.length && agentList.length > 0)
            setCurrentStep(6);
        else if (isRunning)
            setCurrentStep(1);
    }, [agents, isRunning]);
    // Auto-scroll messages
    (0, react_1.useEffect)(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    // Fetch real-time status
    const fetchAgentStatus = async () => {
        try {
            const response = await fetch("http://localhost:8001/demo/agents/status");
            if (response.ok) {
                const data = await response.json();
                setAgents(data.agents || {});
                setMessages(data.collaboration_log || []);
                // Update live analysis data
                const analysis = {};
                Object.values(data.agents || {}).forEach((agent) => {
                    if (agent.findings && Object.keys(agent.findings).length > 0) {
                        analysis[agent.agent_id] = agent.findings;
                    }
                });
                setLiveAnalysis(analysis);
            }
        }
        catch (error) {
            console.log("Status fetch error:", error);
        }
    };
    // Start analysis
    const startAnalysis = async () => {
        setIsRunning(true);
        setCurrentStep(1);
        setAnalysisResult(null);
        setMessages([]);
        setLiveAnalysis({});
        // Reset agents first
        try {
            await fetch("http://localhost:8001/demo/agents/reset", {
                method: "POST",
            });
        }
        catch (error) {
            console.log("Reset error:", error);
        }
        // Start real-time status updates
        statusInterval.current = setInterval(fetchAgentStatus, 500);
        try {
            const response = await fetch("http://localhost:8001/demo/institutional-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    request: currentRequest,
                    institution_id: "institutional_client_001",
                }),
            });
            if (response.ok) {
                const result = await response.json();
                // Transform the result to match our new interface
                const analysisResult = {
                    analysis_id: result.result.demo_id,
                    original_request: result.result.original_request,
                    execution_time: result.result.execution_time,
                    final_decision: result.result.final_decision,
                    financial_impact: result.result.financial_impact,
                    key_insights: result.result.demo_highlights || [],
                    regulatory_highlights: result.result.judge_wow_factors || [],
                };
                setAnalysisResult(analysisResult);
                setCurrentStep(6);
            }
            else {
                console.error("Analysis failed:", await response.text());
            }
        }
        catch (error) {
            console.error("Analysis error:", error);
        }
        finally {
            setIsRunning(false);
            if (statusInterval.current) {
                clearInterval(statusInterval.current);
            }
            // Final status fetch
            setTimeout(fetchAgentStatus, 1000);
        }
    };
    // Reset analysis
    const resetAnalysis = async () => {
        setIsRunning(false);
        setCurrentStep(0);
        setAnalysisResult(null);
        setMessages([]);
        setAgents({});
        setLiveAnalysis({});
        if (statusInterval.current) {
            clearInterval(statusInterval.current);
        }
        try {
            await fetch("http://localhost:8001/demo/agents/reset", {
                method: "POST",
            });
            await fetchAgentStatus();
        }
        catch (error) {
            console.log("Reset error:", error);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 right-4", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/dashboard", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4 mr-2" }), "View Dashboard", (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-4 w-4 ml-2" })] }) }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold mb-4", children: "\uD83E\uDD16 AI-Powered DeFi Compliance Platform" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-blue-100 mb-6", children: "Advanced multi-agent AI system for institutional DeFi investment analysis and regulatory compliance" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: currentRequest, onChange: (e) => setCurrentRequest(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg text-lg min-w-[400px] text-gray-800", placeholder: "Enter institutional investment request...", disabled: isRunning }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: startAnalysis, disabled: isRunning, size: "lg", className: "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-5 w-5 mr-2" }), isRunning ? "Analyzing..." : "Start Analysis"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: resetAnalysis, variant: "outline", size: "lg", className: "bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-800 backdrop-blur-sm transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "h-5 w-5 mr-2" }), "Reset"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "h-[600px] border-slate-200 shadow-sm", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "bg-slate-50 border-b", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6" }), "AI Agent Status"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Real-time monitoring of intelligent agents" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4 p-4", children: Object.values(agents).map((agent) => ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg p-4 bg-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-100 rounded-lg", children: getAgentIcon(agent.agent_id) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: agent.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: agent.specialization })] })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getAgentStatusColor(agent.status), children: agent.status.toUpperCase() })] }), agent.current_task && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700 mb-1", children: agent.current_task }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: agent.progress, className: "h-2" })] })), agent.confidence_level > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4" }), "Confidence: ", (agent.confidence_level * 100).toFixed(1), "%"] })), agent.conversation_history.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-2 bg-slate-50 rounded text-xs", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Latest Update:" }), " ", agent.conversation_history[agent.conversation_history.length - 1]] }))] }, agent.agent_id))) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "h-[350px] border-slate-200 shadow-sm", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "bg-slate-50 border-b", children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "h-5 w-5" }), "Agent Communication"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "h-[250px] p-4 overflow-y-auto bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: messages.map((message, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "border-l-4 border-blue-200 pl-3 py-2 bg-slate-50 rounded-r", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-500 mb-1", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: message.from_agent.replace("_", " ") }), "\u2192", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: message.to_agent.replace("_", " ") })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: message.content })] }, idx))) }), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }) })] }), analysisResult && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-emerald-200 bg-emerald-50", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-emerald-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5" }), "Analysis Complete"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-emerald-700", children: analysisResult.execution_time }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-emerald-600", children: "Processing Time" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-emerald-700", children: analysisResult.financial_impact.investment_amount }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-emerald-600", children: "Investment Amount" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-emerald-800", children: "Key Insights:" }), analysisResult.key_insights.map((insight, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lightbulb, { className: "h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-emerald-700", children: insight })] }, idx)))] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-4 bg-white rounded-lg border border-emerald-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Investment Decision:" }), " ", analysisResult.final_decision] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Expected Annual Yield:" }), " ", analysisResult.financial_impact.estimated_annual_yield] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Risk Assessment:" }), " ", analysisResult.financial_impact.risk_level] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Compliance Status:" }), " ", analysisResult.financial_impact.compliance_status] })] }) })] })] }))] })] })] }) }));
}
//# sourceMappingURL=MultiAgentDemo.js.map