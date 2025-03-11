import time

import schedule

from tasks import send_mail_task_expiry

schedule.every().day.at("06:00").do(send_mail_task_expiry.delay)

while True:
    schedule.run_pending()
    time.sleep(60)