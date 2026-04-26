from pydantic import BaseModel,Field,field_validator
from datetime import date
from src.tasks.enum import StatusEnum
from typing import Union,List

class TaskCreateSchema(BaseModel):
    title : str
    desc : str = Field(max_length=100)
    due_date : date | None = None
    status : StatusEnum = StatusEnum.pending

    @field_validator("due_date")
    def validate_due_date(cls,value):
        if value and value < date.today():
            raise ValueError("Due date cannot be in the past")
        return value

class TaskEditSchema(BaseModel):
    title : str |None = None
    desc : str | None = None
    status : StatusEnum |None = None
    due_date : date | None = None

class TaskResponseSchema(BaseModel):
    id : int
    title : str
    desc : str
    status : StatusEnum 
    due_date : date | None
    user_id : int | None

class APIResponseSchema(BaseModel):
    message : str
    data : Union[TaskResponseSchema,List[TaskResponseSchema]]