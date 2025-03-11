import os

from dotenv import load_dotenv

load_dotenv()

url_db = os.getenv("URL_DB")

secret_key = os.getenv("SECRET_KEY")

# mail
smtp_server = os.getenv("SMTP_SERVER")
smtp_port = os.getenv("SMTP_PORT")
sender_email = os.getenv("USERNAME_MAIL")
pass_email = os.getenv("PASS")

smtp_config = {"smtp_server": smtp_server,
               "smtp_port": smtp_port,
               "username": sender_email,
               "password": pass_email}

# broker
rabbitmq = os.getenv("RABBITMQ_URL")
