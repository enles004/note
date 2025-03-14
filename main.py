import uvicorn
from fastapi import FastAPI

from controllers.apis import auth, notes, otp

app = FastAPI()


app.include_router(auth.router, prefix="/api/v1", tags=["user"])
app.include_router(otp.router, prefix="/api/v1", tags=["otp"])
app.include_router(notes.router, prefix="/api/v1", tags=["note"])
# app.include_router(tasks.router, prefix="/api/v1", tags=["task"])

@app.get("/")
async def home():
    return {"message": "Hello!"}


if "__main__" == __name__:
    uvicorn.run(app)
