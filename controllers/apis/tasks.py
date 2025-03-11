import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Body, HTTPException
from fastapi.responses import JSONResponse
from marshmallow import ValidationError

from models.tasks import Task
from services.handle_datetime import save_strftime
from services.jwt_token import CurrentUser
from services.jwt_token import current_user
from ..responses import successful, not_found, forbidden, method_not_allowed
from ..schemas.tasks import TaskSchema, SubTaskSchema

router = APIRouter()


@router.post("/tasks")
async def post_task(payload: Annotated[TaskSchema, Body(embded=True)],
                    u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        content = payload.content
        task_type = payload.type
        status = payload.status
        expiry = payload.expiry
        reminder = payload.reminder
        repeat = payload.repeat
        color = payload.color
        task_parent_id = None

        new_task = await Task.create_task(current_user=u.id,
                                          content=content,
                                          task_type=task_type,
                                          status=status,
                                          expiry=expiry,
                                          reminder=reminder,
                                          repeat=repeat,
                                          color=color,
                                          task_parent_id=task_parent_id)

        return JSONResponse(content=await successful(code=201,
                                        message="Task created successfully!",
                                                     data_response=[await result_data(new_task)]), status_code=201)


    except ValidationError as err:
        return HTTPException(status_code=400, detail={"status": 400,
                                                      "message": f"{err}"})


@router.post("/tasks/<int:task_id>")
async def post_subtask(task_id,
                       payload: Annotated[SubTaskSchema, Body(embded=True)],
                       u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        check_task = await Task.get_one_task(current_user=u.id, task_id=task_id)

        if not check_task and task_id is not None:
            return HTTPException(detail=await not_found(), status_code=404)

        if check_task.type == "subtasks":
            return HTTPException(detail={"status": 400,
                                         "message": "Do not create subtask from another subtask!"},
                                 status_code=400)

        if check_task.status:
            status = True

        new_task = await Task.create_subtasks(current_user=u.id,
                                              tasks_data=payload.subtasks,
                                              task_parent_id=task_id)

        return JSONResponse(await successful(code=201,
                                        message="Subtask created successfully!",
                                             data_response=[await result_subdata(new_task)]), status_code=201)

    except ValidationError as err:
        return HTTPException(status_code=400, detail={"status": 400,
                                                      "message": f"{err}"})


@router.get("/tasks")
async def get_task(u: Annotated[CurrentUser, Depends(current_user)]):
    tasks = await Task.get_all_tasks(current_user=u.id)
    data = []
    for task in tasks:
        data.append({"id": task.id,
                     "content": task.content,
                     "status": task.status,
                     "expiry": await save_strftime(task.expiry),
                     "reminder": await save_strftime(task.reminder),
                     "repeat": task.repeat,
                     "color": task.color,
                     "type": task.type,
                     "created": await save_strftime(task.created),
                     "date_completed": await save_strftime(task.date_completed),
                     "subtasks": [{"id": subtask.id,
                                   "content": subtask.content,
                                   "status": subtask.status,
                                   "type": subtask.type,
                                   "expiry": await save_strftime(subtask.expiry),
                                   "created": await save_strftime(subtask.created),
                                   "date_completed": await save_strftime(subtask.date_completed)}
                                    for subtask in sorted(task.parent, key=lambda date:date.created, reverse=True) or []]})

    return JSONResponse(await successful(code=200,
                                    message="Data retrieved successfully!",
                                         data_response=data), status_code=200)


@router.put("/tasks/<int:task_id>")
async def put_task(task_id,
                   payload: Annotated[TaskSchema, Body(embded=True)],
                   u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        task = await Task.get_one_task(current_user=u.id, task_id=task_id)
        if not task:
            return HTTPException(detail=await not_found(), status_code=404)

        content = payload.content
        task_type = payload.type
        status = payload.status
        expiry = payload.expiry
        reminder = payload.reminder
        repeat = payload.repeat
        color = payload.color
        date_completed = None
        if status:
            date_completed = datetime.datetime.now()

        new_task = await Task.update_task(task_id=task_id,
                                          content=content,
                                          task_type=task_type,
                                          status=status,
                                          expiry=expiry,
                                          reminder=reminder,
                                          repeat=repeat,
                                          color=color,
                                          date_completed=date_completed)

        data = {"id": task.id,
                "content": content,
                "type": task_type,
                "status": status,
                "expiry": await save_strftime(new_task[5]),
                "reminder": await save_strftime(new_task[6]),
                "repeat": repeat,
                "color": color,
                "created": await save_strftime(new_task[8]),
                "task_parent_id": new_task[9]}

        return JSONResponse(content=await successful(code=201,
                                        message="Task created successfully!",
                                                     data_response=[data]), status_code=201)
    except ValidationError as err:
        return HTTPException(status_code=400, detail={"status": 400,
                                                      "message": f"{err}"})


@router.delete("/tasks/<int:task_id>")
async def delete_task(task_id,
                      u: Annotated[CurrentUser, Depends(current_user)]):
    try:
        task = await Task.get_one_task(current_user=u.id, task_id=task_id)
        if not task:
            return HTTPException(detail=await not_found(), status_code=404)

        if not task.status:
            return HTTPException(detail=await forbidden(message="Cannot delete task before completion!"),
                                 status_code=403)

        await Task.delete_task(task_id=task_id)

        data = {"id": task.id}

        return JSONResponse(content=await successful(code=200,
                                        message="Task deleted successfully!",
                                                     data_response=[data]), status_code=200)
    except ValidationError as err:
        return HTTPException(status_code=400, detail={"status": 400,
                                                      "message": f"{err}"})


@router.patch("/tasks/<int:task_id>")
async def patch_task(task_id,
                     u: Annotated[CurrentUser, Depends(current_user)]):
    return HTTPException(detail=await method_not_allowed(message="PATCH Method Not Allowed!"), status_code=405)



async def result_data(new_task):
    data = {"id": new_task.id,
            "content": new_task.content,
            "type": new_task.type,
            "status": new_task.status,
            "expiry": await save_strftime(new_task.expiry),
            "reminder": await save_strftime(new_task.reminder),
            "repeat": new_task.repeat,
            "color": new_task.color,
            "created": await save_strftime(new_task.created),
            "date_completed": await save_strftime(new_task.date_completed),
            "task_parent_id": new_task.task_parent_id}

    return data

async def result_subdata(new_task):
    data = [{"id": task.id,
            "content": task.content,
            "type": task.type,
            "status": task.status,
            "expiry": await save_strftime(task.expiry),
            "reminder": await save_strftime(task.reminder),
            "repeat": task.repeat,
            "color": task.color,
             "created": await save_strftime(task.created),
            "date_completed": await save_strftime(task.date_completed),
            "task_parent_id": task.task_parent_id} for task in new_task]

    return data