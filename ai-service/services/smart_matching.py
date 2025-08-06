from typing import Dict, List

class SmartMatchingEngine:
    def __init__(self):
        self.compatibility_cache = {}
        self.learning_weights = {
            "skills": 0.25,
            "experience": 0.20,
            "culture": 0.15,
            "communication": 0.15,
            "growth_potential": 0.10,
            "location_preferences": 0.08,
            "compensation_alignment": 0.07
        }
        
        # Dynamic weights that learn from successful hires
        self.success_patterns = {}

    async def find_perfect_matches(self, job_id: str, candidate_pool: List[Dict]) -> List[Dict]:
        """
        Find perfect matches using AI-powered analysis
        """
        job_requirements = await self._get_job_requirements(job_id)
        scored_candidates = []
        
        for candidate in candidate_pool:
            compatibility_score = await self._calculate_compatibility(candidate, job_requirements)
            
            enhanced_candidate = {
                **candidate,
                "compatibility_score": compatibility_score,
                "match_breakdown": compatibility_score["breakdown"],
                "predicted_success_rate": compatibility_score["success_probability"],
                "red_flags": await self._detect_red_flags(candidate, job_requirements),
                "growth_potential": await self._assess_growth_potential(candidate),
                "cultural_fit_score": compatibility_score["breakdown"]["culture"]
            }
            
            scored_candidates.append(enhanced_candidate)
        
        # Sort by compatibility score
        scored_candidates.sort(key=lambda x: x["compatibility_score"]["total"], reverse=True)
        
        # Return top matches with insights
        return scored_candidates[:20]  # Top 20 matches

    async def _calculate_compatibility(self, candidate: Dict, job_requirements: Dict) -> Dict:
        """
        Calculate multi-dimensional compatibility score
        """
        scores = {}
        
        # Technical skills matching
        scores["skills"] = await self._match_technical_skills(
            candidate.get("skills", []), 
            job_requirements.get("required_skills", [])
        )
        
        # Experience level matching
        scores["experience"] = await self._match_experience_level(
            candidate.get("experience_years", 0),
            job_requirements.get("experience_range", [0, 20])
        )
        
        # Cultural fit (based on communication style, values)
        scores["culture"] = await self._assess_cultural_fit(candidate, job_requirements)
        
        # Communication skills (from GitHub activity, writing samples)
        scores["communication"] = await self._assess_communication_skills(candidate)
        
        # Growth potential and learning ability
        scores["growth_potential"] = await self._assess_growth_potential(candidate)
        
        # Location and remote work preferences
        scores["location_preferences"] = await self._match_location_preferences(
            candidate, job_requirements
        )
        
        # Compensation expectations vs offer
        scores["compensation_alignment"] = await self._match_compensation(
            candidate, job_requirements
        )
        
        # Calculate weighted total
        total_score = sum(
            scores[category] * self.learning_weights[category] 
            for category in scores
        )
        
        # Predict success probability using historical data
        success_probability = await self._predict_success_probability(scores, job_requirements)
        
        return {
            "total": round(total_score, 2),
            "breakdown": scores,
            "success_probability": success_probability,
            "confidence_level": self._calculate_confidence(scores)
        }

    async def _match_technical_skills(self, candidate_skills: List[str], required_skills: List[str]) -> float:
        """
        Match technical skills with weighted importance
        """
        if not required_skills:
            return 0.8  # Neutral score if no requirements
        
        matched_skills = []
        skill_scores = []
        
        for required_skill in required_skills:
            best_match_score = 0
            
            for candidate_skill in candidate_skills:
                # Exact match
                if candidate_skill.lower() == required_skill.lower():
                    best_match_score = 1.0
                    break
                
                # Fuzzy matching for related skills
                similarity = await self._calculate_skill_similarity(
                    candidate_skill, required_skill
                )
                best_match_score = max(best_match_score, similarity)
            
            skill_scores.append(best_match_score)
            if best_match_score > 0.7:
                matched_skills.append(required_skill)
        
        return sum(skill_scores) / len(skill_scores) if skill_scores else 0

    async def _calculate_skill_similarity(self, skill1: str, skill2: str) -> float:
        """
        Calculate similarity between skills using semantic analysis
        """
        # Skill families for fuzzy matching
        skill_families = {
            "javascript": ["js", "node", "nodejs", "react", "vue", "angular"],
            "python": ["py", "django", "flask", "fastapi", "pandas", "numpy"],
            "blockchain": ["solidity", "web3", "ethereum", "bitcoin", "defi", "smart contracts"],
            "ai": ["machine learning", "ml", "deep learning", "tensorflow", "pytorch", "llm"],
            "cloud": ["aws", "azure", "gcp", "kubernetes", "docker", "devops"]
        }
        
        skill1_lower = skill1.lower()
        skill2_lower = skill2.lower()
        
        # Check if they're in the same family
        for family, members in skill_families.items():
            if skill1_lower in members and skill2_lower in members:
                return 0.8
            if (skill1_lower == family and skill2_lower in members) or \
               (skill2_lower == family and skill1_lower in members):
                return 0.9
        
        # Simple string similarity
        if skill1_lower in skill2_lower or skill2_lower in skill1_lower:
            return 0.7
        
        return 0.0

    async def _match_experience_level(self, candidate_exp: int, required_range: List[int]) -> float:
        """
        Match experience level with optimal range scoring
        """
        min_exp, max_exp = required_range
        
        if min_exp <= candidate_exp <= max_exp:
            # Perfect fit
            return 1.0
        elif candidate_exp < min_exp:
            # Under-qualified, but maybe trainable
            gap = min_exp - candidate_exp
            return max(0.3, 1.0 - (gap * 0.2))
        else:
            # Over-qualified, might be bored or too expensive
            excess = candidate_exp - max_exp
            return max(0.6, 1.0 - (excess * 0.1))

    async def _assess_cultural_fit(self, candidate: Dict, job_requirements: Dict) -> float:
        """
        Assess cultural fit based on communication style and values
        """
        # Analyze GitHub activity for collaboration style
        github_activity = candidate.get("github_analysis", {})
        collaboration_score = github_activity.get("collaboration_score", 0.5)
        
        # Communication style from code comments, PR descriptions
        communication_quality = github_activity.get("communication_quality", 0.5)
        
        # Team size preferences
        company_size = job_requirements.get("company_size", "medium")
        candidate_preferences = candidate.get("preferences", {})
        size_match = self._match_company_size_preference(
            candidate_preferences.get("company_size"), company_size
        )
        
        # Work style (remote, hybrid, office)
        work_style_match = self._match_work_style(
            candidate_preferences.get("work_style") or "hybrid",
            job_requirements.get("work_style") or "hybrid"
        )
        
        return (collaboration_score * 0.3 + 
                communication_quality * 0.3 + 
                size_match * 0.2 + 
                work_style_match * 0.2)

    async def _assess_communication_skills(self, candidate: Dict) -> float:
        """
        Assess communication skills from various sources
        """
        github_data = candidate.get("github_analysis", {})
        
        # Code documentation quality
        doc_quality = github_data.get("documentation_score", 0.5)
        
        # PR and commit message quality
        commit_quality = github_data.get("commit_message_quality", 0.5)
        
        # Issue discussion participation
        community_participation = github_data.get("community_score", 0.5)
        
        return (doc_quality * 0.4 + commit_quality * 0.3 + community_participation * 0.3)

    async def _assess_growth_potential(self, candidate: Dict) -> float:
        """
        Assess candidate's growth potential and learning ability
        """
        github_data = candidate.get("github_analysis", {})
        
        # Learning velocity (new technologies adopted over time)
        learning_velocity = github_data.get("learning_velocity", 0.5)
        
        # Innovation score (unique projects, creative solutions)
        innovation = github_data.get("innovation_score", 0.5)
        
        # Contribution growth trend
        contribution_trend = github_data.get("contribution_trend", 0.5)
        
        # Diverse technology exposure
        tech_diversity = len(github_data.get("languages", [])) / 10  # Normalize
        tech_diversity = min(1.0, tech_diversity)
        
        return (learning_velocity * 0.3 + innovation * 0.3 + 
                contribution_trend * 0.2 + tech_diversity * 0.2)

    async def _match_location_preferences(self, candidate: Dict, job_requirements: Dict) -> float:
        """
        Match location and remote work preferences
        """
        candidate_location = candidate.get("location", "")
        job_location = job_requirements.get("location", "")
        remote_ok = job_requirements.get("remote_friendly", False)
        
        candidate_prefs = candidate.get("preferences", {})
        wants_remote = candidate_prefs.get("remote_work", False)
        willing_to_relocate = candidate_prefs.get("willing_to_relocate", False)
        
        # Perfect matches
        if remote_ok and wants_remote:
            return 1.0
        
        if candidate_location.lower() in job_location.lower():
            return 1.0
        
        # Partial matches
        if willing_to_relocate:
            return 0.7
        
        if remote_ok:  # Job allows remote but candidate prefers office
            return 0.8
        
        return 0.3  # Location mismatch

    async def _match_compensation(self, candidate: Dict, job_requirements: Dict) -> float:
        """
        Match compensation expectations
        """
        candidate_exp = candidate.get("salary_expectation", 0)
        job_range = job_requirements.get("salary_range", [0, 1000000])
        
        if not candidate_exp:
            return 0.8  # Neutral if no expectation provided
        
        min_salary, max_salary = job_range
        
        if min_salary <= candidate_exp <= max_salary:
            return 1.0
        elif candidate_exp < min_salary:
            # Candidate expects less (good for company)
            return 0.9
        else:
            # Candidate expects more
            overage = (candidate_exp - max_salary) / max_salary
            return max(0.2, 1.0 - overage)

    async def _predict_success_probability(self, scores: Dict, job_requirements: Dict) -> float:
        """
        Predict hiring success probability based on historical patterns
        """
        # Use historical success patterns
        job_type = job_requirements.get("job_type", "general")
        
        if job_type in self.success_patterns:
            pattern = self.success_patterns[job_type]
            
            # Weight scores based on what's been successful for this job type
            weighted_score = sum(
                scores[category] * pattern.get(category, 0.5) 
                for category in scores
            ) / len(scores)
        else:
            # Default weighting
            weighted_score = sum(scores.values()) / len(scores)
        
        # Apply sigmoid function for probability
        import math
        probability = 1 / (1 + math.exp(-5 * (weighted_score - 0.5)))
        
        return round(probability, 3)

    def _calculate_confidence(self, scores: Dict) -> float:
        """
        Calculate confidence level in the matching
        """
        # Higher confidence when scores are consistent
        score_values = list(scores.values())
        mean_score = sum(score_values) / len(score_values)
        variance = sum((score - mean_score) ** 2 for score in score_values) / len(score_values)
        
        # Lower variance = higher confidence
        confidence = max(0.3, 1.0 - variance)
        return round(confidence, 2)

    async def _detect_red_flags(self, candidate: Dict, job_requirements: Dict) -> List[str]:
        """
        Detect potential red flags in candidate profile
        """
        red_flags = []
        
        github_data = candidate.get("github_analysis", {})
        
        # Check for concerning patterns
        if github_data.get("contribution_score", 100) < 20:
            red_flags.append("Very low GitHub activity")
        
        if github_data.get("collaboration_score", 1.0) < 0.3:
            red_flags.append("Limited collaboration history")
        
        # Check job hopping pattern
        experience = candidate.get("work_experience", [])
        if len(experience) > 5:
            short_tenures = [job for job in experience if job.get("duration_months", 24) < 12]
            if len(short_tenures) > 2:
                red_flags.append("Frequent job changes (job hopping pattern)")
        
        # Skill gaps
        required_skills = job_requirements.get("required_skills", [])
        candidate_skills = candidate.get("skills", [])
        
        critical_missing = []
        for skill in required_skills[:3]:  # Check top 3 critical skills
            if not any(skill.lower() in cs.lower() for cs in candidate_skills):
                critical_missing.append(skill)
        
        if critical_missing:
            red_flags.append(f"Missing critical skills: {', '.join(critical_missing)}")
        
        return red_flags

    def _match_company_size_preference(self, candidate_pref: str, company_size: str) -> float:
        """
        Match company size preferences
        """
        if not candidate_pref:
            return 0.7  # Neutral
        
        if candidate_pref.lower() == company_size.lower():
            return 1.0
        
        # Some flexibility
        size_map = {"startup": 0, "small": 1, "medium": 2, "large": 3, "enterprise": 4}
        
        cand_size = size_map.get(candidate_pref.lower(), 2)
        comp_size = size_map.get(company_size.lower(), 2)
        
        diff = abs(cand_size - comp_size)
        return max(0.4, 1.0 - (diff * 0.2))

    def _match_work_style(self, candidate_style: str, job_style: str) -> float:
        """
        Match work style preferences
        """
        if not candidate_style:
            return 0.7  # Neutral
        
        if candidate_style.lower() == job_style.lower():
            return 1.0
        
        # Compatibility matrix
        compatibility = {
            ("remote", "hybrid"): 0.8,
            ("hybrid", "remote"): 0.9,
            ("office", "hybrid"): 0.7,
            ("hybrid", "office"): 0.6,
            ("remote", "office"): 0.3,
            ("office", "remote"): 0.2
        }
        
        return compatibility.get((candidate_style.lower(), job_style.lower()), 0.5)

    async def _get_job_requirements(self, job_id: str) -> Dict:
        """
        Get job requirements from database
        """
        # This would query your database
        # For now, return mock data
        return {
            "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
            "experience_range": [2, 5],
            "job_type": "backend_engineer",
            "company_size": "startup",
            "work_style": "hybrid",
            "location": "San Francisco",
            "remote_friendly": True,
            "salary_range": [120000, 180000]
        }

    async def learn_from_successful_hire(self, candidate_id: str, job_id: str, 
                                       success_metrics: Dict):
        """
        Learn from successful hires to improve future matching
        """
        # Update success patterns based on what worked
        job_requirements = await self._get_job_requirements(job_id)
        job_type = job_requirements.get("job_type", "general")
        
        if job_type not in self.success_patterns:
            self.success_patterns[job_type] = {}
        
        # Adjust weights based on success metrics
        performance_score = success_metrics.get("performance_score", 0.5)
        retention_months = success_metrics.get("retention_months", 12)
        
        # Higher performance and retention = reinforce the pattern
        learning_rate = 0.1
        pattern = self.success_patterns[job_type]
        
        for category in self.learning_weights:
            current_weight = pattern.get(category, self.learning_weights[category])
            
            # Adjust based on success
            if performance_score > 0.8 and retention_months > 18:
                # Successful hire, increase weight slightly
                pattern[category] = current_weight + (learning_rate * performance_score)
            elif performance_score < 0.5 or retention_months < 6:
                # Poor outcome, decrease weight
                pattern[category] = current_weight - (learning_rate * (1 - performance_score))
        
        print(f"🤖 Learned from successful hire. Updated {job_type} matching patterns.")

# Global instance
smart_matching_engine = SmartMatchingEngine()
