from sqlalchemy import Column, String, Integer, DateTime, func, update
from sqlalchemy.orm import relationship
from database import Base
from database import connection
from services.hash import hash_password


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(60), nullable=False)
    password = Column(String(255), nullable=False)
    email = Column(String(60), nullable=False, unique=True)
    created = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    from models.notes import Note
    from models.tasks import Task
    notes = relationship("Note", back_populates="user", cascade="all, delete", passive_deletes=True, lazy="joined")
    tasks = relationship("Task", back_populates="user", cascade="all, delete", passive_deletes=True, lazy="joined")

    @classmethod
    async def get_user(cls, email):
        try:
            db = await connection()
            data = db.query(User).filter(User.email == email).first()
            db.remove()
            return data
        except Exception as e:
            raise Exception(f'err: {e}')
        finally:
            db.close()

    @classmethod
    async def create_user(cls, payload):
        try:
            db = await connection()
            new_user = cls(username=payload.username,
                           password=await hash_password(payload.password),
                           email=payload.email)
            db.add(new_user)
            db.flush()
            db.commit()
            db.refresh(new_user)
            return new_user
        except Exception as e:
            raise Exception(f"An error occurred while inserting user: {str(e)}")
        finally:
            db.close()

    @classmethod
    async def reset_password(cls, email, password):
        try:
            db = await connection()
            sql = (update(User)
                   .where(User.email == email)
                   .values(password=password)
                   .returning(User.id, User.username, User.email))
            result = db.execute(sql).fetchone()
            db.commit()
            return result
        except Exception as e:
            raise Exception(f"An error occurred while inserting user: {str(e)}")
        finally:
            db.close()