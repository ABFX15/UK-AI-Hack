"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Activity,
  Sparkles,
  Play,
  RotateCcw,
  DollarSign,
  Clock,
  Users,
  Database,
  Target,
  Layers,
  ArrowRight,
  FileText,
  BarChart3,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Agent {
  agent_id: string;
  name: string;
  specialization: string;
  status: string;
  current_task: string;
  progress: number;
  confidence_level: number;
  conversation_history?: string[];
  findings: Record<string, unknown>;
}

interface AgentMessage {
  from_agent: string;
  to_agent: string;
  message_type: string;
  content: string;
  timestamp: string;
}

interface AnalysisResult {
  analysis_id: string;
  original_request: string;
  execution_time: string;
  final_decision: string;
  financial_impact: {
    investment_amount: string;
    estimated_annual_yield: string;
    risk_level: string;
    compliance_status: string;
  };
  key_insights: string[];
  regulatory_highlights: string[];
}

export default function MultiAgentDemo() {
  const [agents, setAgents] = useState<Record<string, Agent>>({});
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRequest, setCurrentRequest] = useState(
    "Should JPMorgan invest $500M in Aave for Q4 2025?"
  );
  const [liveAnalysis, setLiveAnalysis] = useState<Record<string, unknown>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusInterval = useRef<NodeJS.Timeout | null>(null);

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
  const getAgentStatusColor = (status: string) => {
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

  const getAgentIcon = (agent_id: string) => {
    switch (agent_id) {
      case "research_agent":
        return <BarChart3 className="h-5 w-5" />;
      case "risk_agent":
        return <AlertTriangle className="h-5 w-5" />;
      case "regulatory_agent":
        return <Shield className="h-5 w-5" />;
      case "execution_agent":
        return <Zap className="h-5 w-5" />;
      case "coordinator_agent":
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  // Update analysis step based on agent progress
  useEffect(() => {
    if (!isRunning) return;

    const agentList = Object.values(agents);
    const completedAgents = agentList.filter(
      (a) => a.status === "completed"
    ).length;
    const researchingAgents = agentList.filter(
      (a) => a.status === "researching"
    ).length;
    const analyzingAgents = agentList.filter(
      (a) => a.status === "analyzing"
    ).length;
    const collaboratingAgents = agentList.filter(
      (a) => a.status === "collaborating"
    ).length;
    const executingAgents = agentList.filter(
      (a) => a.status === "executing"
    ).length;

    if (executingAgents > 0) setCurrentStep(5);
    else if (collaboratingAgents > 0) setCurrentStep(4);
    else if (analyzingAgents > 0) setCurrentStep(3);
    else if (researchingAgents > 0) setCurrentStep(2);
    else if (completedAgents === agentList.length && agentList.length > 0)
      setCurrentStep(6);
    else if (isRunning) setCurrentStep(1);
  }, [agents, isRunning]);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch real-time status
  const fetchAgentStatus = async () => {
    try {
      const aiServiceUrl =
        process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";
      const response = await fetch(`${aiServiceUrl}/demo/agents/status`);
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || {});
        setMessages(data.collaboration_log || []);

        // Update live analysis data
        const analysis: Record<string, unknown> = {};
        Object.values(data.agents || {}).forEach((agent: unknown) => {
          const typedAgent = agent as Agent;
          if (
            typedAgent.findings &&
            Object.keys(typedAgent.findings).length > 0
          ) {
            analysis[typedAgent.agent_id] = typedAgent.findings;
          }
        });
        setLiveAnalysis(analysis);
      }
    } catch (error) {
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
      const aiServiceUrl =
        process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";
      await fetch(`${aiServiceUrl}/demo/agents/reset`, {
        method: "POST",
      });
    } catch (error) {
      console.log("Reset error:", error);
    }

    // Start real-time status updates
    statusInterval.current = setInterval(fetchAgentStatus, 500);

    try {
      const aiServiceUrl =
        process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";
      const response = await fetch(
        `${aiServiceUrl}/demo/institutional-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request: currentRequest,
            institution_id: "institutional_client_001",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Transform the result to match our new interface - handle various response formats
        const analysisResult: AnalysisResult = {
          analysis_id:
            result.result?.demo_id ||
            result.request_id ||
            `analysis_${Date.now()}`,
          original_request: result.result?.original_request || currentRequest,
          execution_time: result.result?.execution_time || "2-3 minutes",
          final_decision:
            result.result?.final_decision || "Analysis in progress...",
          financial_impact:
            result.result?.financial_impact || "To be determined",
          key_insights: result.result?.demo_highlights || [],
          regulatory_highlights: result.result?.judge_wow_factors || [],
        };
        setAnalysisResult(analysisResult);
        setCurrentStep(6);
      } else {
        console.error("Analysis failed:", await response.text());
        setMessages((prev) => [
          ...prev,
          {
            from_agent: "system",
            to_agent: "user",
            message_type: "error",
            content:
              "❌ Analysis failed. Please check the AI service connection.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setMessages((prev) => [
        ...prev,
        {
          from_agent: "system",
          to_agent: "user",
          message_type: "error",
          content:
            "🔌 Cannot connect to AI service. Please ensure the AI service is running at " +
            (process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001"),
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
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
      const aiServiceUrl =
        process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";
      await fetch(`${aiServiceUrl}/demo/agents/reset`, {
        method: "POST",
      });
      await fetchAgentStatus();
    } catch (error) {
      console.log("Reset error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg relative">
          {/* Navigation Link */}
          <div className="absolute top-4 right-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            🤖 AI-Powered DeFi Compliance Platform
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Advanced multi-agent AI system for institutional DeFi investment
            analysis and regulatory compliance
          </p>

          {/* Analysis Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="text"
              value={currentRequest}
              onChange={(e) => setCurrentRequest(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-lg min-w-[400px] text-gray-800"
              placeholder="Enter institutional investment request..."
              disabled={isRunning}
            />
            <div className="flex gap-2">
              <Button
                onClick={startAnalysis}
                disabled={isRunning}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
              >
                <Play className="h-5 w-5 mr-2" />
                {isRunning ? "Analyzing..." : "Start Analysis"}
              </Button>
              <Button
                onClick={resetAnalysis}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-800 backdrop-blur-sm transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg">
          {/* Agent Status Panel */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="h-6 w-6" />
                  AI Agent Status
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of intelligent agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {Object.values(agents).map((agent) => (
                  <div
                    key={agent.agent_id}
                    className="border border-slate-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getAgentIcon(agent.agent_id)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {agent.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {agent.specialization}
                          </p>
                        </div>
                      </div>
                      <Badge className={getAgentStatusColor(agent.status)}>
                        {agent.status.toUpperCase()}
                      </Badge>
                    </div>

                    {agent.current_task && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-700 mb-1">
                          {agent.current_task}
                        </p>
                        <Progress value={agent.progress} className="h-2" />
                      </div>
                    )}

                    {agent.confidence_level > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        Confidence: {(agent.confidence_level * 100).toFixed(1)}%
                      </div>
                    )}

                    {agent.conversation_history &&
                      agent.conversation_history.length > 0 && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                          <strong>Latest Update:</strong>{" "}
                          {
                            agent.conversation_history[
                              agent.conversation_history.length - 1
                            ]
                          }
                        </div>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Real-time Communication & Results */}
          <div className="space-y-6">
            {/* Agent Communication */}
            <Card className="h-[350px] border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <MessageCircle className="h-5 w-5" />
                  Agent Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] p-4 overflow-y-auto bg-white">
                  <div className="space-y-3">
                    {messages.map((message, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-blue-200 pl-3 py-2 bg-slate-50 rounded-r"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {message.from_agent.replace("_", " ")}
                          </Badge>
                          →
                          <Badge variant="outline" className="text-xs">
                            {message.to_agent.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle className="h-5 w-5" />
                    Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {analysisResult.execution_time}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Processing Time
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {analysisResult.financial_impact.investment_amount}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Investment Amount
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-emerald-800">
                      Key Insights:
                    </h4>
                    {analysisResult.key_insights.map(
                      (insight: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-emerald-700">
                            {insight}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-white rounded-lg border border-emerald-200">
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Investment Decision:</strong>{" "}
                        {analysisResult.final_decision}
                      </div>
                      <div>
                        <strong>Expected Annual Yield:</strong>{" "}
                        {analysisResult.financial_impact.estimated_annual_yield}
                      </div>
                      <div>
                        <strong>Risk Assessment:</strong>{" "}
                        {analysisResult.financial_impact.risk_level}
                      </div>
                      <div>
                        <strong>Compliance Status:</strong>{" "}
                        {analysisResult.financial_impact.compliance_status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
