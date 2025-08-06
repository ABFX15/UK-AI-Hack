import asyncio
import os
from typing import Dict, List, Optional
from github import Github
import pandas as pd
import numpy as np
from collections import defaultdict, Counter
import re
from datetime import datetime, timedelta

class GitHubAnalyzer:
    def __init__(self):
        self.github = Github(os.getenv("GITHUB_TOKEN"))
        
        # Web3/Blockchain skill keywords
        self.web3_skills = {
            "solidity": ["solidity", "smart contract", "smartcontract"],
            "rust": ["rust", "solana", "substrate", "polkadot"],
            "javascript": ["web3.js", "ethers.js", "web3", "dapp"],
            "python": ["web3.py", "brownie", "ape"],
            "go": ["geth", "ethereum", "cosmos"],
            "defi": ["defi", "uniswap", "compound", "aave", "yield"],
            "nft": ["nft", "erc721", "erc1155", "opensea"],
            "blockchain": ["blockchain", "bitcoin", "ethereum", "polygon", "arbitrum"],
            "layer2": ["layer2", "optimism", "arbitrum", "polygon", "zksync"],
            "cryptography": ["cryptography", "merkle", "hash", "signature"],
        }
        
        # Experience level indicators
        self.experience_indicators = {
            "junior": ["beginner", "learning", "first", "tutorial", "practice"],
            "mid": ["intermediate", "building", "developing", "implementing"],
            "senior": ["lead", "architect", "optimizing", "scaling", "production"],
            "expert": ["research", "protocol", "whitepaper", "innovation", "cutting-edge"]
        }

    async def analyze_profile(self, username: str, detailed: bool = True) -> Dict:
        """
        Advanced AI-powered GitHub profile analysis
        """
        try:
            user = self.github.get_user(username)
            repos = list(user.get_repos())
            
            # Basic metrics
            basic_metrics = self._calculate_basic_metrics(user, repos)
            
            # Skill analysis
            skill_scores = await self._analyze_skills(repos)
            
            # Experience level
            experience_level = self._determine_experience_level(repos, user)
            
            # Specializations
            specializations = self._find_specializations(repos, skill_scores)
            
            # Advanced metrics
            activity_score = self._calculate_activity_score(repos, user)
            collaboration_score = self._calculate_collaboration_score(repos)
            innovation_score = self._calculate_innovation_score(repos)
            contribution_quality = self._assess_contribution_quality(repos)
            
            # Overall score
            overall_score = self._calculate_overall_score({
                'skill_scores': skill_scores,
                'activity': activity_score,
                'collaboration': collaboration_score,
                'innovation': innovation_score,
                'quality': contribution_quality
            })
            
            # Insights
            strengths = self._identify_strengths(skill_scores, repos)
            improvements = self._suggest_improvements(skill_scores, repos)
            recommended_roles = self._recommend_roles(skill_scores, experience_level)
            
            return {
                "username": username,
                "skill_scores": skill_scores,
                "experience_level": experience_level,
                "specializations": specializations,
                "activity_score": activity_score,
                "contribution_quality": contribution_quality,
                "collaboration_score": collaboration_score,
                "innovation_score": innovation_score,
                "overall_score": overall_score,
                "strengths": strengths,
                "areas_for_improvement": improvements,
                "recommended_roles": recommended_roles,
                **basic_metrics
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze GitHub profile: {str(e)}")

    def _calculate_basic_metrics(self, user, repos) -> Dict:
        """Calculate basic GitHub metrics"""
        total_stars = sum(repo.stargazers_count for repo in repos)
        total_forks = sum(repo.forks_count for repo in repos)
        
        return {
            "total_repos": len(repos),
            "total_stars": total_stars,
            "total_forks": total_forks,
            "followers": user.followers,
            "following": user.following,
            "public_gists": user.public_gists
        }

    async def _analyze_skills(self, repos) -> Dict[str, float]:
        """Analyze programming skills and Web3 expertise"""
        skill_scores = defaultdict(float)
        language_count = Counter()
        
        for repo in repos[:50]:  # Limit to avoid rate limits
            try:
                # Language analysis
                languages = repo.get_languages()
                for lang, bytes_count in languages.items():
                    language_count[lang.lower()] += bytes_count
                
                # README and description analysis
                readme_content = self._get_readme_content(repo)
                description = repo.description or ""
                content = f"{description} {readme_content}".lower()
                
                # Web3 skill detection
                for skill, keywords in self.web3_skills.items():
                    for keyword in keywords:
                        if keyword in content:
                            skill_scores[skill] += 1
                            
                # Boost scores based on repo quality
                quality_multiplier = self._calculate_repo_quality_score(repo)
                for skill in skill_scores:
                    skill_scores[skill] *= quality_multiplier
                    
            except Exception:
                continue
        
        # Normalize language scores
        total_bytes = sum(language_count.values())
        if total_bytes > 0:
            for lang, bytes_count in language_count.items():
                skill_scores[f"lang_{lang}"] = (bytes_count / total_bytes) * 100
        
        # Convert to regular dict with normalized scores (0-100)
        max_score = max(skill_scores.values()) if skill_scores else 1
        normalized_scores = {}
        for skill, score in skill_scores.items():
            normalized_scores[skill] = min(100, (score / max_score) * 100)
            
        return normalized_scores

    def _get_readme_content(self, repo) -> str:
        """Get README content from repository"""
        try:
            readme = repo.get_readme()
            content = readme.decoded_content.decode('utf-8')
            return content[:2000]  # Limit content size
        except Exception:
            return ""

    def _calculate_repo_quality_score(self, repo) -> float:
        """Calculate repository quality multiplier"""
        score = 1.0
        
        # Stars boost
        if repo.stargazers_count > 10:
            score += 0.5
        if repo.stargazers_count > 100:
            score += 1.0
            
        # Has documentation
        if repo.description:
            score += 0.3
            
        # Recent activity
        if repo.updated_at > datetime.now() - timedelta(days=90):
            score += 0.4
            
        # Not a fork
        if not repo.fork:
            score += 0.5
            
        return min(score, 3.0)  # Cap at 3x multiplier

    def _determine_experience_level(self, repos, user) -> str:
        """Determine developer experience level"""
        # Account age
        account_age_years = (datetime.now() - user.created_at).days / 365
        
        # Contribution patterns
        total_stars = sum(repo.stargazers_count for repo in repos)
        original_repos = [repo for repo in repos if not repo.fork]
        
        # Scoring
        score = 0
        
        # Age factor
        if account_age_years > 3:
            score += 3
        elif account_age_years > 1:
            score += 2
        else:
            score += 1
            
        # Repository quality
        if len(original_repos) > 20:
            score += 3
        elif len(original_repos) > 10:
            score += 2
        else:
            score += 1
            
        # Community recognition
        if total_stars > 500:
            score += 3
        elif total_stars > 50:
            score += 2
        else:
            score += 1
            
        # Determine level
        if score >= 8:
            return "expert"
        elif score >= 6:
            return "senior"
        elif score >= 4:
            return "mid"
        else:
            return "junior"

    def _find_specializations(self, repos, skill_scores) -> List[str]:
        """Find developer specializations"""
        specializations = []
        
        # Get top skills
        sorted_skills = sorted(skill_scores.items(), key=lambda x: x[1], reverse=True)
        top_skills = sorted_skills[:5]
        
        for skill, score in top_skills:
            if score > 50:  # High proficiency threshold
                if skill.startswith("lang_"):
                    lang = skill.replace("lang_", "")
                    specializations.append(f"{lang.title()} Development")
                else:
                    specializations.append(skill.replace("_", " ").title())
        
        # Detect patterns
        web3_score = sum(score for skill, score in skill_scores.items() 
                        if skill in self.web3_skills)
        
        if web3_score > 200:
            specializations.append("Web3 & Blockchain")
        if skill_scores.get("defi", 0) > 30:
            specializations.append("DeFi Protocols")
        if skill_scores.get("nft", 0) > 30:
            specializations.append("NFT & Digital Assets")
            
        return specializations[:7]  # Limit to top specializations

    def _calculate_activity_score(self, repos, user) -> float:
        """Calculate developer activity score"""
        recent_activity = 0
        total_commits = 0
        
        for repo in repos[:20]:  # Limit to avoid rate limits
            try:
                # Check recent commits
                commits = list(repo.get_commits(since=datetime.now() - timedelta(days=90)))
                recent_activity += len(commits)
                
                # Total commits estimation
                total_commits += repo.size  # Rough estimation
                
            except Exception:
                continue
        
        # Normalize score (0-100)
        activity_score = min(100, (recent_activity * 2) + (total_commits / 1000))
        return round(activity_score, 2)

    def _calculate_collaboration_score(self, repos) -> float:
        """Calculate collaboration score based on forks, contributors, etc."""
        collaboration_indicators = 0
        
        for repo in repos[:30]:
            try:
                # Forks indicate collaboration
                if repo.forks_count > 0:
                    collaboration_indicators += min(repo.forks_count, 10)
                
                # Issues and PRs indicate community engagement
                issues = repo.get_issues(state='all')
                collaboration_indicators += min(len(list(issues)), 20)
                
            except Exception:
                continue
        
        # Normalize to 0-100
        score = min(100, collaboration_indicators)
        return round(score, 2)

    def _calculate_innovation_score(self, repos) -> float:
        """Calculate innovation score based on original projects"""
        innovation_score = 0
        
        original_repos = [repo for repo in repos if not repo.fork]
        
        for repo in original_repos[:20]:
            try:
                # Stars indicate innovation/usefulness
                stars = repo.stargazers_count
                if stars > 0:
                    innovation_score += min(stars * 0.5, 25)
                
                # Recent original work
                if repo.updated_at > datetime.now() - timedelta(days=180):
                    innovation_score += 5
                    
            except Exception:
                continue
        
        # Normalize to 0-100
        score = min(100, innovation_score)
        return round(score, 2)

    def _assess_contribution_quality(self, repos) -> float:
        """Assess the quality of contributions"""
        quality_score = 0
        
        for repo in repos[:25]:
            try:
                # Documentation quality
                readme_content = self._get_readme_content(repo)
                if len(readme_content) > 500:
                    quality_score += 3
                elif len(readme_content) > 100:
                    quality_score += 1
                
                # Code organization (has description)
                if repo.description:
                    quality_score += 2
                
                # Community engagement
                if repo.stargazers_count > 5:
                    quality_score += 3
                    
            except Exception:
                continue
        
        # Normalize to 0-100
        score = min(100, quality_score)
        return round(score, 2)

    def _calculate_overall_score(self, metrics) -> float:
        """Calculate weighted overall score"""
        weights = {
            'skill_scores': 0.3,
            'activity': 0.2,
            'collaboration': 0.2,
            'innovation': 0.15,
            'quality': 0.15
        }
        
        # Get average skill score
        skill_avg = np.mean(list(metrics['skill_scores'].values())) if metrics['skill_scores'] else 0
        
        weighted_score = (
            skill_avg * weights['skill_scores'] +
            metrics['activity'] * weights['activity'] +
            metrics['collaboration'] * weights['collaboration'] +
            metrics['innovation'] * weights['innovation'] +
            metrics['quality'] * weights['quality']
        )
        
        return round(weighted_score, 2)

    def _identify_strengths(self, skill_scores, repos) -> List[str]:
        """Identify developer strengths"""
        strengths = []
        
        # Top skills
        top_skills = sorted(skill_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        for skill, score in top_skills:
            if score > 60:
                strengths.append(f"Strong {skill.replace('_', ' ').title()} expertise")
        
        # Repository patterns
        original_repos = [repo for repo in repos if not repo.fork]
        if len(original_repos) > 15:
            strengths.append("Prolific open-source contributor")
        
        total_stars = sum(repo.stargazers_count for repo in repos)
        if total_stars > 100:
            strengths.append("Creates popular and useful projects")
            
        return strengths

    def _suggest_improvements(self, skill_scores, repos) -> List[str]:
        """Suggest areas for improvement"""
        improvements = []
        
        # Check for missing Web3 skills
        web3_skills_present = sum(1 for skill in self.web3_skills if skill in skill_scores)
        if web3_skills_present < 3:
            improvements.append("Expand Web3 and blockchain technology skills")
        
        # Check documentation
        documented_repos = sum(1 for repo in repos[:20] if repo.description)
        if documented_repos < len(repos[:20]) * 0.5:
            improvements.append("Improve project documentation and descriptions")
        
        # Check collaboration
        collab_repos = sum(1 for repo in repos[:20] if repo.forks_count > 0)
        if collab_repos < 3:
            improvements.append("Engage more with the developer community")
            
        return improvements

    def _recommend_roles(self, skill_scores, experience_level) -> List[str]:
        """Recommend suitable roles based on analysis"""
        roles = []
        
        # Based on top skills
        if skill_scores.get("solidity", 0) > 50:
            roles.append("Smart Contract Developer")
        if skill_scores.get("defi", 0) > 40:
            roles.append("DeFi Protocol Developer")
        if skill_scores.get("rust", 0) > 50:
            roles.append("Blockchain Core Developer")
        if skill_scores.get("lang_javascript", 0) > 60:
            roles.append("Frontend Web3 Developer")
        if skill_scores.get("lang_python", 0) > 60:
            roles.append("Blockchain Backend Developer")
        
        # Based on experience level
        if experience_level in ["senior", "expert"]:
            roles.extend(["Lead Developer", "Technical Architect", "CTO"])
        elif experience_level == "mid":
            roles.extend(["Senior Developer", "Team Lead"])
        else:
            roles.extend(["Junior Developer", "Developer Intern"])
            
        return roles[:5]  # Limit to top 5 recommendations

    async def get_trending_skills(self) -> List[Dict]:
        """Get trending skills in Web3 space"""
        # This would typically query a database of recent job postings
        # For now, return static trending skills
        trending = [
            {"skill": "Solidity", "growth": 25.3, "demand": "high"},
            {"skill": "Rust", "growth": 45.2, "demand": "high"},
            {"skill": "Layer 2", "growth": 35.1, "demand": "medium"},
            {"skill": "DeFi", "growth": 15.8, "demand": "high"},
            {"skill": "NFTs", "growth": -5.2, "demand": "medium"},
            {"skill": "Web3.js", "growth": 20.1, "demand": "high"},
            {"skill": "Smart Contracts", "growth": 30.5, "demand": "high"},
        ]
        return trending
