"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartMatching = SmartMatching;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
const mockMatches = [
    {
        id: "cand_001",
        name: "Alex Chen",
        username: "alexchen_dev",
        avatar: "/api/placeholder/40/40",
        compatibilityScore: 92.5,
        successProbability: 87.3,
        confidenceLevel: 94.2,
        skillMatch: {
            Solidity: 95,
            JavaScript: 88,
            React: 92,
            "Web3.js": 85,
            "Smart Contracts": 90,
        },
        experienceLevel: "Senior",
        specializations: ["DeFi", "Smart Contracts", "Frontend"],
        strengths: [
            "Strong technical skills",
            "Active in DeFi community",
            "Good communication",
        ],
        redFlags: [],
        recommendedRoles: ["Senior Solana Developer", "DeFi Engineer"],
        githubStats: {
            totalRepos: 45,
            totalStars: 1250,
            totalCommits: 2800,
            languages: ["TypeScript", "Solidity", "Rust", "JavaScript", "Python"],
        },
        breakdown: {
            skills: 95,
            experience: 90,
            culture: 88,
            communication: 92,
            growth: 85,
            location: 100,
            compensation: 90,
        },
    },
    {
        id: "cand_002",
        name: "Sarah Kim",
        username: "sarahk_blockchain",
        avatar: "/api/placeholder/40/40",
        compatibilityScore: 88.2,
        successProbability: 82.1,
        confidenceLevel: 89.5,
        skillMatch: {
            Rust: 92,
            Solana: 88,
            Blockchain: 85,
            Anchor: 90,
            Web3: 87,
        },
        experienceLevel: "Mid-Senior",
        specializations: ["Solana", "Rust", "Backend"],
        strengths: [
            "Deep Solana knowledge",
            "Strong Rust skills",
            "Protocol development",
        ],
        redFlags: ["Limited frontend experience"],
        recommendedRoles: ["Solana Protocol Developer", "Blockchain Engineer"],
        githubStats: {
            totalRepos: 32,
            totalStars: 890,
            totalCommits: 1950,
            languages: ["Rust", "TypeScript", "Solidity", "Go", "C++"],
        },
        breakdown: {
            skills: 92,
            experience: 85,
            culture: 90,
            communication: 78,
            growth: 95,
            location: 85,
            compensation: 88,
        },
    },
    {
        id: "cand_003",
        name: "Michael Torres",
        username: "miktorrr",
        avatar: "/api/placeholder/40/40",
        compatibilityScore: 76.8,
        successProbability: 71.5,
        confidenceLevel: 82.1,
        skillMatch: {
            JavaScript: 85,
            "Node.js": 82,
            React: 88,
            GraphQL: 80,
            Web3: 70,
        },
        experienceLevel: "Mid-Level",
        specializations: ["Frontend", "Full-Stack", "APIs"],
        strengths: ["Strong frontend skills", "Good team player", "Fast learner"],
        redFlags: ["Limited Web3 experience", "Job hopping pattern"],
        recommendedRoles: ["Frontend Developer", "Full-Stack Engineer"],
        githubStats: {
            totalRepos: 28,
            totalStars: 420,
            totalCommits: 1200,
            languages: ["JavaScript", "TypeScript", "Python", "PHP", "Java"],
        },
        breakdown: {
            skills: 78,
            experience: 75,
            culture: 85,
            communication: 88,
            growth: 80,
            location: 90,
            compensation: 72,
        },
    },
];
const jobRequirements = {
    title: "Senior Solana Developer",
    company: "DeFi Protocol Inc",
    requiredSkills: ["Solidity", "Rust", "Solana", "DeFi", "Smart Contracts"],
    experienceRange: [3, 8],
    compensation: [120000, 180000],
    location: "Remote",
    description: "Looking for an experienced Solana developer to build next-generation DeFi protocols.",
};
function SmartMatching() {
    const [matches, setMatches] = (0, react_1.useState)(mockMatches);
    const [selectedCandidate, setSelectedCandidate] = (0, react_1.useState)(null);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [minScore, setMinScore] = (0, react_1.useState)(70);
    const [showOnlyTopMatches, setShowOnlyTopMatches] = (0, react_1.useState)(false);
    const filteredMatches = matches.filter((match) => {
        const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.specializations.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));
        const meetsMinScore = match.compatibilityScore >= minScore;
        const isTopMatch = !showOnlyTopMatches || match.compatibilityScore >= 85;
        return matchesSearch && meetsMinScore && isTopMatch;
    });
    const getScoreColor = (score) => {
        if (score >= 90)
            return "text-green-600 bg-green-100";
        if (score >= 80)
            return "text-blue-600 bg-blue-100";
        if (score >= 70)
            return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };
    const getProbabilityColor = (prob) => {
        if (prob >= 85)
            return "text-green-600";
        if (prob >= 75)
            return "text-blue-600";
        if (prob >= 65)
            return "text-yellow-600";
        return "text-red-600";
    };
    const radarData = selectedCandidate
        ? [
            {
                subject: "Skills",
                A: selectedCandidate.breakdown.skills,
                fullMark: 100,
            },
            {
                subject: "Experience",
                A: selectedCandidate.breakdown.experience,
                fullMark: 100,
            },
            {
                subject: "Culture",
                A: selectedCandidate.breakdown.culture,
                fullMark: 100,
            },
            {
                subject: "Communication",
                A: selectedCandidate.breakdown.communication,
                fullMark: 100,
            },
            {
                subject: "Growth",
                A: selectedCandidate.breakdown.growth,
                fullMark: 100,
            },
            {
                subject: "Location",
                A: selectedCandidate.breakdown.location,
                fullMark: 100,
            },
            {
                subject: "Compensation",
                A: selectedCandidate.breakdown.compensation,
                fullMark: 100,
            },
        ]
        : [];
    const skillsData = selectedCandidate
        ? Object.entries(selectedCandidate.skillMatch).map(([skill, score]) => ({
            skill,
            score,
            required: jobRequirements.requiredSkills.includes(skill),
        }))
        : [];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-6 w-6 text-purple-600" }), "Smart Matching"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["AI-powered candidate analysis for ", jobRequirements.title] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "bg-purple-50 text-purple-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-3 w-3 mr-1" }), "ML-Powered"] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: [filteredMatches.length, " matches found"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Search & Filter Candidates" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search by name, username, or specialization...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Min Score:" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", min: "0", max: "100", value: minScore, onChange: (e) => setMinScore(Number(e.target.value)), className: "w-20" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: showOnlyTopMatches ? "default" : "outline", onClick: () => setShowOnlyTopMatches(!showOnlyTopMatches), className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4" }), "Top Matches Only"] })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Candidate Matches" }), filteredMatches.map((candidate) => ((0, jsx_runtime_1.jsx)(card_1.Card, { className: `cursor-pointer transition-all hover:shadow-md ${selectedCandidate?.id === candidate.id
                                    ? "border-purple-500 bg-purple-50"
                                    : ""}`, onClick: () => setSelectedCandidate(candidate), children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold", children: candidate.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("") }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold", children: candidate.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["@", candidate.username] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: `text-2xl font-bold ${getScoreColor(candidate.compatibilityScore).split(" ")[0]}`, children: [candidate.compatibilityScore.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Compatibility" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Success Probability" }), (0, jsx_runtime_1.jsxs)("span", { className: `font-medium ${getProbabilityColor(candidate.successProbability)}`, children: [candidate.successProbability.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: candidate.successProbability, className: "h-2" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1 mt-3", children: [candidate.specializations.slice(0, 3).map((spec) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: spec }, spec))), candidate.redFlags.length > 0 && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "destructive", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-3 w-3 mr-1" }), candidate.redFlags.length, " flag", candidate.redFlags.length > 1 ? "s" : ""] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-3 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "h-3 w-3" }), candidate.githubStats.totalRepos, " repos"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3" }), candidate.githubStats.totalStars, " stars"] }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "h-3 w-3" }), candidate.githubStats.totalCommits, " commits"] })] })] }) }, candidate.id))), filteredMatches.length === 0 && ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No matches found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Try adjusting your search criteria or filters." })] }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: selectedCandidate ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-5 w-5 text-purple-600" }), "Compatibility Analysis"] }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { children: ["Detailed breakdown for ", selectedCandidate.name] })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-purple-600", children: [selectedCandidate.compatibilityScore.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Compatibility" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [selectedCandidate.successProbability.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Success Rate" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-blue-600", children: [selectedCandidate.confidenceLevel.toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Confidence" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-64", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.RadarChart, { data: radarData, children: [(0, jsx_runtime_1.jsx)(recharts_1.PolarGrid, {}), (0, jsx_runtime_1.jsx)(recharts_1.PolarAngleAxis, { dataKey: "subject" }), (0, jsx_runtime_1.jsx)(recharts_1.PolarRadiusAxis, { domain: [0, 100] }), (0, jsx_runtime_1.jsx)(recharts_1.Radar, { name: "Score", dataKey: "A", stroke: "#8b5cf6", fill: "#8b5cf6", fillOpacity: 0.2, strokeWidth: 2 })] }) }) })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Skill Matching" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "How well skills align with job requirements" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: skillsData.map((skill) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: skill.skill }), skill.required && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: "Required" }))] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", children: [skill.score, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: skill.score, className: `h-2 ${skill.required ? "bg-blue-100" : "bg-gray-100"}` })] }, skill.skill))) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Insights & Recommendations" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium text-green-700 mb-2 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), "Strengths"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1", children: selectedCandidate.strengths.map((strength, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "text-sm text-gray-700 flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" }), strength] }, index))) })] }), selectedCandidate.redFlags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium text-red-700 mb-2 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }), "Red Flags"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1", children: selectedCandidate.redFlags.map((flag, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "text-sm text-gray-700 flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" }), flag] }, index))) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium text-blue-700 mb-2 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { className: "h-4 w-4" }), "Recommended Roles"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: selectedCandidate.recommendedRoles.map((role) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "bg-blue-50 text-blue-700", children: role }, role))) })] })] })] })] })) : ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Select a candidate" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Click on a candidate to see detailed analysis and compatibility scores." })] }) })) })] })] }));
}
//# sourceMappingURL=SmartMatching.js.map