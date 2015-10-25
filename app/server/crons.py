import schedule
import time
from server.models import *

def checker():
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


schedule.every(2).minutes.do(checker)
schedule.every(5).minutes.do(clear_pin_sent_timeouts)
schedule.every(10).minutes.do(clear_unverified_phones)

print('alert checker started')
checker()