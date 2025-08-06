from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Import our services
from services.github_analyzer import GitHubAnalyzer
from services.ai_matcher import AIMatchingService
from services.sentiment_analyzer import SentimentAnalyzer
from services.automated_sla import sla_engine, SLAType
from services.smart_matching import smart_matching_engine
from services.realtime_dashboard import dashboard, ProcessStage

app = FastAPI(
    title="Web3 Talent AI Service",
    description="AI-powered analysis and matching for Web3 talent platform",
    version="1.0.0"
)

# CORS middleware for TypeScript backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your TypeScript server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
github_analyzer = GitHubAnalyzer()
ai_matcher = AIMatchingService()
sentiment_analyzer = SentimentAnalyzer()

# Pydantic models
class GitHubAnalysisRequest(BaseModel):
    username: str
    include_detailed_analysis: bool = True

class GitHubAnalysisResponse(BaseModel):
    username: str
    skill_scores: Dict[str, float]
    experience_level: str
    specializations: List[str]
    activity_score: float
    contribution_quality: float
    collaboration_score: float
    innovation_score: float
    overall_score: float
    strengths: List[str]
    areas_for_improvement: List[str]
    recommended_roles: List[str]

class JobMatchRequest(BaseModel):
    developer_profile: Dict
    job_requirements: Dict
    company_info: Dict

class JobMatchResponse(BaseModel):
    compatibility_score: float
    skill_match: Dict[str, float]
    experience_match: float
    culture_fit: float
    growth_potential: float
    reasons: List[str]
    concerns: List[str]
    recommendations: List[str]

class SentimentRequest(BaseModel):
    text: str
    context: str = "general"

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    emotions: Dict[str, float]

@app.get("/")
async def root():
    return {"message": "Web3 Talent AI Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["github_analyzer", "ai_matcher", "sentiment_analyzer"]}

@app.post("/analyze/github", response_model=GitHubAnalysisResponse)
async def analyze_github_profile(request: GitHubAnalysisRequest):
    """
    Advanced AI-powered GitHub profile analysis
    """
    try:
        analysis = await github_analyzer.analyze_profile(
            request.username, 
            detailed=request.include_detailed_analysis
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/match/job", response_model=JobMatchResponse)
async def match_job(request: JobMatchRequest):
    """
    AI-powered job matching algorithm
    """
    try:
        match_result = await ai_matcher.calculate_match(
            request.developer_profile,
            request.job_requirements,
            request.company_info
        )
        return match_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment for communication/feedback
    """
    try:
        sentiment = await sentiment_analyzer.analyze(request.text, request.context)
        return sentiment
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/skills/trending")
async def get_trending_skills():
    """
    Get trending skills in Web3 space
    """
    try:
        skills = await github_analyzer.get_trending_skills()
        return {"trending_skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Automation and SLA endpoints
class SLARequest(BaseModel):
    application_id: str
    company_id: str
    sla_type: str
    custom_hours: Optional[int] = None

class ProcessRequest(BaseModel):
    application_id: str
    job_id: str
    candidate_id: str
    company_id: str

class ProcessAdvanceRequest(BaseModel):
    new_stage: str
    actor: str
    notes: Optional[str] = ""

class BlockerRequest(BaseModel):
    blocker_type: str
    description: str
    severity: str = "medium"

class MatchingRequest(BaseModel):
    job_id: str
    candidate_pool: List[Dict]

class LearnRequest(BaseModel):
    candidate_id: str
    job_id: str
    success_metrics: Dict

@app.post("/automation/sla")
async def create_sla(request: SLARequest):
    """Create automated SLA with monitoring"""
    try:
        from services.automated_sla import sla_engine, SLAType
        sla_type = SLAType(request.sla_type)
        sla = await sla_engine.create_sla(
            request.application_id,
            request.company_id,
            sla_type,
            request.custom_hours
        )
        return sla
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/automation/sla/{sla_id}/complete")
async def complete_sla(sla_id: str):
    """Mark SLA as completed"""
    try:
        from services.automated_sla import sla_engine
        await sla_engine.complete_sla(sla_id)
        return {"status": "success", "message": f"SLA {sla_id} completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/sla/dashboard/{company_id}")
async def get_sla_dashboard(company_id: str):
    """Get SLA performance dashboard"""
    try:
        from services.automated_sla import sla_engine
        dashboard_data = await sla_engine.get_sla_dashboard(company_id)
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/matching/find-matches")
async def find_matches(request: MatchingRequest):
    """Find perfect matches using AI-powered analysis"""
    try:
        from services.smart_matching import smart_matching_engine
        matches = await smart_matching_engine.find_perfect_matches(
            request.job_id, 
            request.candidate_pool
        )
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/matching/learn")
async def learn_from_hire(request: LearnRequest):
    """Learn from successful hire to improve future matching"""
    try:
        from services.smart_matching import smart_matching_engine
        await smart_matching_engine.learn_from_successful_hire(
            request.candidate_id,
            request.job_id,
            request.success_metrics
        )
        return {"status": "success", "message": "Learning completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/dashboard/process")
async def create_process(request: ProcessRequest):
    """Create new hiring process with real-time tracking"""
    try:
        from services.realtime_dashboard import dashboard
        process = await dashboard.create_hiring_process(
            request.application_id,
            request.job_id,
            request.candidate_id,
            request.company_id
        )
        return process
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/dashboard/process/{process_id}/advance")
async def advance_process(process_id: str, request: ProcessAdvanceRequest):
    """Advance hiring process to next stage"""
    try:
        from services.realtime_dashboard import dashboard, ProcessStage
        new_stage = ProcessStage(request.new_stage)
        process = await dashboard.advance_stage(
            process_id,
            new_stage,
            request.actor,
            request.notes or ""
        )
        return process
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/dashboard/process/{process_id}/blocker")
async def add_blocker(process_id: str, request: BlockerRequest):
    """Add blocker to hiring process"""
    try:
        from services.realtime_dashboard import dashboard
        blocker = await dashboard.add_blocker(
            process_id,
            request.blocker_type,
            request.description,
            request.severity
        )
        return blocker
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard")
async def get_dashboard(company_id: Optional[str] = None, candidate_id: Optional[str] = None):
    """Get comprehensive dashboard data"""
    try:
        from services.realtime_dashboard import dashboard
        dashboard_data = await dashboard.get_dashboard_data(company_id, candidate_id)
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    host = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
