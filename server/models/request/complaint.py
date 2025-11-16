from pydantic import BaseModel, Field
from typing import Optional


class ComplaintRequestModel(BaseModel):
    location: str = Field(..., min_length=5)
    description: str = Field(..., min_length=5)
    urgency: Optional[str] = None
