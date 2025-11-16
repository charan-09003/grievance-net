from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, Dict, Literal


class ComplaintModel(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    location: str = Field(..., min_length=1)
    description: str = Field(..., min_length=5)
    urgency: Optional[str] = None
    predicted_category: Optional[str] = None
    category_scores: Optional[Dict[str, float]] = None
    created_at: datetime = Field(default_factory=datetime.now)
    status: Literal['open', 'in-progress', 'closed'] = 'open'
