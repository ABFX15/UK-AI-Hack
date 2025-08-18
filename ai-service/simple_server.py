#!/usr/bin/env python3
"""
Simple AI Service for Demo
"""
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

class DemoHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if parsed_path.path == '/demo/agents/status':
            # Return mock agent status
            response = {
                "agents": {
                    "risk_analyzer": {
                        "agent_id": "risk_analyzer",
                        "name": "DeFi Risk Analyzer",
                        "specialization": "Protocol Risk Assessment",
                        "status": "analyzing",
                        "current_task": "Analyzing Aave liquidity pools",
                        "progress": 75,
                        "confidence_level": 0.87,
                        "conversation_history": [
                            "Initiated risk analysis for Aave protocol",
                            "Analyzing liquidity pool composition",
                            "Evaluating smart contract security"
                        ],
                        "findings": {
                            "risk_score": 0.23,
                            "liquidity_risk": "Low",
                            "smart_contract_risk": "Medium"
                        }
                    },
                    "regulatory_monitor": {
                        "agent_id": "regulatory_monitor",
                        "name": "Regulatory Monitor",
                        "specialization": "Compliance Checking",
                        "status": "monitoring",
                        "current_task": "Checking regulatory compliance",
                        "progress": 60,
                        "confidence_level": 0.92,
                        "conversation_history": [
                            "Reviewing current regulatory framework",
                            "Checking US and EU compliance requirements",
                            "Validating institutional investment guidelines"
                        ],
                        "findings": {
                            "compliance_status": "Compliant",
                            "jurisdiction": "US/EU",
                            "requirements_met": 18
                        }
                    }
                },
                "collaboration_log": [
                    {
                        "from_agent": "system",
                        "to_agent": "user",
                        "message_type": "info",
                        "content": "AI agents are analyzing your DeFi investment request...",
                        "timestamp": "2025-08-18T10:30:00Z"
                    },
                    {
                        "from_agent": "risk_analyzer",
                        "to_agent": "regulatory_monitor",
                        "message_type": "data_request",
                        "content": "Need regulatory compliance data for Aave protocol",
                        "timestamp": "2025-08-18T10:31:00Z"
                    }
                ]
            }
        else:
            response = {"status": "ok", "service": "AI Service Demo"}
            
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            self.rfile.read(content_length)  # Read and discard POST data
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/demo/institutional-request':
            # Mock analysis response with complete structure
            response = {
                "request_id": "req_" + str(int(time.time())),
                "status": "processing",
                "message": "Analysis started successfully",
                "estimated_completion": "2-3 minutes",
                "result": {
                    "demo_id": "demo_" + str(int(time.time())),
                    "original_request": "Should JPMorgan invest $500M in Aave for Q4 2025?",
                    "execution_time": "2.5 minutes",
                    "final_decision": "RECOMMENDED with conditions - Proceed with $500M Aave investment",
                    "financial_impact": "$500M investment with projected 8.5% APY, estimated returns of $42.5M annually",
                    "demo_highlights": [
                        "Aave Protocol shows strong liquidity metrics",
                        "Regulatory compliance verified for institutional investment",
                        "Smart contract audits passed with minimal risk factors"
                    ],
                    "judge_wow_factors": [
                        "MiCA compliance confirmed for EU operations",
                        "SEC regulatory clarity achieved",
                        "Institutional custody solutions available"
                    ]
                }
            }
        elif parsed_path.path == '/demo/agents/reset':
            response = {"status": "reset", "message": "Agents reset successfully"}
        else:
            response = {"status": "ok", "endpoint": parsed_path.path}
            
        self.wfile.write(json.dumps(response).encode('utf-8'))

def run_server():
    server = HTTPServer(('localhost', 8001), DemoHandler)
    print("🚀 AI Service running on http://localhost:8001")
    print("🤖 Mock agents ready for demo")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
