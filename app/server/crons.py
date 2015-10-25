import schedule
import time
from server.models import *

def check_alerts():
	alerts = Alerts.objects.all()
	print('checking '+len(alerts)+' alerts')
	for alert in alerts:
		if alert.check_send() == True:
			alert.delete()

def clear_pin_sent_timeouts():
	users = ShowgridUser.objects.all()
	for user in users:
		user.pin_sent = False
		user.save()

def clear_unverified_phones():
	users = ShowgridUser.objects.all()
	for user in users:
		if user.phone_verified == False:
			user.phone_number = None
			user.save()

#incase of errors and slerts didnt get sent. (up to 2 retries depending on schedule and alert_leeway)
#normally alerts will be deleted after they are sent.
def clear_alert_send_timeout():
	alerts = Alerts.objects.all()
	for alert in alerts:
		alert.sent = 0
		alert.save()

schedule.every(2).minutes.do(check_alerts)
schedule.every(1).minutes.do(clear_pin_sent_timeouts)
schedule.every(10).minutes.do(clear_unverified_phones)
schedule.every(5).minutes.do(clear_alert_send_timeout)

print('alert checker started')
check_alerts()