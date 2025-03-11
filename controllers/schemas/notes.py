from fastapi import Query
from marshmallow.schema import BaseSchema
from pydantic import BaseModel, Field


class NoteBodySchema(BaseModel):
    title: str
    content: str
    color: str
    pined: bool = Field(default=False)


# class NoteParamSchema(BaseModel):
#     filter: dict | None
#     sort: dict | None
#     page: int = Query(default=1)
#     per_page: int = Query(default=10)
#
#
# class NoteParamFilterSchema(BaseModel):
#     title: str | None = Query()
#     content: str | None = Query()
#     color: str | None = Query()
#     pined: bool | False = Query(default=False)
#     start_date: str | None
#     end_date: str | None
#
#
# class NoteParamSortSchema(BaseSchema):
#     created: str | None = Query()
