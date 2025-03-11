from sqlalchemy import Column, Integer, func, DateTime, Text, ForeignKey, Boolean, String, text, update, delete
from sqlalchemy.orm import relationship, joinedload
import datetime
from database import Base, connection, close
from . import users


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    status = Column(Boolean, default=False, nullable=True)
    expiry = Column(DateTime, default=None, nullable=True)
    reminder = Column(DateTime, nullable=True)
    repeat = Column(String(255), nullable=True)
    color = Column(String(255), nullable=True)
    date_completed = Column(DateTime, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())

    task_parent_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=True)
    type = Column(String(50), nullable=False, default="task")
    subtasks = relationship("Task", backref="parent", remote_side=[id], lazy="joined", cascade="all, delete",
                            passive_deletes=True)

    user = relationship("User", back_populates="tasks")

    @classmethod
    async def get_one_task(cls, current_user, task_id):
        try:
            db = await connection()
            task = db.query(Task).filter(Task.user_id == current_user, Task.id == task_id).first()
            return task
        except Exception as e:
            db.rollback()
            raise Exception(f'err{e}')
        finally:
            db.close()

    @classmethod
    async def get_all_tasks(cls, current_user):
        try:
            db = await connection()
            check_user = db.query(users.User).filter(users.User.id == current_user).first()
            if check_user:
                tasks = (db.query(Task)
                         .options(joinedload(Task.parent))
                         .filter(Task.user_id == current_user, Task.task_parent_id.is_(None))
                         .order_by(Task.created.desc()).all())
                return tasks

            raise Exception("User is not valid")
        except Exception as e:
            db.rollback()
            raise Exception(f"err: {e}")
        finally:
            db.close()


    @classmethod
    async def create_task(cls, current_user, content, task_type, status, expiry, reminder, repeat, color, task_parent_id):
        try:
            db = await connection()
            check_user = db.query(users.User).filter(users.User.id == current_user).first()
            if not check_user:
                raise Exception("User is not valid")

            new_task = cls(user_id=current_user,
                           content=content,
                           type=task_type,
                           status=status,
                           expiry=expiry,
                           reminder=reminder,
                           repeat=repeat,
                           color=color,
                           task_parent_id=task_parent_id
            )

            db.add(new_task)
            db.flush()
            db.commit()
            db.refresh(new_task)
            return new_task

        except Exception as e:
            db.rollback()
            raise Exception(f"err: {e}")
        finally:
            db.close()

    @classmethod
    async def create_subtasks(cls, current_user, tasks_data, task_parent_id):
        try:
            db = await connection()
            check_user = db.query(users.User).filter(users.User.id == current_user).first()
            if not check_user:
                raise Exception("User is not valid")

            subtasks_to_insert = [
                cls(user_id=current_user,
                    content=task_data['content'],
                    type=task_data['type'],
                    status=task_data['status'],
                    expiry=None,
                    reminder=None,
                    repeat="Null",
                    color=None,
                    task_parent_id=task_parent_id,
                    date_completed=datetime.datetime.now() if task_data["status"] else None)
                for task_data in tasks_data
            ]

            all_subtasks_are_true = all(task_data['status'] == True for task_data in tasks_data)
            if all_subtasks_are_true:
                stmt = update(Task).where(Task.id == task_parent_id).values(status=True,
                                                                            date_completed=datetime.datetime.now())
                db.execute(stmt)

            for subtask in subtasks_to_insert:
                db.add(subtask)

            db.flush()
            db.commit()

            for task in subtasks_to_insert:
                db.refresh(task)

            return subtasks_to_insert

        except Exception as e:
            db.rollback()
            raise Exception(f"Error: {e}")
        finally:
            db.close()

    @classmethod
    async def update_task(cls, task_id, content, task_type, status, expiry, reminder, repeat, color, date_completed):
        try:
            db = await connection()
            stmt = (update(Task).where(Task.id == task_id)
                    .values(content=content,
                            type=task_type,
                            status=status,
                            color=color,
                            expiry=expiry,
                            reminder=reminder,
                            repeat=repeat,
                            date_completed=date_completed)
                    .returning(Task.id,
                               Task.content,
                               Task.type,
                               Task.status,
                               Task.color,
                               Task.expiry,
                               Task.reminder,
                               Task.repeat,
                               Task.created,
                               Task.task_parent_id,
                               Task.date_completed,
                               Task.subtasks))

            result = db.execute(stmt)
            task = result.fetchone()

            if status and task.type == "tasks":
                stmt2 = (update(Task)
                         .where(Task.task_parent_id == task_id)
                         .values(status=True,
                                 date_completed=date_completed))
                db.execute(stmt2)

            elif not status and task.type == "tasks":
                stmt3 = (update(Task)
                         .where(Task.task_parent_id == task_id)
                         .values(status=False, date_completed=None))
                db.execute(stmt3)

            db.commit()
            return task
        except Exception as e:
            db.rollback()
            raise Exception(f'err: {e}')
        finally:
            db.close()

    @classmethod
    async def delete_task(cls, task_id):
        try:
            db = await connection()
            stmt = delete(Task).where(Task.id == task_id)
            db.execute(stmt)
            db.commit()
        except Exception as e:
            db.rollback()
            raise Exception(f'err: {e}')
        finally:
            db.close()