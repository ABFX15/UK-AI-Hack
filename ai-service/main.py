"""
FastAPI Backend for DeFi Regulatory Compliance Platform
Integrates AI risk analysis with institutional APIs
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
import asyncio
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uvicorn

# Import our AI service
from services.defi_risk_analyzer import DeFiRiskAnalyzer

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our regulatory compliance services
from services.defi_risk_analyzer import DeFiRiskAnalyzer
from services.regulatory_monitor import RegulatoryMonitor
from services.compliance_engine import ComplianceEngine
from services.transaction_analyzer import TransactionAnalyzer
from services.aml_detector import AMLDetector
from services.protocol_auditor import ProtocolAuditor

app = FastAPI(
    title="DeFi Regulatory Compliance AI Service",
    description="AI-powered regulatory compliance and risk analysis for institutional DeFi",
    version="2.0.0"
)

# CORS middleware for frontend dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize compliance services
risk_analyzer = DeFiRiskAnalyzer()
regulatory_monitor = RegulatoryMonitor()
compliance_engine = ComplianceEngine()
transaction_analyzer = TransactionAnalyzer()
aml_detector = AMLDetector()
protocol_auditor = ProtocolAuditor()

# Pydantic models for regulatory compliance
class ProtocolAnalysisRequest(BaseModel):
    protocol_address: str
    chain_id: int
    include_audit_history: bool = True

class ProtocolAnalysisResponse(BaseModel):
    protocol_address: str
    risk_score: float
    compliance_score: float
    audit_status: str
    vulnerabilities: List[Dict]
    regulatory_concerns: List[str]
    recommendations: List[str]
    approved_for_institutional_use: bool

class TransactionAnalysisRequest(BaseModel):
    from_address: str
    to_address: str
    amount: float
    token_address: str
    protocol_address: str
    chain_id: int

class TransactionAnalysisResponse(BaseModel):
    compliance_status: str
    risk_level: str
    aml_flags: List[str]
    regulatory_violations: List[str]
    approval_required: bool
    estimated_penalty_risk: float
    recommendations: List[str]

class ComplianceReportRequest(BaseModel):
    institution_id: str
    start_date: str
    end_date: str
    regulatory_framework: str  # "SEC", "MiCA", "FCA", etc.

class ComplianceReportResponse(BaseModel):
    institution_id: str
    compliance_score: float
    total_transactions: int
    flagged_transactions: int
    violations: List[Dict]
    regulatory_summary: Dict
    recommendations: List[str]
    report_id: str

class RiskAssessmentRequest(BaseModel):
    portfolio: List[Dict]  # List of investments
    institution_risk_tolerance: str
    regulatory_requirements: List[str]

class RiskAssessmentResponse(BaseModel):
    overall_risk_score: float
    risk_breakdown: Dict[str, float]
    compliance_gaps: List[str]
    rebalancing_recommendations: List[Dict]
    regulatory_alerts: List[str]

@app.get("/")
async def root():
    return {"message": "DeFi Regulatory Compliance AI Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "services": [
            "defi_risk_analyzer", 
            "regulatory_monitor", 
            "compliance_engine",
            "transaction_analyzer",
            "aml_detector",
            "protocol_auditor"
        ]
    }

@app.post("/analyze/protocol", response_model=ProtocolAnalysisResponse)
async def analyze_protocol(request: ProtocolAnalysisRequest):
    """
    AI-powered DeFi protocol security and compliance analysis
    """
    try:
        analysis = await protocol_auditor.analyze_protocol(
            request.protocol_address,
            request.chain_id,
            request.include_audit_history
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze/transaction", response_model=TransactionAnalysisResponse)
async def analyze_transaction(request: TransactionAnalysisRequest):
    """
    Real-time transaction compliance and AML analysis
    """
    try:
        analysis = await transaction_analyzer.analyze_transaction(
            request.from_address,
            request.to_address,
            request.amount,
            request.token_address,
            request.protocol_address,
            request.chain_id
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/compliance/report", response_model=ComplianceReportResponse)
async def generate_compliance_report(request: ComplianceReportRequest):
    """
    Generate automated regulatory compliance report
    """
    try:
        report = await compliance_engine.generate_report(
            request.institution_id,
            request.start_date,
            request.end_date,
            request.regulatory_framework
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/risk/assessment", response_model=RiskAssessmentResponse)
async def assess_portfolio_risk(request: RiskAssessmentRequest):
    """
    Comprehensive DeFi portfolio risk assessment
    """
    try:
        assessment = await risk_analyzer.assess_portfolio(
            request.portfolio,
            request.institution_risk_tolerance,
            request.regulatory_requirements
        )
        return assessment
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/regulatory/updates")
async def get_regulatory_updates():
    """
    Get latest regulatory updates and changes
    """
    try:
        updates = await regulatory_monitor.get_latest_updates()
        return {"regulatory_updates": updates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/protocols/whitelist")
async def get_approved_protocols():
    """
    Get list of institutionally approved DeFi protocols
    """
    try:
        protocols = await protocol_auditor.get_approved_protocols()
        return {"approved_protocols": protocols}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/aml/check")
async def check_aml_compliance(address: str, amount: float):
    """
    Check address for AML compliance and sanctions
    """
    try:
        result = await aml_detector.check_compliance(address, amount)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Real-time monitoring and alerting endpoints
@app.post("/monitoring/setup-alerts")
async def setup_regulatory_alerts(institution_id: str, alert_rules: Dict):
    """
    Setup real-time regulatory alerts
    """
    try:
        success = await regulatory_monitor.setup_alerts(institution_id, alert_rules)
        return {"success": success, "message": "Alerts configured successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/monitoring/calendar/{jurisdiction}")
async def get_regulatory_calendar(jurisdiction: str, timeframe: str = "6months"):
    """
    Get regulatory compliance calendar
    """
    try:
        calendar = await regulatory_monitor.generate_regulatory_calendar(jurisdiction, timeframe)
        return {"compliance_calendar": calendar}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/audit/contract")
async def audit_smart_contract(contract_address: str, chain_id: int):
    """
    Automated smart contract security audit
    """
    try:
        audit_result = await protocol_auditor.audit_smart_contract(contract_address, chain_id)
        return audit_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8001))  # Changed to 8001 to avoid conflicts
    host = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
