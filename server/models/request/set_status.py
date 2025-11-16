from pydantic import BaseModel
from typing import Literal


class StatusModel(BaseModel):
    status: Literal['open', 'in-progress', 'closed']
