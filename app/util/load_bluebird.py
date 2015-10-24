# Upload .xls file
# Read shows and place them by venue

import re
import sys
import time
import json
from datetime import datetime
import dateutil.parser

from django.core.management import setup_environ

import sys
sys.path.append('/home/ubuntu/app/showgrid/')
from showgrid import settings
setup_environ(settings)

from showgrid.models import Venue, Show
from django.core.files import File

def get_datetime(date):
	return dateutil.parser.parse(date)

def read_shows(thing):
	with open(thing) as data_file:
		data = json.load(data_file)

		for event in data["events"]:
			name = event.name
			date = get_datetime(event.date)


read_shows(sys.argv[1])
