from datetime import datetime

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, update, Boolean, delete, func

from database import Base, connection


class OTP(Base):
    __tablename__ = "otp"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), ForeignKey("users.email", ondelete="CASCADE"))
    otp = Column(Integer, nullable=False)
    expiry = Column(DateTime, nullable=False)
    created = Column(DateTime(timezone=True), nullable=False, default=func.now(), server_default=func.now())
    status = Column(Boolean, nullable=False, default=False)


    @classmethod
    async def get_otp(cls, email, otp):
        try:
            db = await connection()
            result = db.query(OTP).filter(OTP.email == email, OTP.otp == otp).first()
            if not result:
                return result

            return result
        except Exception as err:
            raise Exception(f'err{err}')
        finally:
            db.close()


    @classmethod
    async def create_otp(cls, email, otp):
        try:
            db = await connection()

            time_now = datetime.datetime.now()
            expiry_time = time_now + datetime.timedelta(minutes=2)

            check_otp = db.query(OTP).filter(OTP.email == email).first()
            new_otp = None
            if not check_otp:
                new_otp = cls(email=email, otp=otp, expiry=expiry_time, created=time_now)
                db.add(new_otp)
                db.commit()
                db.refresh(new_otp)
                return [new_otp]
            else:
                new_otp = (update(OTP)
                           .where(OTP.email == email)
                           .values(otp=otp,
                                   expiry=expiry_time,
                                   created=time_now,
                                   status=False)
                           .returning(OTP.email,
                                      OTP.otp,
                                      OTP.expiry,
                                      OTP.created))
                result = db.execute(new_otp).fetchall()
                db.commit()
                return result

        except Exception as err:
            raise Exception(f'err{err}')
        finally:
            db.close()

    @classmethod
    async def verify_otp(cls, email, otp):
        try:
            db = await connection()
            stmt = (update(OTP)
                    .where(OTP.email == email, OTP.otp == otp)
                    .values(status=True))

            db.execute(stmt)
            db.commit()
        except Exception as err:
            raise Exception(f'err{err}')
        finally:
            db.close()

    @classmethod
    async def get_otp_verified(cls, email):
        try:
            db = await connection()
            otp = db.query(OTP).filter(OTP.email == email, OTP.status == True).first()
            return otp
        except Exception as err:
            raise Exception(f'err{err}')
        finally:
            db.close()

    @classmethod
    async def delete_otp(cls, email):
        try:
            db = await connection()
            stmt = delete(OTP).where(OTP.email == email)
            db.execute(stmt)
            db.commit()
        except Exception as err:
            raise Exception(f'err{err}')
        finally:
            db.close()