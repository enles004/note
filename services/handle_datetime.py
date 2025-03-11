async def save_strftime(value):
    if value is not None:
        return value.strftime("%Y-%m-%dT%H:%M:%S")
    return None
