import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import smtp_config
from .environment import Env


class MailSender:

    def __init__(self, **kwargs):
        self._username = kwargs["username"]
        self._password = kwargs["password"]
        self._smtp_server = kwargs["smtp_server"]
        self._smtp_port = kwargs["smtp_port"]
        self._server = None
        self._logged_in = False

    def _get_server(self):
        if not self._logged_in:
            return self._login_server()
        return self._server

    def _login_server(self):
        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(self._smtp_server, self._smtp_port, context=context)
        server.login(self._username, self._password)
        self._logged_in = True
        self._server = server
        return self._server

    def send_mail(self, body, subject, email_to):
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = self._username
        message["To"] = email_to

        part = MIMEText(body, "html")
        message.attach(part)
        server = self._get_server()
        server.sendmail(self._username, email_to, message.as_string())
        return True


def send_notify_email_register(message):
    subject = "Registration"
    templates = "services/mail/mail_templates"
    file_name = "mail_content.html"
    data = {"username": message["username"]}
    body = Env().set_env_mail(templates=templates, filename=file_name, **data)
    MailSender(**smtp_config).send_mail(subject=subject, body=body, email_to=message["email"])


def send_notify_email_forgot_password(message):
    subject = "Password"
    templates = "services/mail/mail_templates"
    file_name = "change_password_sc.html"
    data = {"username": message["username"]}
    body = Env().set_env_mail(templates=templates, filename=file_name, **data)
    MailSender(**smtp_config).send_mail(subject=subject, body=body, email_to=message["email"])


def send_notify_email_otp(message):
    subject = "OTP"
    templates = "services/mail/mail_templates"
    file_name = "mail_otp.html"
    data = {"username": message["username"], "otp": message["otp"]}
    body = Env().set_env_mail(templates=templates, filename=file_name, **data)
    MailSender(**smtp_config).send_mail(subject=subject, body=body, email_to=message["email"])


def send_notify_task_expiry(message):
    subject = "TASKS"
    templates = "services/mail/mail_templates"
    file_name = "task_expiry.html"
    task_content = ""
    for task in message:
        for ct in range(len(task.task)):
            task_content += f"{ct + 1}: {task[ct].content}\n"
        data = {"username": task["username"], "content_task": task_content, "expiry": task.expiry, "len_task": len(task)}
        body = Env().set_env_mail(templates=templates, filename=file_name, **data)
        MailSender(**smtp_config).send_mail(subject=subject, body=body, email_to=task.email)