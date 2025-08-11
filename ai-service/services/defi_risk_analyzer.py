"""
DeFi Risk Analyzer Service
AI-powered risk assessment for DeFi protocols used by banks
"""

import asyncio
import aiohttp
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import numpy as np

logger = logging.getLogger(__name__)

class DeFiRiskAnalyzer:
    def __init__(self):
        self.risk_thresholds = {
            "LOW": 0.3,
            "MEDIUM": 0.6, 
            "HIGH": 0.8,
            "CRITICAL": 1.0
        }
        
        # Known secure protocols with historical data
        self.protocol_whitelist = {
            "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9": {  # Aave V2
                "name": "Aave V2",
                "base_risk": 0.15,
                "tvl_threshold": 1000000000,  # $1B
                "audit_status": "MULTIPLE_AUDITS"
            },
            "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B": {  # Compound
                "name": "Compound",
                "base_risk": 0.18,
                "tvl_threshold": 500000000,   # $500M
                "audit_status": "AUDITED"
            }
        }
    
    async def analyze_protocol_risk(self, protocol_address: str, institution_address: Optional[str] = None) -> dict:
        """
        Comprehensive DeFi protocol risk analysis using multiple data sources
        """
        try:
            logger.info(f"Analyzing risk for protocol: {protocol_address}")
            
            # Get protocol data from multiple sources
            protocol_data = await self._fetch_protocol_data(protocol_address)
            tvl_data = await self._analyze_tvl_stability(protocol_address)
            audit_data = await self._check_audit_status(protocol_address)
            governance_data = await self._analyze_governance_risk(protocol_address)
            smart_contract_risk = await self._analyze_smart_contract_risk(protocol_address)
            
            # Calculate composite risk score
            risk_factors = {
                "smart_contract_risk": smart_contract_risk,
                "liquidity_risk": tvl_data["liquidity_risk"],
                "governance_risk": governance_data["governance_risk"],
                "audit_risk": audit_data["audit_risk"],
                "market_risk": await self._calculate_market_risk(protocol_address),
                "operational_risk": await self._calculate_operational_risk(protocol_address)
            }
            
            # Weighted risk calculation
            weights = {
                "smart_contract_risk": 0.25,
                "liquidity_risk": 0.20,
                "governance_risk": 0.15,
                "audit_risk": 0.15,
                "market_risk": 0.15,
                "operational_risk": 0.10
            }
            
            composite_risk = sum(risk_factors[factor] * weights[factor] for factor in risk_factors)
            risk_level = self._determine_risk_level(composite_risk)
            
            # Generate recommendations
            recommendation = self._generate_recommendation(composite_risk, risk_factors)
            max_exposure = self._calculate_max_exposure(composite_risk, institution_address)
            
            return {
                "protocol_address": protocol_address,
                "protocol_name": protocol_data.get("name", "Unknown"),
                "risk_score": round(composite_risk, 3),
                "risk_level": risk_level,
                "risk_factors": risk_factors,
                "tvl_usd": tvl_data["tvl_usd"],
                "audit_status": audit_data["status"],
                "recommendation": recommendation,
                "max_exposure_percentage": max_exposure,
                "analysis_timestamp": datetime.utcnow().isoformat(),
                "confidence_score": self._calculate_confidence_score(protocol_data),
                "monitoring_alerts": self._generate_monitoring_alerts(risk_factors)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing protocol risk: {str(e)}")
            return {
                "protocol_address": protocol_address,
                "risk_score": 1.0,  # Maximum risk on error
                "risk_level": "CRITICAL",
                "error": str(e),
                "recommendation": "BLOCKED_ANALYSIS_FAILED",
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
    
    async def _fetch_protocol_data(self, protocol_address: str) -> dict:
        """Fetch basic protocol information"""
        # Check if it's a known protocol
        if protocol_address.lower() in self.protocol_whitelist:
            return self.protocol_whitelist[protocol_address.lower()]
        
        # Simulate fetching from DeFiLlama or similar API
        return {
            "name": f"Protocol_{protocol_address[:8]}",
            "category": "lending",
            "chain": "ethereum"
        }
    
    async def _analyze_tvl_stability(self, protocol_address: str) -> dict:
        """Analyze Total Value Locked stability"""
        # Simulate TVL analysis
        if protocol_address.lower() in self.protocol_whitelist:
            base_tvl = self.protocol_whitelist[protocol_address.lower()]["tvl_threshold"]
            volatility = np.random.uniform(0.05, 0.15)  # 5-15% volatility
        else:
            base_tvl = np.random.uniform(10000000, 100000000)  # $10M-$100M
            volatility = np.random.uniform(0.20, 0.50)  # Higher volatility for unknown protocols
        
        liquidity_risk = min(volatility * 2, 0.9)  # Cap at 90%
        
        return {
            "tvl_usd": base_tvl,
            "volatility_30d": volatility,
            "liquidity_risk": liquidity_risk
        }
    
    async def _check_audit_status(self, protocol_address: str) -> dict:
        """Check audit status and security reports"""
        if protocol_address.lower() in self.protocol_whitelist:
            audit_info = self.protocol_whitelist[protocol_address.lower()]
            if audit_info["audit_status"] == "MULTIPLE_AUDITS":
                return {"status": "MULTIPLE_AUDITS", "audit_risk": 0.05}
            else:
                return {"status": "AUDITED", "audit_risk": 0.10}
        else:
            # Unknown protocol - higher risk
            return {"status": "UNAUDITED", "audit_risk": 0.70}
    
    async def _analyze_governance_risk(self, protocol_address: str) -> dict:
        """Analyze governance decentralization and risk"""
        if protocol_address.lower() in self.protocol_whitelist:
            governance_risk = np.random.uniform(0.10, 0.25)
        else:
            governance_risk = np.random.uniform(0.40, 0.80)
        
        return {"governance_risk": governance_risk}
    
    async def _analyze_smart_contract_risk(self, protocol_address: str) -> float:
        """Analyze smart contract security risks"""
        if protocol_address.lower() in self.protocol_whitelist:
            return np.random.uniform(0.05, 0.20)  # Low risk for known protocols
        else:
            return np.random.uniform(0.50, 0.90)  # High risk for unknown
    
    async def _calculate_market_risk(self, protocol_address: str) -> float:
        """Calculate market-related risks"""
        return np.random.uniform(0.10, 0.40)
    
    async def _calculate_operational_risk(self, protocol_address: str) -> float:
        """Calculate operational risks"""
        return np.random.uniform(0.05, 0.30)
    
    def _determine_risk_level(self, risk_score: float) -> str:
        """Convert risk score to risk level"""
        for level, threshold in self.risk_thresholds.items():
            if risk_score <= threshold:
                return level
        return "CRITICAL"
    
    def _generate_recommendation(self, risk_score: float, risk_factors: dict) -> str:
        """Generate institutional recommendation"""
        if risk_score <= 0.3:
            return "APPROVED_FOR_INSTITUTIONAL_USE"
        elif risk_score <= 0.6:
            return "APPROVED_WITH_LIMITATIONS" 
        elif risk_score <= 0.8:
            return "REQUIRES_ADDITIONAL_REVIEW"
        else:
            return "BLOCKED_HIGH_RISK"
    
    def _calculate_max_exposure(self, risk_score: float, institution_address: Optional[str]) -> float:
        """Calculate maximum recommended exposure percentage"""
        if risk_score <= 0.2:
            return 25.0  # Up to 25% for very low risk
        elif risk_score <= 0.4:
            return 15.0
        elif risk_score <= 0.6:
            return 5.0
        else:
            return 0.0  # No exposure for high risk
    
    def _calculate_confidence_score(self, protocol_data: dict) -> float:
        """Calculate confidence in the analysis"""
        base_confidence = 0.7
        if "name" in protocol_data and protocol_data["name"] != "Unknown":
            base_confidence += 0.2
        return min(base_confidence, 1.0)
    
    def _generate_monitoring_alerts(self, risk_factors: dict) -> List[str]:
        """Generate monitoring alerts based on risk factors"""
        alerts = []
        
        if risk_factors["liquidity_risk"] > 0.5:
            alerts.append("HIGH_LIQUIDITY_RISK")
        if risk_factors["smart_contract_risk"] > 0.4:
            alerts.append("SMART_CONTRACT_SECURITY_CONCERN")
        if risk_factors["governance_risk"] > 0.6:
            alerts.append("GOVERNANCE_CENTRALIZATION_RISK")
            
        return alerts

    async def analyze_aml_compliance(self, transaction_data: dict) -> dict:
        """
        Anti-Money Laundering (AML) compliance analysis
        """
        try:
            # Analyze transaction patterns
            suspicious_patterns = []
            risk_score = 0.0
            
            # Check transaction amount
            amount = transaction_data.get("amount_usd", 0)
            if amount > 10000:  # Large transaction threshold
                risk_score += 0.3
                suspicious_patterns.append("LARGE_TRANSACTION")
            
            # Check frequency
            frequency = transaction_data.get("frequency_24h", 0)
            if frequency > 10:
                risk_score += 0.2
                suspicious_patterns.append("HIGH_FREQUENCY")
            
            # Check counterparty risk
            counterparty = transaction_data.get("counterparty_address", "")
            if await self._is_sanctioned_address(counterparty):
                risk_score += 0.8
                suspicious_patterns.append("SANCTIONED_COUNTERPARTY")
            
            # Geographic risk
            geo_risk = await self._analyze_geographic_risk(transaction_data)
            risk_score += geo_risk
            
            compliance_level = "COMPLIANT" if risk_score < 0.5 else "REQUIRES_REVIEW" if risk_score < 0.8 else "BLOCKED"
            
            return {
                "transaction_id": transaction_data.get("tx_hash", ""),
                "aml_risk_score": round(risk_score, 3),
                "compliance_level": compliance_level,
                "suspicious_patterns": suspicious_patterns,
                "requires_manual_review": risk_score > 0.5,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"AML analysis error: {str(e)}")
            return {
                "aml_risk_score": 1.0,
                "compliance_level": "BLOCKED",
                "error": str(e)
            }
    
    async def _is_sanctioned_address(self, address: str) -> bool:
        """Check if address is on sanctions list"""
        # In production, this would check against OFAC SDN list, etc.
        sanctioned_addresses = {
            "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",  # Example sanctioned address
            "0x901bb9583b24D97e995513C6778dc6888AB6870e"   # Another example
        }
        return address.lower() in [addr.lower() for addr in sanctioned_addresses]
    
    async def _analyze_geographic_risk(self, transaction_data: dict) -> float:
        """Analyze geographic risk factors"""
        # Simulate geographic analysis
        high_risk_countries = ["XX", "YY", "ZZ"]  # High-risk jurisdiction codes
        origin_country = transaction_data.get("origin_country", "")
        
        if origin_country in high_risk_countries:
            return 0.4
        return 0.1
    
    async def generate_compliance_report(self, institution_id: str, time_period: str = "30d") -> dict:
        """
        Generate comprehensive compliance report for institution
        """
        try:
            # Simulate fetching institution data
            protocols_analyzed = await self._get_institution_protocols(institution_id)
            transactions_analyzed = await self._get_institution_transactions(institution_id, time_period)
            
            # Aggregate risk metrics
            avg_protocol_risk = np.mean([p["risk_score"] for p in protocols_analyzed])
            high_risk_protocols = [p for p in protocols_analyzed if p["risk_score"] > 0.6]
            flagged_transactions = [t for t in transactions_analyzed if t["aml_risk_score"] > 0.5]
            
            return {
                "institution_id": institution_id,
                "report_period": time_period,
                "summary": {
                    "total_protocols_analyzed": len(protocols_analyzed),
                    "average_protocol_risk": round(avg_protocol_risk, 3),
                    "high_risk_protocols": len(high_risk_protocols),
                    "total_transactions_analyzed": len(transactions_analyzed),
                    "flagged_transactions": len(flagged_transactions),
                    "overall_compliance_score": self._calculate_compliance_score(avg_protocol_risk, len(flagged_transactions))
                },
                "protocol_breakdown": protocols_analyzed,
                "high_risk_protocols": high_risk_protocols,
                "flagged_transactions": flagged_transactions,
                "recommendations": self._generate_compliance_recommendations(avg_protocol_risk, high_risk_protocols),
                "report_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Compliance report generation error: {str(e)}")
            return {"error": str(e)}
    
    async def _get_institution_protocols(self, institution_id: str) -> List[dict]:
        """Get protocols used by institution"""
        # Simulate institutional protocol usage data
        sample_protocols = [
            "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",  # Aave
            "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",  # Compound
        ]
        
        results = []
        for protocol in sample_protocols:
            analysis = await self.analyze_protocol_risk(protocol, institution_id)
            results.append(analysis)
        
        return results
    
    async def _get_institution_transactions(self, institution_id: str, time_period: str) -> List[dict]:
        """Get institution transactions for analysis"""
        # Simulate transaction data
        sample_transactions = [
            {
                "tx_hash": "0xabc123...",
                "amount_usd": 50000,
                "frequency_24h": 5,
                "counterparty_address": "0x123...",
                "origin_country": "US"
            },
            {
                "tx_hash": "0xdef456...", 
                "amount_usd": 150000,
                "frequency_24h": 15,
                "counterparty_address": "0x456...",
                "origin_country": "SG"
            }
        ]
        
        results = []
        for tx in sample_transactions:
            analysis = await self.analyze_aml_compliance(tx)
            results.append(analysis)
        
        return results
    
    def _calculate_compliance_score(self, avg_protocol_risk: float, flagged_tx_count: int) -> float:
        """Calculate overall compliance score"""
        base_score = 1.0 - avg_protocol_risk
        transaction_penalty = min(flagged_tx_count * 0.1, 0.5)
        return max(base_score - transaction_penalty, 0.0)
    
    def _generate_compliance_recommendations(self, avg_risk: float, high_risk_protocols: List[dict]) -> List[str]:
        """Generate compliance recommendations"""
        recommendations = []
        
        if avg_risk > 0.6:
            recommendations.append("REDUCE_OVERALL_PROTOCOL_EXPOSURE")
        
        if len(high_risk_protocols) > 0:
            recommendations.append("REVIEW_HIGH_RISK_PROTOCOLS")
            recommendations.append("IMPLEMENT_ADDITIONAL_MONITORING")
        
        if avg_risk < 0.3:
            recommendations.append("CURRENT_COMPLIANCE_ADEQUATE")
        
        return recommendations
