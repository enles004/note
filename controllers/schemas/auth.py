from pydantic import BaseModel, EmailStr, field_validator, Field, conint, model_validator


# class RegisterSchema(Schema):
#     username = fields.String(required=True, validate=validate.Length(min=3, max=20))
#     password = fields.String(required=True, validate=validate.Length(min=6, max=20))
#     confirm_password = fields.String(required=True)
#     email = fields.Email(required=True)
#
#     @validates_schema
#     def validate_confirm_password(self, data, **kwargs):
#         if data["password"] != data["confirm_password"]:
#             raise ValidationError("Incorrect confirm password")
#
#
# class LoginSchema(Schema):
#     email = fields.Email(required=True, validate=validate.Email())
#     password = fields.String(required=True)

class RegisterSchema(BaseModel):
    username: str = Field(min_length=6, max_length=20, description="Username length is between 6 and 20 characters.")
    password: str = Field(min_length=6, max_length=30, description="Password length is between 6 and 30 characters.")
    confirm_password: str = Field(min_length=6, max_length=30, description="confirm_password must match the password")
    email: EmailStr


    @model_validator(mode="after")
    def password_match(self):
        pw1 = self.password
        pw2 = self.confirm_password
        if pw1 != pw2:
            raise ValueError("confirm_password does not match password!")
        return self


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=30, description="Used to log into the system.")


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class OTPSchema(BaseModel):
    email: EmailStr
    otp: conint(ge=100000, le=999999)


class PasswordSchema(BaseModel):
    email: EmailStr
    new_password: str = Field(min_length=6, max_length=30, description="new password for your account.")
    confirm_new_password: str = Field(min_length=6, max_length=30, description="confirm new password for your account.")

    @model_validator(mode="after")
    def password_match(self):
        pw1 = self.new_password
        pw2 = self.confirm_new_password
        if pw1 != pw2:
            raise ValueError("confirm_new_password does not match new_password!")
        return self
