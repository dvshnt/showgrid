import inspect, itertools, json
from datetime import timedelta, date

from server.models import *

from django_react import ReactComponent

from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render


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


def grid(request, year=None, month=None, day=None):
	if request.method == "GET":
		if year != None and month != None or day != None:
			d1 = date(int(year), int(month), int(day))
			d2 = d1 + timedelta(days=int(request.GET['range']))
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=int(request.GET['range']))

		data = []
		venues = Venue.objects.all()
		for venue in venues:
			shows = Show.objects.filter(venue=venue.id).filter(date__range=
				[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
			)

			info = venue.json()
			info['shows'] = [ show.json_min() for show in shows ]
			info['image_url'] = get_venue_class(venue.image.url)
			data.append(info)

		response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
		response.__setitem__("Content-type", "application/json")
		response.__setitem__("Access-Control-Allow-Origin", "*")
		return response
	
	response = HttpResponse(json.dumps({"status" : "error"}), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response


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

	return "pic " + image_url