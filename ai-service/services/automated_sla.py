from typing import Dict, Optional
from datetime import datetime, timedelta
from enum import Enum
import asyncio

class SLAType(Enum):
    RESPONSE_TIME = "response_time"
    INTERVIEW_SCHEDULING = "interview_scheduling"
    FEEDBACK_DELIVERY = "feedback_delivery"
    OFFER_DECISION = "offer_decision"
    ONBOARDING_START = "onboarding_start"

class SLAStatus(Enum):
    ACTIVE = "active"
    WARNING = "warning"
    VIOLATED = "violated"
    COMPLETED = "completed"

class AutomatedSLAEngine:
    def __init__(self):
        self.active_slas = {}
        self.violation_handlers = {}
        
        # Default SLA timeframes (in hours)
        self.default_slas = {
            SLAType.RESPONSE_TIME: 24,  # Respond to application in 24h
            SLAType.INTERVIEW_SCHEDULING: 72,  # Schedule interview within 3 days
            SLAType.FEEDBACK_DELIVERY: 48,  # Deliver feedback within 2 days
            SLAType.OFFER_DECISION: 120,  # Make offer decision within 5 days
            SLAType.ONBOARDING_START: 168,  # Start onboarding within 1 week
        }
        
        # Reputation impact for violations
        self.violation_penalties = {
            SLAType.RESPONSE_TIME: -5,
            SLAType.INTERVIEW_SCHEDULING: -10,
            SLAType.FEEDBACK_DELIVERY: -8,
            SLAType.OFFER_DECISION: -12,
            SLAType.ONBOARDING_START: -15,
        }

    async def create_sla(self, application_id: str, company_id: str, sla_type: SLAType, 
                        custom_hours: Optional[int] = None) -> Dict:
        """
        Create a new SLA with automated monitoring
        """
        hours = custom_hours or self.default_slas[sla_type]
        deadline = datetime.now() + timedelta(hours=hours)
        warning_time = deadline - timedelta(hours=hours * 0.2)  # 20% before deadline
        
        sla = {
            "id": f"{application_id}_{sla_type.value}",
            "application_id": application_id,
            "company_id": company_id,
            "sla_type": sla_type,
            "created_at": datetime.now(),
            "deadline": deadline,
            "warning_time": warning_time,
            "status": SLAStatus.ACTIVE,
            "automated_actions": [],
            "escalation_level": 0
        }
        
        self.active_slas[sla["id"]] = sla
        
        # Schedule automated checks
        await self._schedule_sla_monitoring(sla["id"])
        
        return sla

    async def _schedule_sla_monitoring(self, sla_id: str):
        """
        Schedule automated monitoring and escalation
        """
        sla = self.active_slas[sla_id]
        
        # Schedule warning notification
        warning_delay = (sla["warning_time"] - datetime.now()).total_seconds()
        if warning_delay > 0:
            asyncio.create_task(self._send_warning(sla_id, warning_delay))
        
        # Schedule violation check
        violation_delay = (sla["deadline"] - datetime.now()).total_seconds()
        if violation_delay > 0:
            asyncio.create_task(self._check_violation(sla_id, violation_delay))

    async def _send_warning(self, sla_id: str, delay: float):
        """
        Send warning before SLA violation
        """
        await asyncio.sleep(delay)
        
        sla = self.active_slas.get(sla_id)
        if not sla or sla["status"] != SLAStatus.ACTIVE:
            return
        
        sla["status"] = SLAStatus.WARNING
        
        # Automated actions for warnings
        await self._execute_automated_action(sla_id, "warning_notification")
        await self._escalate_to_manager(sla_id)
        
        print(f"⚠️ SLA Warning: {sla['sla_type'].value} for application {sla['application_id']}")

    async def _check_violation(self, sla_id: str, delay: float):
        """
        Check for SLA violation and execute penalties
        """
        await asyncio.sleep(delay)
        
        sla = self.active_slas.get(sla_id)
        if not sla or sla["status"] == SLAStatus.COMPLETED:
            return
        
        # SLA violated!
        sla["status"] = SLAStatus.VIOLATED
        
        # Execute violation penalties
        await self._apply_reputation_penalty(sla["company_id"], sla["sla_type"])
        await self._execute_automated_action(sla_id, "violation_penalty")
        await self._notify_candidate_of_violation(sla["application_id"])
        
        print(f"🚨 SLA VIOLATED: {sla['sla_type'].value} for application {sla['application_id']}")

    async def _apply_reputation_penalty(self, company_id: str, sla_type: SLAType):
        """
        Apply reputation penalty to company on Circle Layer
        """
        penalty = self.violation_penalties[sla_type]
        
        # This would call your Circle Layer smart contract
        # await circle_layer_service.update_reputation(company_id, penalty)
        
        print(f"💰 Applied {penalty} reputation penalty to company {company_id}")

    async def _execute_automated_action(self, sla_id: str, action_type: str):
        """
        Execute automated actions based on SLA status
        """
        sla = self.active_slas[sla_id]
        
        actions = {
            "warning_notification": self._send_warning_email,
            "violation_penalty": self._record_violation,
            "auto_escalation": self._escalate_to_ceo,
            "auto_rejection": self._auto_reject_application
        }
        
        if action_type in actions:
            await actions[action_type](sla_id)
            sla["automated_actions"].append({
                "action": action_type,
                "timestamp": datetime.now(),
                "escalation_level": sla["escalation_level"]
            })

    async def complete_sla(self, sla_id: str):
        """
        Mark SLA as completed (company took action)
        """
        if sla_id in self.active_slas:
            sla = self.active_slas[sla_id]
            sla["status"] = SLAStatus.COMPLETED
            sla["completed_at"] = datetime.now()
            
            # Reward good behavior
            await self._apply_reputation_bonus(sla["company_id"], sla["sla_type"])
            
            print(f"✅ SLA Completed: {sla['sla_type'].value}")

    async def _apply_reputation_bonus(self, company_id: str, sla_type: SLAType):
        """
        Reward companies for meeting SLAs
        """
        bonus = abs(self.violation_penalties[sla_type]) // 2  # Half the penalty as bonus
        
        # This would call your Circle Layer smart contract
        # await circle_layer_service.update_reputation(company_id, bonus)
        
        print(f"🎉 Applied +{bonus} reputation bonus to company {company_id}")

    async def _escalate_to_manager(self, sla_id: str):
        """
        Escalate to hiring manager
        """
        print(f"📧 Escalated SLA {sla_id} to hiring manager")

    async def _escalate_to_ceo(self, sla_id: str):
        """
        Escalate to CEO level
        """
        sla = self.active_slas[sla_id]
        sla["escalation_level"] = 2
        print(f"🚨 Escalated SLA {sla_id} to CEO level")

    async def _send_warning_email(self, sla_id: str):
        """
        Send automated warning email
        """
        print(f"📧 Sent automated warning email for SLA {sla_id}")

    async def _record_violation(self, sla_id: str):
        """
        Record violation in system
        """
        print(f"📝 Recorded SLA violation for {sla_id}")

    async def _notify_candidate_of_violation(self, application_id: str):
        """
        Notify candidate that company violated SLA
        """
        print(f"📱 Notified candidate of SLA violation for application {application_id}")

    async def _auto_reject_application(self, sla_id: str):
        """
        Automatically reject application after multiple violations
        """
        sla = self.active_slas[sla_id]
        if sla["escalation_level"] >= 2:
            print(f"❌ Auto-rejected application {sla['application_id']} due to repeated SLA violations")

    async def get_sla_dashboard(self, company_id: str) -> Dict:
        """
        Get SLA performance dashboard for company
        """
        company_slas = [sla for sla in self.active_slas.values() 
                       if sla["company_id"] == company_id]
        
        total = len(company_slas)
        completed = len([s for s in company_slas if s["status"] == SLAStatus.COMPLETED])
        violated = len([s for s in company_slas if s["status"] == SLAStatus.VIOLATED])
        
        return {
            "company_id": company_id,
            "total_slas": total,
            "completion_rate": (completed / total * 100) if total > 0 else 0,
            "violation_rate": (violated / total * 100) if total > 0 else 0,
            "active_slas": [s for s in company_slas if s["status"] == SLAStatus.ACTIVE],
            "performance_score": max(0, 100 - (violated * 10))
        }

# Global instance
sla_engine = AutomatedSLAEngine()
