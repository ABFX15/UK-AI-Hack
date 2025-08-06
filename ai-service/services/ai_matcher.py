import os
from typing import Dict, List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai

class AIMatchingService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
        
        # Skill categories and weights
        self.skill_weights = {
            'technical': 0.4,
            'experience': 0.25,
            'culture': 0.15,
            'growth': 0.1,
            'communication': 0.1
        }
        
        # Experience level mappings
        self.experience_mapping = {
            'junior': 1,
            'mid': 2,
            'senior': 3,
            'expert': 4
        }

    async def calculate_match(self, developer_profile: Dict, job_requirements: Dict, company_info: Dict) -> Dict:
        """
        Calculate comprehensive job match score using AI
        """
        try:
            # Extract key components
            dev_skills = developer_profile.get('skill_scores', {})
            dev_experience = developer_profile.get('experience_level', 'junior')
            dev_specializations = developer_profile.get('specializations', [])
            
            job_skills = job_requirements.get('required_skills', [])
            job_experience = job_requirements.get('experience_level', 'mid')
            job_description = job_requirements.get('description', '')
            
            company_culture = company_info.get('culture', '')
            company_size = company_info.get('size', 'medium')
            
            # Calculate individual match scores
            skill_match = self._calculate_skill_match(dev_skills, job_skills, dev_specializations)
            experience_match = self._calculate_experience_match(dev_experience, job_experience)
            culture_fit = await self._calculate_culture_fit(developer_profile, company_info)
            growth_potential = self._calculate_growth_potential(developer_profile, job_requirements)
            
            # Calculate overall compatibility
            compatibility_score = (
                skill_match['overall'] * self.skill_weights['technical'] +
                experience_match * self.skill_weights['experience'] +
                culture_fit * self.skill_weights['culture'] +
                growth_potential * self.skill_weights['growth']
            )
            
            # Generate AI insights
            reasons, concerns, recommendations = await self._generate_ai_insights(
                developer_profile, job_requirements, company_info, compatibility_score
            )
            
            return {
                "compatibility_score": round(compatibility_score, 2),
                "skill_match": skill_match,
                "experience_match": round(experience_match, 2),
                "culture_fit": round(culture_fit, 2),
                "growth_potential": round(growth_potential, 2),
                "reasons": reasons,
                "concerns": concerns,
                "recommendations": recommendations
            }
            
        except Exception as e:
            raise Exception(f"Failed to calculate job match: {str(e)}")

    def _calculate_skill_match(self, dev_skills: Dict, job_skills: List, dev_specializations: List) -> Dict:
        """Calculate technical skill matching"""
        if not job_skills:
            return {"overall": 50.0, "details": {}}
        
        skill_matches = {}
        total_match = 0
        
        for job_skill in job_skills:
            job_skill_lower = job_skill.lower().replace(' ', '_')
            best_match = 0
            
            # Direct skill match
            if job_skill_lower in dev_skills:
                best_match = dev_skills[job_skill_lower]
            else:
                # Check for similar skills
                for dev_skill, score in dev_skills.items():
                    if job_skill_lower in dev_skill or dev_skill in job_skill_lower:
                        best_match = max(best_match, score * 0.8)  # Partial match penalty
            
            # Check specializations
            for spec in dev_specializations:
                if job_skill.lower() in spec.lower():
                    best_match = max(best_match, 70)  # Specialization bonus
            
            skill_matches[job_skill] = round(best_match, 2)
            total_match += best_match
        
        overall_match = (total_match / len(job_skills)) if job_skills else 0
        
        return {
            "overall": round(overall_match, 2),
            "details": skill_matches
        }

    def _calculate_experience_match(self, dev_experience: str, job_experience: str) -> float:
        """Calculate experience level match"""
        dev_level = self.experience_mapping.get(dev_experience, 1)
        job_level = self.experience_mapping.get(job_experience, 2)
        
        # Perfect match
        if dev_level == job_level:
            return 100.0
        
        # Overqualified (less penalty than underqualified)
        if dev_level > job_level:
            diff = dev_level - job_level
            return max(60, 100 - (diff * 15))
        
        # Underqualified
        else:
            diff = job_level - dev_level
            return max(20, 100 - (diff * 25))

    async def _calculate_culture_fit(self, developer_profile: Dict, company_info: Dict) -> float:
        """Calculate culture fit using AI analysis"""
        try:
            # For now, use a simplified heuristic approach
            # In production, this would use more sophisticated NLP
            
            base_score = 70  # Default neutral score
            
            # Company size preferences (inferred from dev profile)
            dev_repos = developer_profile.get('total_repos', 0)
            dev_collaboration = developer_profile.get('collaboration_score', 0)
            company_size = company_info.get('size', 'medium')
            
            # Adjust based on collaboration patterns
            if company_size == 'startup' and dev_collaboration > 60:
                base_score += 15  # Good for collaborative startups
            elif company_size == 'enterprise' and dev_repos > 20:
                base_score += 10  # Experience with larger codebases
            
            # Innovation fit
            dev_innovation = developer_profile.get('innovation_score', 0)
            if dev_innovation > 70:
                base_score += 10  # Innovation bonus
            
            return min(100, base_score)
            
        except Exception:
            return 70.0  # Default score if analysis fails

    def _calculate_growth_potential(self, developer_profile: Dict, job_requirements: Dict) -> float:
        """Calculate growth potential and learning opportunity"""
        dev_skills = developer_profile.get('skill_scores', {})
        job_skills = job_requirements.get('required_skills', [])
        dev_experience = developer_profile.get('experience_level', 'junior')
        
        growth_score = 50  # Base score
        
        # Learning opportunity (skills they don't have yet)
        missing_skills = 0
        for skill in job_skills:
            skill_lower = skill.lower().replace(' ', '_')
            if skill_lower not in dev_skills or dev_skills[skill_lower] < 30:
                missing_skills += 1
        
        # More missing skills = more learning opportunity
        if missing_skills > 0:
            growth_score += min(30, missing_skills * 10)
        
        # Career progression opportunity
        if dev_experience in ['junior', 'mid']:
            growth_score += 20  # Early career boost
        
        # Activity and learning indicators
        dev_activity = developer_profile.get('activity_score', 0)
        if dev_activity > 60:
            growth_score += 15  # Active learners
        
        return min(100, growth_score)

    async def _generate_ai_insights(self, developer_profile: Dict, job_requirements: Dict, 
                                  company_info: Dict, compatibility_score: float) -> tuple:
        """Generate AI-powered insights about the match"""
        try:
            # Prepare context for AI
            context = f"""
            Developer Profile:
            - Experience: {developer_profile.get('experience_level', 'Unknown')}
            - Top Skills: {', '.join(list(developer_profile.get('skill_scores', {}).keys())[:5])}
            - Specializations: {', '.join(developer_profile.get('specializations', []))}
            - Activity Score: {developer_profile.get('activity_score', 0)}
            
            Job Requirements:
            - Required Skills: {', '.join(job_requirements.get('required_skills', []))}
            - Experience Level: {job_requirements.get('experience_level', 'Unknown')}
            - Description: {job_requirements.get('description', '')[:200]}
            
            Company Info:
            - Size: {company_info.get('size', 'Unknown')}
            - Culture: {company_info.get('culture', '')[:200]}
            
            Match Score: {compatibility_score}/100
            """
            
            # Generate insights (simplified for demo)
            reasons = self._generate_reasons(developer_profile, job_requirements, compatibility_score)
            concerns = self._generate_concerns(developer_profile, job_requirements, compatibility_score)
            recommendations = self._generate_recommendations(developer_profile, job_requirements)
            
            return reasons, concerns, recommendations
            
        except Exception:
            # Fallback to rule-based insights
            return self._fallback_insights(compatibility_score)

    def _generate_reasons(self, dev_profile: Dict, job_req: Dict, score: float) -> List[str]:
        """Generate reasons why this is a good match"""
        reasons = []
        
        if score > 80:
            reasons.append("Excellent overall skill alignment with job requirements")
        elif score > 60:
            reasons.append("Strong skill match with good growth potential")
        
        # Skill-specific reasons
        dev_skills = dev_profile.get('skill_scores', {})
        job_skills = job_req.get('required_skills', [])
        
        for skill in job_skills[:3]:  # Top 3 required skills
            skill_lower = skill.lower().replace(' ', '_')
            if skill_lower in dev_skills and dev_skills[skill_lower] > 70:
                reasons.append(f"Strong expertise in {skill}")
        
        # Experience alignment
        if dev_profile.get('experience_level') == job_req.get('experience_level'):
            reasons.append("Perfect experience level match")
        
        # Activity and engagement
        if dev_profile.get('activity_score', 0) > 70:
            reasons.append("Highly active and engaged developer")
        
        return reasons[:5]  # Limit to top 5

    def _generate_concerns(self, dev_profile: Dict, job_req: Dict, score: float) -> List[str]:
        """Generate potential concerns about the match"""
        concerns = []
        
        if score < 40:
            concerns.append("Significant skill gaps may require extensive training")
        elif score < 60:
            concerns.append("Some skill development needed for optimal performance")
        
        # Experience mismatch
        dev_exp = self.experience_mapping.get(dev_profile.get('experience_level', 'junior'), 1)
        job_exp = self.experience_mapping.get(job_req.get('experience_level', 'mid'), 2)
        
        if dev_exp < job_exp - 1:
            concerns.append("May need additional mentoring due to experience gap")
        elif dev_exp > job_exp + 1:
            concerns.append("Overqualified - risk of boredom or departure")
        
        # Skill gaps
        dev_skills = dev_profile.get('skill_scores', {})
        job_skills = job_req.get('required_skills', [])
        
        missing_critical = []
        for skill in job_skills[:3]:  # Critical skills
            skill_lower = skill.lower().replace(' ', '_')
            if skill_lower not in dev_skills or dev_skills[skill_lower] < 30:
                missing_critical.append(skill)
        
        if missing_critical:
            concerns.append(f"Limited experience with: {', '.join(missing_critical)}")
        
        return concerns[:4]  # Limit to top 4

    def _generate_recommendations(self, dev_profile: Dict, job_req: Dict) -> List[str]:
        """Generate recommendations for improving the match"""
        recommendations = []
        
        # Skill development
        dev_skills = dev_profile.get('skill_scores', {})
        job_skills = job_req.get('required_skills', [])
        
        for skill in job_skills:
            skill_lower = skill.lower().replace(' ', '_')
            if skill_lower not in dev_skills or dev_skills[skill_lower] < 50:
                recommendations.append(f"Consider skills assessment or training in {skill}")
        
        # Interview focus areas
        strong_skills = [skill for skill, score in dev_skills.items() if score > 80]
        if strong_skills:
            recommendations.append(f"Focus interview on demonstrating {strong_skills[0].replace('_', ' ')}")
        
        # Growth opportunities
        if dev_profile.get('experience_level') in ['junior', 'mid']:
            recommendations.append("Highlight growth and learning opportunities")
        
        # Project showcase
        if dev_profile.get('innovation_score', 0) > 60:
            recommendations.append("Ask candidate to showcase their most innovative projects")
        
        return recommendations[:4]  # Limit to top 4

    def _fallback_insights(self, score: float) -> tuple:
        """Fallback insights when AI analysis fails"""
        if score > 80:
            reasons = ["Strong overall compatibility", "Good skill alignment"]
            concerns = ["Verify cultural fit during interview"]
            recommendations = ["Proceed with technical interview", "Assess team collaboration"]
        elif score > 60:
            reasons = ["Reasonable skill match", "Growth potential"]
            concerns = ["Some skill gaps identified", "May need onboarding support"]
            recommendations = ["Conduct thorough skills assessment", "Plan training program"]
        else:
            reasons = ["Potential for growth"]
            concerns = ["Significant skill gaps", "May require extensive training"]
            recommendations = ["Consider for junior positions", "Evaluate learning aptitude"]
        
        return reasons, concerns, recommendations
