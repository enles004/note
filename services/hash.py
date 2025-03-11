import bcrypt


async def hash_password(password):
    password = password
    byte = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(byte, salt)
    return hashed.decode('utf-8')


async def check_password(password_entered, password):
    user_entered = password_entered.encode('utf-8')
    hashed_password = password.encode('utf-8')
    result = bcrypt.checkpw(user_entered, hashed_password)

    return result
