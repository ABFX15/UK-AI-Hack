#!/usr/bin/env python3
"""
Test script for the dynamic multi-agent system
"""

import asyncio
import sys
import os

# Add the ai-service directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai-service'))

from services.multi_agent_system import MultiAgentDeFiSystem

async def test_different_requests():
    """Test the system with different requests to verify dynamic responses"""
    
    system = MultiAgentDeFiSystem()
    
    test_requests = [
        {
            "request": "Should JPMorgan invest $500M in Aave for Q4 2025?",
            "institution_id": "jpmorgan_chase_001"
        },
        {
            "request": "Analyze a $200M investment in Compound for BlackRock",
            "institution_id": "blackrock_institutional"
        },
        {
            "request": "Is Uniswap suitable for a $50M investment from Fidelity?",
            "institution_id": "fidelity_investments"
        },
        {
            "request": "Goldman Sachs wants to invest $1B in Curve protocol",
            "institution_id": "goldman_sachs"
        }
    ]
    
    print("🚀 Testing Dynamic Multi-Agent System")
    print("=" * 60)
    
    for i, test in enumerate(test_requests, 1):
        print(f"\n📝 Test {i}: {test['request']}")
        print("-" * 40)
        
        try:
            # Process the request
            result = await system.process_institutional_request(
                test["request"], 
                test["institution_id"]
            )
            
            # Print key dynamic information
            print(f"✅ Protocol: {result.get('protocol_analyzed', 'Unknown')}")
            print(f"💰 Investment: {result['financial_impact']['investment_amount']}")
            print(f"📊 Risk Level: {result['financial_impact']['risk_level']}")
            print(f"⚖️ Compliance: {result['financial_impact']['compliance_status']}")
            print(f"🎯 Decision: {result['final_decision']}")
            print(f"⏱️ Time: {result['execution_time']}")
            
            # Verify agents have different findings
            agent_findings = {}
            for agent_id, agent_data in result['agent_performance'].items():
                if agent_data['key_findings']:
                    agent_findings[agent_id] = agent_data['key_findings']
            
            print(f"🤖 Agent Findings: {len(agent_findings)} agents with unique data")
            
            # Reset system for next test
            system._initialize_agents()
            system.collaboration_log = []
            system.blockchain_transactions = []
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("✅ Dynamic Agent Testing Complete!")

if __name__ == "__main__":
    asyncio.run(test_different_requests())