import schedule
import time
from server.models import *

def checker():
	alerts = Phone_Alerts.objects.all()
	print('checking '+len(alerts)+' alerts')
	for alert in alerts:
		if alert.check_send() == True:
			alert.delete()


schedule.every(2).minutes.do(checker)
print('alert checker started')
checker()