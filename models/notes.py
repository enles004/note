from sqlalchemy import update, delete, Column, String, Integer, func, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from database import Base
from database import connection


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255))
    content = Column(Text)
    color = Column(String(255))
    pined = Column(Boolean, nullable=True, default=False)
    date_pined = Column(DateTime(timezone=True), nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())

    user = relationship("User", back_populates="notes")

    @classmethod
    async def get_one_note(cls, current_user, note_id):
        try:
            db = await connection()
            note = db.query(cls).filter(cls.user_id == current_user, cls.id == note_id).first()
            db.remove()
            return note
        except Exception as e:
            raise Exception(f'err{e}')
        finally:
            db.close()

    @classmethod
    async def get_all_notes(cls, current_user):
        try:
            from models.users import User
            db = await connection()
            check_user = db.query(User).filter(User.id == current_user).first()
            if check_user:
                data = db.query(Note).filter(Note.user_id == current_user).order_by(Note.date_pined.desc().nullslast(), Note.created.asc()).all()
                db.remove()
                return data
            raise Exception("User is not valid")
        except Exception as e:
            raise Exception(f"err: {e}")
        finally:
            db.close()

    @classmethod
    async def create_note(cls, current_user, title, content, color):
        try:
            from models.users import User
            db = await connection()
            check_user = db.query(User).filter(User.id == current_user).first()
            if check_user:
                new_note = cls(user_id=current_user, title=title, content=content, color=color)
                db.add(new_note)
                db.flush()
                db.commit()
                db.refresh(new_note)
                return new_note
            raise Exception("User is not valid")
        except Exception as e:
            raise Exception(f"err: {e}")
        finally:
            db.remove()

    @classmethod
    async def update_note(cls, note_id, title, content, color, pined, date_pined):
        try:
            db = await connection()
            stmt = update(Note).where(Note.id == note_id).values(title=title,
                                                                 content=content,
                                                                 color=color,
                                                                 pined=pined,
                                                                 date_pined=date_pined)
            db.execute(stmt)
            db.commit()
            db.remove()
        except Exception as e:
            raise Exception(f'err: {e}')
        finally:
            db.close()

    @classmethod
    async def delete_note(cls, note_id):
        try:
            db = await connection()
            stmt = delete(Note).where(Note.id == note_id)
            db.execute(stmt)
            db.commit()
            db.remove()
        except Exception as e:
            raise Exception(f'err: {e}')
        finally:
            db.close()
