import inspect, itertools, json
from datetime import timedelta, date, datetime

import datetime as datetime_2

from operator import attrgetter

from pytz import timezone

from server.models import *

from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render

from haystack.query import SearchQuerySet


def index(request, year=None, month=None, day=None):
	return render(request, "index.html")


def validate_object_existence(venue=None, show=None):
	if venue != None:
		try:
			venue = Venue.objects.get(id=venue)
		except Venue.DoesNotExist:
			return False

	if show != None:
		try:
			show = Show.objects.get(id=show)
		except Show.DoesNotExist:
			return False

	return True


## Shows on sale within the next 5 days
def shows_on_sale_soon(request):
	result = []

	if request.method == "GET":
		d1 = date.today()
		d2 = d1 + timedelta(days=5)

		shows = Show_v2.objects.filter(onsale__range=
			[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
		).order_by('onsale')

		result = [ show.json_min() for show in shows ]

		response = HttpResponse(json.dumps(result), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response



## Shows recently added most recent 10
def recently_added(request):
	result = []

	if request.method == "GET":
		shows = Show_v2.objects.all().order_by('-id')[:10]

		result = [ show.json_min() for show in shows ]

		response = HttpResponse(json.dumps(result), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response



def grid(request, year=None, month=None, day=None):
	if request.method == "GET":
		if year != None and month != None or day != None:
			d1 = date(int(year), int(month), int(day))
			d2 = d1 + timedelta(days=int(request.GET['range']))
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=int(request.GET['range']))

		data = []
		venues = sorted(Venue_v2.objects.all(), key=attrgetter('alphabetical_title'), reverse=False)
		for venue in venues:
			shows = Show_v2.objects.filter(venue=venue.id).filter(date__range=
				[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
			).order_by('date')

			info = venue.json()
			info['shows'] = [ show.json_min() for show in shows ]
			info['image_url'] = "pic " + get_venue_class(venue.image.url)
			data.append(info)

		response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response
	
	response = HttpResponse(json.dumps({"status" : "error"}), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response


def check_venues(request):
	d1 = date.today()
	d2 = d1 + timedelta(days=365)

	data = []
	venues = sorted(Venue_v2.objects.all(), key=attrgetter('alphabetical_title'), reverse=False)
	for venue in venues:
		shows = Show_v2.objects.filter(venue=venue.id).filter(date__range=
			[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
		).order_by('date')

		info = venue.json()
		info['shows'] = [ show.json_min() for show in shows ]
		info['image_url'] = get_venue_class(venue.image.url)
		data.append(info)


	return render(request, 'venues.html', { 'venues': data })



def _search_result_to_dict(result):
	try:
		shows = result['shows']
	except KeyError:
		shows = ""

	return {
		'id': result['id'],
		'name': result['name'],
		'address': result['address'],
		'website': result['website'],
		'shows': shows,
	}


def get_search_results(request):
	if request.method == "GET":
		query = request.GET['q']

		querySet = SearchQuerySet().filter(text=query).order_by('venue')

		results = format_results(querySet)
		shows = map(_search_result_to_dict, results)

		result = {
			"query": query,
			"results": shows
		}

		response = HttpResponse(json.dumps(result), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response


def format_results(shows):
	results = []
	venues = [] # Tracking which venues are in the list

	for show in shows:
		if show.venue not in venues:
			venue = Venue_v2.objects.get(name=show.venue).json()
			venue['shows'] = []

			venues.append(show.venue)
			results.append(venue)

	for show in shows:
		for result in results:
			if result['name'] == show.venue:
				result['shows'].append({
					'title': show.title,
					'headliners': show.headliners,
					'openers': show.openers,
					'date': convert_timezone(show.date),
					'website': show.website,
					'price': show.price,
					'age': show.age,
					'ticket': show.ticket,
					'soldout': show.soldout,
					'onsale': show.onsale
				})
				break

	for result in results:
		result['shows'] = group_by_date(result['shows'])

	results.sort(key=lambda x: x['name'], reverse=False)

	return results


def convert_timezone(date):
	from dateutil import tz

	# METHOD 1: Hardcode zones:
	from_zone = tz.gettz('UTC')
	to_zone = tz.gettz('America/Chicago')

	# Tell the datetime object that it's in UTC time zone since 
	# datetime objects are 'naive' by default
	utc = date.replace(tzinfo=from_zone)

	# Convert time zone
	return utc.astimezone(to_zone)


def group_by_date(shows):
	array = shows
	temp = {}
	dates = []
	results = []

	array.sort(key=lambda x: x['date'])

	for show in array:
		tempDate = show['date'].strftime('%m-%d-%Y')
		if tempDate not in dates:
			dates.append(tempDate)
			temp[tempDate] = []


	for show in array:
		for date in dates:
			tempDate = show['date'].strftime('%m-%d-%Y')
			if tempDate == date:
				temp[tempDate].append({
					'title': show['title'],
					'headliners': show['headliners'],
					'openers': show['openers'],
					'date': str(show['date']),
					'website': show['website'],
					'price': show['price'],
					'age': show['age'],
					'ticket': show['ticket'],
					'soldout': show['soldout'],
					'onsale': str(show['onsale'])
				})
				break

	for k, v in temp.iteritems():
		results.append(v)

	results.sort(key=lambda x: x[0]['date'])

	return results


def venue(request, venue=None):
	#/venue/
	if venue == None:
		if request.method == "GET":
			return get_venue(request)

	#/venue/<?venue>
	elif validate_object_existence(venue=venue):
		if request.method == "GET":
			return get_venue(request, venue=venue)
	
	return error_handler(request)

def show(request, show=None):
	# /show/
	if show == None:
		if request.method == "GET":
			return get_show(request)

	#/show/<?show?>
	elif validate_object_existence(show=show):
		if request.method == "GET":
			return get_show(request, show=show)

	return error_handler(request)

def venue_and_show(request, venue, show=None):
	#/venue/<?venue?>/show/
	if validate_object_existence(venue=venue):
		if show == None:
			if request.method == "GET":
				return get_show(request, venue=venue)

		#/venue/<?venue?>/show/<?show?>
		if request.method == "GET":
			return get_show(request, venue=venue, show=show)

	return error_handler(request)
	

def get_venue(request, venue=None):
	if venue == None:
		data = [ venue.json() for venue in Venue.objects.all() ]
		return HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')

	data = Venue.objects.get(id=venue).json()
	response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response



def get_show(request, venue=None, show=None):
	if venue == None and show == None:
		data = [ show.json_max() for show in Show.objects.all() ]

		response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response
	
	if venue != None and show == None:
		data = [ show.json_min() for show in Show.objects.filter(venue=Venue.objects.get(id=venue)) ]
		
		response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response

	if venue == None and show != None:
		data = [ show.json_max() for show in Show.objects.filter(id=show) ]
		
		response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response

	data = [ show.json_min() for show in Show.objects.filter(id=show, venue=Venue.objects.get(id=venue)) ]
	
	response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response




##### GENERIC ERROR HANDLERS #####
def error_handler(request):
	response = HttpResponse("error")
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response



def get_venue_class(url):
	image_url = ""
	string = str(url).split("/")
	for part in string:
		if "." in part:
			image_url = part.split(".")[0]

			if image_url == "3andl": image_url = "thirdandl"
			elif image_url == "12porter": image_url = "twelveporter"
			elif image_url == "mercylounge_1": image_url = "mercylounge"

			break

	return image_url
