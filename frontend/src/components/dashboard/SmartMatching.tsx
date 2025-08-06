"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Target,
  Star,
  User,
  Code,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Sparkles,
  GitBranch,
  Award,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface CandidateMatch {
  id: string;
  name: string;
  username: string;
  avatar: string;
  compatibilityScore: number;
  successProbability: number;
  confidenceLevel: number;
  skillMatch: Record<string, number>;
  experienceLevel: string;
  specializations: string[];
  strengths: string[];
  redFlags: string[];
  recommendedRoles: string[];
  githubStats: {
    totalRepos: number;
    totalStars: number;
    totalCommits: number;
    languages: string[];
  };
  breakdown: {
    skills: number;
    experience: number;
    culture: number;
    communication: number;
    growth: number;
    location: number;
    compensation: number;
  };
}

const mockMatches: CandidateMatch[] = [
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
  description:
    "Looking for an experienced Solana developer to build next-generation DeFi protocols.",
};

export function SmartMatching() {
  const [matches, setMatches] = useState<CandidateMatch[]>(mockMatches);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateMatch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(70);
  const [showOnlyTopMatches, setShowOnlyTopMatches] = useState(false);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.specializations.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const meetsMinScore = match.compatibilityScore >= minScore;
    const isTopMatch = !showOnlyTopMatches || match.compatibilityScore >= 85;

    return matchesSearch && meetsMinScore && isTopMatch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 85) return "text-green-600";
    if (prob >= 75) return "text-blue-600";
    if (prob >= 65) return "text-yellow-600";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Smart Matching
          </h2>
          <p className="text-gray-600">
            AI-powered candidate analysis for {jobRequirements.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Sparkles className="h-3 w-3 mr-1" />
            ML-Powered
          </Badge>
          <Badge variant="outline">
            {filteredMatches.length} matches found
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, username, or specialization..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Min Score:</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMinScore(Number(e.target.value))
                  }
                  className="w-20"
                />
              </div>

              <Button
                variant={showOnlyTopMatches ? "default" : "outline"}
                onClick={() => setShowOnlyTopMatches(!showOnlyTopMatches)}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Top Matches Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Candidate Matches</h3>

          {filteredMatches.map((candidate) => (
            <Card
              key={candidate.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCandidate?.id === candidate.id
                  ? "border-purple-500 bg-purple-50"
                  : ""
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">
                        @{candidate.username}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        getScoreColor(candidate.compatibilityScore).split(
                          " "
                        )[0]
                      }`}
                    >
                      {candidate.compatibilityScore.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-500">Compatibility</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Probability</span>
                    <span
                      className={`font-medium ${getProbabilityColor(
                        candidate.successProbability
                      )}`}
                    >
                      {candidate.successProbability.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={candidate.successProbability}
                    className="h-2"
                  />
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {candidate.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {candidate.redFlags.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {candidate.redFlags.length} flag
                      {candidate.redFlags.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {candidate.githubStats.totalRepos} repos
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {candidate.githubStats.totalStars} stars
                  </span>
                  <span className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {candidate.githubStats.totalCommits} commits
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredMatches.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-4">
          {selectedCandidate ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Compatibility Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown for {selectedCandidate.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Scores */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCandidate.compatibilityScore.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Compatibility</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCandidate.successProbability.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCandidate.confidenceLevel.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Confidence</p>
                      </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Matching</CardTitle>
                  <CardDescription>
                    How well skills align with job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillsData.map((skill) => (
                      <div key={skill.skill} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {skill.skill}
                            </span>
                            {skill.required && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {skill.score}%
                          </span>
                        </div>
                        <Progress
                          value={skill.score}
                          className={`h-2 ${
                            skill.required ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strengths */}
                  <div>
                    <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {selectedCandidate.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags */}
                  {selectedCandidate.redFlags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Red Flags
                      </h4>
                      <ul className="space-y-1">
                        {selectedCandidate.redFlags.map((flag, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Roles */}
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Recommended Roles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.recommendedRoles.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a candidate
                </h3>
                <p className="text-gray-600">
                  Click on a candidate to see detailed analysis and
                  compatibility scores.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
