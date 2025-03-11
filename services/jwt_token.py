from datetime import datetime
from datetime import timedelta
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

import config


class CurrentUser(BaseModel):
    id: int
    email: str
    username: str


oath_bearer = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def current_user(token: Annotated[str, Depends(oath_bearer)]):
    try:
        credential = decode(token, config.secret_key, algorithms="HS256")
    except ExpiredSignatureError:
        raise HTTPException(detail={"status": 401,
                                     "message": {"error": "Token has expired"}
                                     }, status_code=401)
    except InvalidTokenError:
        print(token)
        raise HTTPException(detail={"status": 401,
                             "error": {"error": "Invalid token"}
                             }, status_code=401)

    return CurrentUser(id=credential["user_id"], username=credential["username"], email=credential["email"])

async def create_token(user):
    expiration = datetime.now() + timedelta(days=30)
    token = encode({"user_id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "exp": expiration},
                   config.secret_key)

    return token
