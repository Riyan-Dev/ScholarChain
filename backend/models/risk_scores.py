from pydantic import BaseModel, Field
from datetime import datetime

class RiskScoreReasoning(BaseModel):
    risk_score: float = Field(..., ge=0, le=100, description="Risk score between 0 and 100")
    calculations: str = Field(..., description="Explanation of the score")

class RiskAssessment(BaseModel):
    application_id: str = Field(..., description="Unique identifier for the application")
    financial_risk: RiskScoreReasoning
    academic_risk: RiskScoreReasoning
    personal_risk: RiskScoreReasoning
    reference_risk: RiskScoreReasoning
    repayment_potential: RiskScoreReasoning
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of risk assessment creation")

    
