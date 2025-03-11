import datetime
import random
from typing import Annotated

from fastapi import APIRouter, Body, HTTPException
from marshmallow import ValidationError
from starlette.responses import JSONResponse

from models.otp import OTP
from models.users import User
from services.handle_datetime import save_strftime
from services.hash import hash_password
from tasks import send_mail_otp, send_mail_forgot_password
from ..responses import not_found, successful
from ..schemas.auth import ForgotPasswordSchema, OTPSchema, PasswordSchema

router = APIRouter()


@router.post("/auth/forgot_password")
async def forgot_password(payload: Annotated[ForgotPasswordSchema, Body(embed=False)]):
    try:
        email = payload.email
        user = await User.get_user(email=email)
        if not user:
            raise HTTPException(detail=await not_found(), status_code=404)

        otp = random.randint(100000, 999999)

        data = [{"created": await save_strftime(otp.created),
                 "otp": "******",
                 "email": otp.email,
                 "expiry": await save_strftime(otp.expiry)
                 } for otp in await OTP.create_otp(email=email, otp=otp)]

        send_mail_otp.delay({"username": user.username,
                             "email": user.email,
                             "otp": otp})

        return JSONResponse(await successful(code=201,
                                        message="OTP created successfully!",
                                             data_response=data), status_code=201)
    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                                     "message": {"error": f"{err}"}}, status_code=400)


@router.post("/auth/verify_otp")
async def verify_code(payload: Annotated[OTPSchema, Body(embed=False)]):
    try:
        email = payload.email
        otp_entered = payload.otp

        if not await User.get_user(email=email):
            return HTTPException(detail=await not_found(), status_code=404)

        otp = await OTP.get_otp(email=email, otp=otp_entered)

        if not otp:
            raise HTTPException(detail={"message": "OTP is incorrect!",
                            "status": 400,
                            "data": [{"otp": otp_entered,
                                      "email": email}]
                                         },
                                 status_code=400)

        elif otp.expiry < datetime.datetime.now():
            raise HTTPException(detail={"message": "OTP code has expired!",
                            "status": 400,
                            "data": [{"otp": otp.otp,
                                      "email": otp.email,
                                      "expiry": await save_strftime(otp.expiry),
                                      "created": await save_strftime(otp.created)}]
                                         },
                                 status_code=400)

        await OTP.verify_otp(email=email, otp=otp.otp)

        data = [{"created": await save_strftime(otp.created),
                 "otp": otp.otp,
                 "email": otp.email,
                 "expiry": await save_strftime(otp.expiry)
                 }]

        return JSONResponse(await successful(code=201,
                                        message="OTP authentication successful!",
                                             data_response=data), status_code=201)
    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                                     "message": {"error": f"{err}"}},
                             status_code=400)


@router.post("/auth/reset_password")
async def reset_password(payload: Annotated[PasswordSchema, Body(embed=False)]):
    try:
        email = payload.email
        new_password = payload.new_password

        if not await User.get_user(email=email):
            raise HTTPException(detail=await not_found(), status_code=404)

        otp = await OTP.get_otp_verified(email=email)
        if not otp:
            raise HTTPException(detail=await not_found(), status_code=404)

        new_hashed_password = await hash_password(new_password)

        user = await User.reset_password(email=email, password=new_hashed_password)
        await OTP.delete_otp(email=otp.email)

        send_mail_forgot_password.delay({"username": user.username,
                                         "email": user.email})

        return JSONResponse(content=await successful(code=200,
                                        message="Password updated successfully",
                                        data_response=[{"email": email,
                                                        "id": user.id,
                                                        "username": user.username}]),
                            status_code=200)
    except ValidationError as err:
        raise HTTPException(detail={"status": 400,
                                     "message": {"error": f"{err}"}}, status_code=400)
