import { Metadata } from "next";
import MultiAgentDemo from "@/components/MultiAgentDemo";

export const metadata: Metadata = {
  title: "AI Compliance Platform | Real-time DeFi Analysis",
  description:
    "Advanced multi-agent AI system for institutional DeFi investment analysis and regulatory compliance",
};

export default function CompliancePlatformPage() {
  return <MultiAgentDemo />;
}
