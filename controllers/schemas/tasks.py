from datetime import datetime
from typing import Optional, List, Literal

from pydantic import Field, BaseModel, model_validator


class TaskSchema(BaseModel):
    content: str = Field(min_length=3, max_length=100)
    type: str
    status: bool = False
    expiry: Optional[datetime] = None
    reminder: Optional[datetime] = None
    repeat: Optional[Literal["Null", "Never", "Daily", "Monday to Friday", "Weekly", "Monthly"]] = None
    color: str = None

    @model_validator(mode="after")
    def valid_reminder_and_repeat(cls, values):
        reminder, repeat = values["reminder"], values["repeat"]
        if reminder and not repeat:
            raise ValueError("repeat: No repeat time, repeat time must have the same reminder!")
        if repeat and not reminder:
            raise ValueError("reminder: No reminder, reminder must have same repeat time!")
        return values

    @model_validator(mode="after")
    def check_type(cls, values):
        if values["type"] not in ["subtasks", "tasks"]:
            raise ValueError("type: Must be 'tasks' or 'subtasks'!")
        return values

    @model_validator(mode="after")
    def check_color(cls, values):
        if values["type"] == "tasks" and "color" not in values:
            raise ValueError("color: Must exist for type 'tasks'!")
        if values["type"] == "subtasks" and "color" in values:
            raise ValueError("color: Must not exist for type 'subtasks'!")
        return values


class SubTaskSchema(BaseModel):
    subtasks: List[TaskSchema]
