from models.tasks import Task
from database import connection
import datetime
from ..mail.mail_sender import send_notify_task_expiry

async def tasks_expire():
    try:
        db = await connection()
        tasks_due_soon = (db.query(Task)
                 .filter(Task.expiry - datetime.timedelta(days=3) < datetime.datetime.now(),
                         Task.expiry < datetime.datetime.now()).all())
        user = {}
        for task in tasks_due_soon:
            if task.user_id not in user:
                user[task.user_id] = {"username": task.username, "email": task.user.email, "task": []}
            user[task.user_id]["task"].append(task)

        send_notify_task_expiry(message=user)
    except Exception as e:
        return None
    finally:
        db.close()