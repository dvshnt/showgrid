import inspect, itertools, json
from datetime import timedelta, date, datetime

import datetime as datetime_2

from operator import attrgetter

from pytz import timezone

from server.models import *

from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from haystack.query import SearchQuerySet


def index(request, year=None, month=None, day=None):
	return render(request, "index.html")


# GET CALENDAR
def grid(request, year=None, month=None, day=None):
	if request.method == "GET":
		data = []

		if year != None and month != None or day != None:
			d1 = date(int(year), int(month), int(day))
			d2 = d1 + timedelta(days=int(request.GET['range']))
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=int(request.GET['range']))
		
		venues = sorted(Venue_v2.objects.filter(opened=True), key=attrgetter('alphabetical_title'), reverse=False)
		
		for venue in venues:
			shows = Show_v2.objects.filter(venue=venue.id).filter(
				date__range=[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
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



# GET RECOMMENDED SHOWS
def recommended_shows(request):
	result = []

	if request.method == "GET":
		shows_list = Show_v2.objects.filter(star=True)
		shows_list = shows_list.filter(date__gte=date.today())
		shows_list = shows_list.order_by('date', 'venue')

		paginator = Paginator(shows_list, 100)

		page = request.GET.get('page')
		try:
			shows = paginator.page(page)
		except PageNotAnInteger:
			shows = paginator.page(1)
		except EmptyPage:
			response = HttpResponse(status=204)
			response.__setitem__("Content-type", "application/json")
			response.__setitem__("Access-Control-Allow-Origin", "*")
			return response

		result = group_shows_by_day(shows)

		response = HttpResponse(json.dumps(result), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response


def group_shows_by_day(shows):
	dates = []
	results = []

	for show in shows:
		d = convert_timezone(show.date)
		if d.strftime("%Y-%m-%d") not in dates:
			dates.append(d.strftime("%Y-%m-%d"))

	for d in dates:
		bundle = create_day_bundle(d, shows)
		results.append(bundle)

	return results


def create_day_bundle(day, shows):
	shows_bundle = []
	d = day

	for show in shows:
		d_show = convert_timezone(show.date)
		if d == d_show.strftime("%Y-%m-%d"):
			shows_bundle.append(show.json_max())

	bundle = {
		'date': d,
		'shows': group_shows_by_venue(shows_bundle)
	}

	return bundle

## Shows recently added most recent 10
def recently_added(request):
	result = []

	if request.method == "GET":
		shows_list = Show_v2.objects.filter(date__gte=date.today().strftime("%Y-%m-%d"))
		shows_list = shows_list.filter(created_at__lte=(date.today() + timedelta(1)))
		shows_list = shows_list.order_by('-created_at', 'date', 'venue__name')

		paginator = Paginator(shows_list, 100)

		page = request.GET.get('page')
		try:
			shows = paginator.page(page)
		except PageNotAnInteger:
			shows = paginator.page(1)
		except EmptyPage:
			response = HttpResponse(status=204)
			response.__setitem__("Content-type", "application/json")
			response.__setitem__("Access-Control-Allow-Origin", "*")
			return response

		result = group_shows_by_date(shows, page)

		response = HttpResponse(json.dumps(result), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response


def group_shows_by_date(shows, page):
	# Subtract 1 because we use 1 as first page instead of 0
	dates = []
	results = []

	for show in shows:
		if show.created_at.strftime("%Y-%m-%d") not in dates:
			dates.append(show.created_at.strftime("%Y-%m-%d"))


	for d in dates:
		bundle = create_date_bundle(d, shows)
		results.append(bundle)

	return results



def create_date_bundle(d, shows):
	shows_bundle = []

	for show in shows:
		if d == show.created_at.strftime("%Y-%m-%d"):
			shows_bundle.append(show.json_max())

	bundle = {
		'date': d,
		'shows': shows_bundle
	}

	return bundle


def group_shows_by_venue(shows):
	shows_by_venue = []
	venues = []

	for show in shows:
		if show['venue']['name'] not in venues:
			venues.append(show['venue']['name'])

	for venue in venues:
		shows_of_venue = []
		for show in shows:
			if show['venue']['name'] == venue:
				shows_of_venue.append(show)

		shows_by_venue.append({
			'venue': Venue_v2.objects.get(name=venue).json(),
			'shows': shows_of_venue
		})

	return shows_by_venue






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

		querySet = SearchQuerySet().filter(text=query).order_by('date')

		results = [ Show_v2.objects.get(id=show.pk).json_max() for show in querySet ]

		result = {
			"query": query,
			"results": results
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
