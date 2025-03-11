async def email_exists(payload):
    return {"status": 400,
            "message": "Email already exists",
            "data": [{"email": payload.email}]
            }


async def incorrect_user(payload):
    return {"status": 401,
            "message": "Incorrect account or password",
            "data": [{"email": payload.username,
                      "password": payload.password}]
            }


async def successful(code, message, data_response):
    return {"status": code,
            "message": message,
            "data": data_response}


async def not_found():
    return {"status": 404,
            "message": "Not found!"}


async def forbidden(message):
    return {"status": 403,
            "message": message}


async def method_not_allowed(message):
    return {"status": 405,
            "message": message}
