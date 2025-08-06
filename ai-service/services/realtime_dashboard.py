from typing import Dict, List
from datetime import datetime, timedelta
from enum import Enum

class ProcessStage(Enum):
    APPLICATION_SUBMITTED = "application_submitted"
    INITIAL_SCREENING = "initial_screening"
    AI_ANALYSIS = "ai_analysis"
    HR_REVIEW = "hr_review"
    TECHNICAL_INTERVIEW = "technical_interview"
    CULTURE_INTERVIEW = "culture_interview"
    FINAL_INTERVIEW = "final_interview"
    REFERENCE_CHECK = "reference_check"
    OFFER_PREPARATION = "offer_preparation"
    OFFER_SENT = "offer_sent"
    NEGOTIATION = "negotiation"
    OFFER_ACCEPTED = "offer_accepted"
    ONBOARDING = "onboarding"
    COMPLETED = "completed"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class ProcessStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    OVERDUE = "overdue"

class RealTimeDashboard:
    def __init__(self):
        self.active_processes = {}
        self.stage_durations = {
            ProcessStage.APPLICATION_SUBMITTED: 0,  # Instant
            ProcessStage.INITIAL_SCREENING: 24,  # 24 hours
            ProcessStage.AI_ANALYSIS: 2,  # 2 hours
            ProcessStage.HR_REVIEW: 48,  # 2 days
            ProcessStage.TECHNICAL_INTERVIEW: 72,  # 3 days to schedule
            ProcessStage.CULTURE_INTERVIEW: 48,  # 2 days after tech
            ProcessStage.FINAL_INTERVIEW: 72,  # 3 days
            ProcessStage.REFERENCE_CHECK: 48,  # 2 days
            ProcessStage.OFFER_PREPARATION: 24,  # 1 day
            ProcessStage.OFFER_SENT: 0,  # Instant
            ProcessStage.NEGOTIATION: 120,  # 5 days
            ProcessStage.OFFER_ACCEPTED: 0,  # Instant
            ProcessStage.ONBOARDING: 168,  # 1 week
        }
        
        # WebSocket connections for real-time updates
        self.websocket_connections = {}

    async def create_hiring_process(self, application_id: str, job_id: str, 
                                  candidate_id: str, company_id: str) -> Dict:
        """
        Create a new hiring process with real-time tracking
        """
        process = {
            "id": f"process_{application_id}",
            "application_id": application_id,
            "job_id": job_id,
            "candidate_id": candidate_id,
            "company_id": company_id,
            "created_at": datetime.now(),
            "current_stage": ProcessStage.APPLICATION_SUBMITTED,
            "status": ProcessStatus.IN_PROGRESS,
            "stages": {},
            "timeline": [],
            "estimated_completion": self._calculate_estimated_completion(),
            "blockers": [],
            "automated_actions": []
        }
        
        # Initialize all stages
        for stage in ProcessStage:
            process["stages"][stage.value] = {
                "status": ProcessStatus.PENDING.value,
                "started_at": None,
                "completed_at": None,
                "duration_hours": None,
                "assigned_to": None,
                "notes": [],
                "automated": False,
                "sla_deadline": None,
                "documents": []
            }
        
        # Mark first stage as started
        process["stages"][ProcessStage.APPLICATION_SUBMITTED.value].update({
            "status": ProcessStatus.COMPLETED.value,
            "started_at": datetime.now(),
            "completed_at": datetime.now(),
            "duration_hours": 0,
            "automated": True
        })
        
        # Add to timeline
        process["timeline"].append({
            "timestamp": datetime.now(),
            "stage": ProcessStage.APPLICATION_SUBMITTED.value,
            "action": "Application submitted",
            "actor": "candidate",
            "details": "Candidate submitted application"
        })
        
        self.active_processes[process["id"]] = process
        
        # Start automated progression
        await self._start_automated_progression(process["id"])
        
        # Notify all stakeholders
        await self._broadcast_update(process["id"], "process_created")
        
        return process

    async def advance_stage(self, process_id: str, new_stage: ProcessStage, 
                          actor: str, notes: str = "") -> Dict:
        """
        Advance process to next stage with real-time updates
        """
        if process_id not in self.active_processes:
            raise ValueError(f"Process {process_id} not found")
        
        process = self.active_processes[process_id]
        current_stage = process["current_stage"]
        
        # Complete current stage
        if current_stage != ProcessStage.APPLICATION_SUBMITTED:
            stage_data = process["stages"][current_stage.value]
            if stage_data["status"] != ProcessStatus.COMPLETED.value:
                stage_data.update({
                    "status": ProcessStatus.COMPLETED.value,
                    "completed_at": datetime.now(),
                    "duration_hours": self._calculate_duration(stage_data["started_at"]),
                })
        
        # Start new stage
        process["current_stage"] = new_stage
        new_stage_data = process["stages"][new_stage.value]
        new_stage_data.update({
            "status": ProcessStatus.IN_PROGRESS.value,
            "started_at": datetime.now(),
            "sla_deadline": datetime.now() + timedelta(hours=self.stage_durations.get(new_stage, 48))
        })
        
        if notes:
            new_stage_data["notes"].append({
                "timestamp": datetime.now(),
                "actor": actor,
                "note": notes
            })
        
        # Add to timeline
        process["timeline"].append({
            "timestamp": datetime.now(),
            "stage": new_stage.value,
            "action": f"Advanced to {new_stage.value}",
            "actor": actor,
            "details": notes or f"Process advanced to {new_stage.value}"
        })
        
        # Update estimated completion
        process["estimated_completion"] = self._calculate_estimated_completion(process)
        
        # Check for automation opportunities
        await self._check_automation_triggers(process_id, new_stage)
        
        # Broadcast update
        await self._broadcast_update(process_id, "stage_advanced", {
            "new_stage": new_stage.value,
            "actor": actor
        })
        
        return process

    async def add_blocker(self, process_id: str, blocker_type: str, 
                         description: str, severity: str = "medium") -> Dict:
        """
        Add a blocker to the hiring process
        """
        process = self.active_processes[process_id]
        
        blocker = {
            "id": f"blocker_{len(process['blockers'])}",
            "type": blocker_type,
            "description": description,
            "severity": severity,
            "created_at": datetime.now(),
            "resolved_at": None,
            "resolution": None,
            "impact_hours": self._estimate_blocker_impact(blocker_type, severity)
        }
        
        process["blockers"].append(blocker)
        
        # Update process status
        if severity == "critical":
            process["status"] = ProcessStatus.BLOCKED
        
        # Adjust estimated completion
        impact_hours = blocker["impact_hours"]
        process["estimated_completion"] += timedelta(hours=impact_hours)
        
        # Add to timeline
        process["timeline"].append({
            "timestamp": datetime.now(),
            "stage": process["current_stage"].value,
            "action": f"Blocker added: {blocker_type}",
            "actor": "system",
            "details": description
        })
        
        # Broadcast urgent update
        await self._broadcast_update(process_id, "blocker_added", {
            "blocker": blocker,
            "severity": severity
        })
        
        return blocker

    async def resolve_blocker(self, process_id: str, blocker_id: str, 
                            resolution: str) -> Dict:
        """
        Resolve a blocker and update timeline
        """
        process = self.active_processes[process_id]
        
        blocker = next((b for b in process["blockers"] if b["id"] == blocker_id), None)
        if not blocker:
            raise ValueError(f"Blocker {blocker_id} not found")
        
        blocker.update({
            "resolved_at": datetime.now(),
            "resolution": resolution
        })
        
        # Check if all critical blockers are resolved
        critical_blockers = [b for b in process["blockers"] 
                           if b["severity"] == "critical" and b["resolved_at"] is None]
        
        if not critical_blockers and process["status"] == ProcessStatus.BLOCKED:
            process["status"] = ProcessStatus.IN_PROGRESS
        
        # Add to timeline
        process["timeline"].append({
            "timestamp": datetime.now(),
            "stage": process["current_stage"].value,
            "action": f"Blocker resolved: {blocker['type']}",
            "actor": "system",
            "details": resolution
        })
        
        await self._broadcast_update(process_id, "blocker_resolved", {
            "blocker_id": blocker_id,
            "resolution": resolution
        })
        
        return blocker

    async def get_dashboard_data(self, company_id: str | None = None, 
                               candidate_id: str | None = None) -> Dict:
        """
        Get comprehensive dashboard data with real-time metrics
        """
        # Filter processes based on viewer
        filtered_processes = []
        for process in self.active_processes.values():
            if company_id and process["company_id"] == company_id:
                filtered_processes.append(process)
            elif candidate_id and process["candidate_id"] == candidate_id:
                filtered_processes.append(process)
            elif not company_id and not candidate_id:
                filtered_processes.append(process)
        
        # Calculate metrics
        dashboard = {
            "overview": await self._calculate_overview_metrics(filtered_processes),
            "active_processes": len(filtered_processes),
            "processes_by_stage": await self._group_by_stage(filtered_processes),
            "sla_performance": await self._calculate_sla_performance(filtered_processes),
            "bottlenecks": await self._identify_bottlenecks(filtered_processes),
            "recent_activity": await self._get_recent_activity(filtered_processes),
            "predictions": await self._generate_predictions(filtered_processes),
            "actionable_items": await self._get_actionable_items(filtered_processes),
            "efficiency_metrics": await self._calculate_efficiency_metrics(filtered_processes)
        }
        
        return dashboard

    async def _calculate_overview_metrics(self, processes: List[Dict]) -> Dict:
        """
        Calculate high-level overview metrics
        """
        total = len(processes)
        if total == 0:
            return {"total": 0, "completed": 0, "in_progress": 0, "blocked": 0}
        
        completed = len([p for p in processes if p["current_stage"] == ProcessStage.COMPLETED])
        blocked = len([p for p in processes if p["status"] == ProcessStatus.BLOCKED])
        in_progress = total - completed - blocked
        
        # Calculate average time to hire
        completed_processes = [p for p in processes if p["current_stage"] == ProcessStage.COMPLETED]
        avg_time_to_hire = 0
        if completed_processes:
            total_duration = sum(
                (datetime.now() - p["created_at"]).total_seconds() / 3600
                for p in completed_processes
            )
            avg_time_to_hire = total_duration / len(completed_processes)
        
        return {
            "total_processes": total,
            "completed": completed,
            "in_progress": in_progress,
            "blocked": blocked,
            "completion_rate": (completed / total * 100) if total > 0 else 0,
            "average_time_to_hire_hours": round(avg_time_to_hire, 1),
            "processes_started_today": len([
                p for p in processes 
                if p["created_at"].date() == datetime.now().date()
            ])
        }

    async def _group_by_stage(self, processes: List[Dict]) -> Dict:
        """
        Group processes by current stage
        """
        stage_counts = {}
        for stage in ProcessStage:
            stage_counts[stage.value] = {
                "count": 0,
                "avg_duration": 0,
                "overdue": 0
            }
        
        for process in processes:
            current_stage = process["current_stage"].value
            stage_counts[current_stage]["count"] += 1
            
            # Check if overdue
            stage_data = process["stages"][current_stage]
            if stage_data["sla_deadline"] and datetime.now() > stage_data["sla_deadline"]:
                stage_counts[current_stage]["overdue"] += 1
        
        return stage_counts

    async def _calculate_sla_performance(self, processes: List[Dict]) -> Dict:
        """
        Calculate SLA performance metrics
        """
        total_slas = 0
        met_slas = 0
        
        for process in processes:
            for stage_name, stage_data in process["stages"].items():
                if stage_data["completed_at"] and stage_data["sla_deadline"]:
                    total_slas += 1
                    if stage_data["completed_at"] <= stage_data["sla_deadline"]:
                        met_slas += 1
        
        return {
            "total_slas": total_slas,
            "met_slas": met_slas,
            "sla_performance_rate": (met_slas / total_slas * 100) if total_slas > 0 else 100,
            "current_overdue": len([
                p for p in processes
                for stage_data in p["stages"].values()
                if (stage_data["sla_deadline"] and 
                    datetime.now() > stage_data["sla_deadline"] and 
                    stage_data["status"] != ProcessStatus.COMPLETED.value)
            ])
        }

    async def _identify_bottlenecks(self, processes: List[Dict]) -> List[Dict]:
        """
        Identify process bottlenecks
        """
        stage_durations = {}
        
        for process in processes:
            for stage_name, stage_data in process["stages"].items():
                if stage_data["duration_hours"]:
                    if stage_name not in stage_durations:
                        stage_durations[stage_name] = []
                    stage_durations[stage_name].append(stage_data["duration_hours"])
        
        bottlenecks = []
        for stage_name, durations in stage_durations.items():
            if len(durations) >= 3:  # Need minimum data
                avg_duration = sum(durations) / len(durations)
                expected_duration = self.stage_durations.get(
                    ProcessStage(stage_name), 48
                )
                
                if avg_duration > expected_duration * 1.5:  # 50% longer than expected
                    bottlenecks.append({
                        "stage": stage_name,
                        "average_duration": round(avg_duration, 1),
                        "expected_duration": expected_duration,
                        "delay_factor": round(avg_duration / expected_duration, 2),
                        "processes_affected": len(durations)
                    })
        
        return sorted(bottlenecks, key=lambda x: x["delay_factor"], reverse=True)

    async def _get_recent_activity(self, processes: List[Dict]) -> List[Dict]:
        """
        Get recent activity across all processes
        """
        all_activities = []
        
        for process in processes:
            for activity in process["timeline"][-5:]:  # Last 5 activities per process
                all_activities.append({
                    **activity,
                    "process_id": process["id"],
                    "candidate_id": process["candidate_id"],
                    "job_id": process["job_id"]
                })
        
        # Sort by timestamp, most recent first
        all_activities.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return all_activities[:20]  # Return last 20 activities

    async def _generate_predictions(self, processes: List[Dict]) -> Dict:
        """
        Generate predictions for hiring pipeline
        """
        # Predict completion dates for active processes
        active_processes = [p for p in processes if p["status"] == ProcessStatus.IN_PROGRESS]
        
        predictions = {
            "expected_hires_this_week": 0,
            "expected_hires_this_month": 0,
            "processes_at_risk": [],
            "capacity_forecast": {}
        }
        
        week_end = datetime.now() + timedelta(days=7)
        month_end = datetime.now() + timedelta(days=30)
        
        for process in active_processes:
            estimated_completion = process["estimated_completion"]
            
            if estimated_completion <= week_end:
                predictions["expected_hires_this_week"] += 1
            
            if estimated_completion <= month_end:
                predictions["expected_hires_this_month"] += 1
            
            # Check if process is at risk
            if len(process["blockers"]) > 2 or process["status"] == ProcessStatus.BLOCKED:
                predictions["processes_at_risk"].append({
                    "process_id": process["id"],
                    "risk_factors": len(process["blockers"]),
                    "estimated_delay": "high" if process["status"] == ProcessStatus.BLOCKED else "medium"
                })
        
        return predictions

    async def _get_actionable_items(self, processes: List[Dict]) -> List[Dict]:
        """
        Get actionable items that need immediate attention
        """
        actionable = []
        
        for process in processes:
            # Overdue SLAs
            for stage_name, stage_data in process["stages"].items():
                if (stage_data["sla_deadline"] and 
                    datetime.now() > stage_data["sla_deadline"] and 
                    stage_data["status"] != ProcessStatus.COMPLETED.value):
                    
                    actionable.append({
                        "type": "overdue_sla",
                        "priority": "high",
                        "process_id": process["id"],
                        "description": f"SLA overdue for {stage_name}",
                        "stage": stage_name,
                        "overdue_hours": (datetime.now() - stage_data["sla_deadline"]).total_seconds() / 3600
                    })
            
            # Unresolved blockers
            for blocker in process["blockers"]:
                if not blocker["resolved_at"]:
                    actionable.append({
                        "type": "unresolved_blocker",
                        "priority": "critical" if blocker["severity"] == "critical" else "medium",
                        "process_id": process["id"],
                        "description": f"Unresolved blocker: {blocker['description']}",
                        "blocker_id": blocker["id"],
                        "age_hours": (datetime.now() - blocker["created_at"]).total_seconds() / 3600
                    })
        
        # Sort by priority
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        actionable.sort(key=lambda x: priority_order.get(x["priority"], 3))
        
        return actionable

    async def _calculate_efficiency_metrics(self, processes: List[Dict]) -> Dict:
        """
        Calculate process efficiency metrics
        """
        if not processes:
            return {}
        
        # Calculate automation rate
        total_stages = 0
        automated_stages = 0
        
        for process in processes:
            for stage_data in process["stages"].values():
                if stage_data["status"] != ProcessStatus.PENDING.value:
                    total_stages += 1
                    if stage_data.get("automated", False):
                        automated_stages += 1
        
        return {
            "automation_rate": (automated_stages / total_stages * 100) if total_stages > 0 else 0,
            "average_process_duration": self._calculate_average_duration(processes),
            "fastest_hire": self._get_fastest_hire(processes),
            "slowest_hire": self._get_slowest_hire(processes),
            "processes_with_blockers": len([p for p in processes if p["blockers"]]),
            "blocker_resolution_rate": self._calculate_blocker_resolution_rate(processes)
        }

    def _calculate_duration(self, start_time: datetime) -> float:
        """
        Calculate duration in hours
        """
        if not start_time:
            return 0
        return (datetime.now() - start_time).total_seconds() / 3600

    def _calculate_estimated_completion(self, process: Dict | None = None) -> datetime:
        """
        Calculate estimated completion time
        """
        if not process:
            # For new process, estimate based on all stages
            total_hours = sum(self.stage_durations.values())
            return datetime.now() + timedelta(hours=total_hours)
        
        # For existing process, calculate remaining time
        current_stage = process["current_stage"]
        remaining_stages = list(ProcessStage)[list(ProcessStage).index(current_stage) + 1:]
        
        remaining_hours = sum(self.stage_durations.get(stage, 48) for stage in remaining_stages)
        
        # Add blocker impact
        unresolved_blockers = [b for b in process["blockers"] if not b["resolved_at"]]
        blocker_impact = sum(b["impact_hours"] for b in unresolved_blockers)
        
        return datetime.now() + timedelta(hours=remaining_hours + blocker_impact)

    def _estimate_blocker_impact(self, blocker_type: str, severity: str) -> int:
        """
        Estimate the impact of a blocker in hours
        """
        base_impact = {
            "scheduling_conflict": 24,
            "missing_documents": 8,
            "reference_unavailable": 48,
            "budget_approval": 72,
            "technical_issues": 12,
            "candidate_unavailable": 48
        }
        
        severity_multiplier = {
            "low": 0.5,
            "medium": 1.0,
            "high": 1.5,
            "critical": 2.0
        }
        
        base = base_impact.get(blocker_type, 24)
        multiplier = severity_multiplier.get(severity, 1.0)
        
        return int(base * multiplier)

    async def _start_automated_progression(self, process_id: str):
        """
        Start automated progression for suitable stages
        """
        # This would trigger automated actions for stages that can be automated
        # For example: AI analysis, initial screening, etc.
        pass

    async def _check_automation_triggers(self, process_id: str, new_stage: ProcessStage):
        """
        Check if the new stage can trigger automation
        """
        automated_stages = [
            ProcessStage.AI_ANALYSIS,
            ProcessStage.INITIAL_SCREENING
        ]
        
        if new_stage in automated_stages:
            # Mark as automated and potentially auto-advance
            process = self.active_processes[process_id]
            process["stages"][new_stage.value]["automated"] = True

    async def _broadcast_update(self, process_id: str, event_type: str, data: Dict | None = None):
        """
        Broadcast real-time updates to connected clients
        """
        # This would send WebSocket messages to connected clients
        print(f"🔄 Broadcasting update: {event_type} for process {process_id}")

    def _calculate_average_duration(self, processes: List[Dict]) -> float:
        """
        Calculate average duration for completed processes
        """
        completed_processes = [p for p in processes if p["current_stage"] == ProcessStage.COMPLETED]
        if not completed_processes:
            return 0.0
        
        total_duration = sum(
            (datetime.now() - p["created_at"]).total_seconds() / 3600
            for p in completed_processes
        )
        
        return total_duration / len(completed_processes)

    def _get_fastest_hire(self, processes: List[Dict]) -> Dict:
        """
        Get fastest hire record
        """
        completed_processes = [p for p in processes if p["current_stage"] == ProcessStage.COMPLETED]
        if not completed_processes:
            return {}
        
        fastest = min(
            completed_processes,
            key=lambda p: (datetime.now() - p["created_at"]).total_seconds()
        )
        
        duration = (datetime.now() - fastest["created_at"]).total_seconds() / 3600
        return {
            "process_id": fastest["id"],
            "duration_hours": round(duration, 1),
            "candidate_id": fastest["candidate_id"]
        }

    def _get_slowest_hire(self, processes: List[Dict]) -> Dict:
        """
        Get slowest hire record
        """
        completed_processes = [p for p in processes if p["current_stage"] == ProcessStage.COMPLETED]
        if not completed_processes:
            return {}
        
        slowest = max(
            completed_processes,
            key=lambda p: (datetime.now() - p["created_at"]).total_seconds()
        )
        
        duration = (datetime.now() - slowest["created_at"]).total_seconds() / 3600
        return {
            "process_id": slowest["id"],
            "duration_hours": round(duration, 1),
            "candidate_id": slowest["candidate_id"]
        }

    def _calculate_blocker_resolution_rate(self, processes: List[Dict]) -> float:
        """
        Calculate percentage of blockers that have been resolved
        """
        total_blockers = 0
        resolved_blockers = 0
        
        for process in processes:
            total_blockers += len(process["blockers"])
            resolved_blockers += len([b for b in process["blockers"] if b["resolved_at"]])
        
        if total_blockers == 0:
            return 100.0
        
        return (resolved_blockers / total_blockers) * 100

# Global instance
dashboard = RealTimeDashboard()
