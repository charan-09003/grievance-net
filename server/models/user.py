from pydantic import BaseModel, EmailStr
from typing import Literal


class UserModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal['user', 'admin'] = 'user'
