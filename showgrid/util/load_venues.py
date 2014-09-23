import json
from django.core.management import setup_environ
from showgrid import settings
setup_environ(settings)

from showgrid.models import Venue, Address
from django.core.files import File

with open('venues.json') as venues:
	data = json.load(venues)
	for row in data['venues']:
		
		address = Address(
			street=row['address'][0]['street'], city=row['address'][0]['city'], 
			state=row['address'][0]['state'], zip_code=row['address'][0]['zip']
		)
		address.save()

		with open('../' + row["image"], 'r') as f:
			image = File(f)
			venue = Venue(name=row['name'], address=address, website=row['website'], image=image)
			venue.save()