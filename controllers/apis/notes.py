import datetime
from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi import Depends, Body
from marshmallow import ValidationError
from starlette.responses import JSONResponse

from models.notes import Note
from services.handle_datetime import save_strftime
from services.jwt_token import current_user, CurrentUser
from ..responses import successful, not_found, method_not_allowed
from ..schemas.notes import NoteBodySchema

router = APIRouter()


@router.get("/notes")
async def get_note(u: Annotated[CurrentUser, Depends(current_user)]):
    data = [{"id": note.id,
             "title": note.title,
             "content": note.content,
             "color": note.color,
             "pined": note.pined,
             "created": note.created.strftime("%Y-%m-%dT%H:%M:%S")}
            for note in await Note.get_all_notes(current_user=u.id)]

    return JSONResponse(content=await successful(code=200,
                                    message="Data retrieved successfully!",
                                                 data_response=data), status_code=200)


@router.post("/notes")
async def post_note(payload: Annotated[NoteBodySchema, Body(embed=False)],
                    u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        new_note = await Note.create_note(current_user=u.id,
                                          title=payload.title,
                                          content=payload.content,
                                          color=payload.color)

        data = [{"id": new_note.id,
                 "title": payload.title,
                 "content": payload.content,
                 "color": payload.color,
                 "pined": new_note.pined,
                 "created": await save_strftime(new_note.created)}]

        return JSONResponse(await successful(code=201,
                                        message="Note created successfully!",
                                             data_response=data), status_code=201)

    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                             "message": {"error": f"{err}"}}, status_code=400)


@router.put("/notes/{note_id}")
async def put_note(note_id: int,
                   payload: Annotated[NoteBodySchema, Body(embed=False)],
                   u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        note = await Note.get_one_note(current_user=u.id, note_id=note_id)
        if not note:
            return JSONResponse(content=await not_found(), status_code=404)

        title = payload.title
        content = payload.content
        color = payload.color
        pined = False
        date_pined = None

        if "pined" in payload.model_dump():
            pined = payload.pined
        if pined:
            date_pined = datetime.datetime.now()

        await Note.update_note(note_id=note_id,
                               title=title,
                               content=content,
                               color=color,
                               pined=pined,
                               date_pined=date_pined)

        data = {"id": note_id,
                "title": title,
                "content": content,
                "created": await save_strftime(note.created)}
        return JSONResponse(content=await successful(code=200,
                                        message="Note updated successfully!",
                                                     data_response=[data]), status_code=200)

    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                                     "message": {"error": f"{err}"}}, status_code=400)


@router.delete("/notes/{note_id}")
async def delete_note(note_id: int,
                      u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        note = await Note.get_one_note(current_user=u.id, note_id=note_id)
        if not note:
            return JSONResponse(await not_found(), status_code=404)

        await Note.delete_note(note_id=note_id)

        return JSONResponse(await successful(code=200,
                                        message="Note deleted successfully!",
                                             data_response=[{"id": note.id}]), status_code=200)
    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                             "message": {"error": f"{err}"}}, status_code=400)


@router.patch("/notes/{note_id}")
async def method_patch_not_allowed(note_id: int,
                                   u: Annotated[CurrentUser, Depends(current_user)]):
    return JSONResponse(await method_not_allowed(message="PATCH Method Not Allowed!"), status_code=405)
