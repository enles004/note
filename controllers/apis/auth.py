from typing import Annotated

from fastapi import Body, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from marshmallow import ValidationError

from models.users import User
from services.handle_datetime import save_strftime
from services.hash import check_password
from services.jwt_token import create_token
from tasks import send_mail_register, send_telegram
from ..responses import incorrect_user, email_exists, successful
from ..schemas.auth import RegisterSchema

router = APIRouter()


@router.post("/auth/login")
async def login(payload: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        user = await User.get_user(payload.username)
        if not user:
            return JSONResponse(await incorrect_user(payload), status_code=401)

        if not await check_password(payload.password, user.password):
            return JSONResponse(await incorrect_user(payload), status_code=401)

        token = await create_token(user=user)

        return {"access_token": token, "token_type": "bearer"}

    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                             "message": f"{err}"},
                            status_code=400)


@router.post("/auth/register")
async def register(payload: Annotated[RegisterSchema, Body(embed=False)]):
    try:
        if await User.get_user(payload.email):
            raise HTTPException(detail=await email_exists(payload), status_code=400)

        new_user = await User.create_user(payload)

        data_response = {"id": new_user.id,
                         "username": new_user.username,
                         "email": new_user.email,
                         "created": await save_strftime(new_user.created)}

        # send mail to user
        send_mail_register.delay(data_response)

        # send telegram
        send_telegram.delay(data_response)

        return JSONResponse(await successful(code=201,
                                        message="User created successfully!",
                                             data_response=[data_response]), status_code=201)

    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                                    "message": f"{err}"}, status_code=400)
