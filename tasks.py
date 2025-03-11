from celery import Celery
import requests
import config

from services.mail.mail_sender import send_notify_email_register, send_notify_email_forgot_password, send_notify_email_otp
app = Celery('tasks', broker=config.rabbitmq)


@app.task
def send_mail_register(data):
    send_notify_email_register(data)


@app.task
def send_mail_forgot_password(data):
    send_notify_email_forgot_password(data)

@app.task
def send_mail_otp(data):
    send_notify_email_otp(data)

@app.task
def send_mail_task_expiry():
    pass

@app.task
def send_telegram(data):
    message = f"User {data['email']} just joined your system"
    requests.get(url="https://api.telegram.org/bot7918915499:AAEH8QkWb4LQSHovDVwfs7syee3414WdGIk/sendMessage?chat_id=1457896502"
                     f"&text={message}")