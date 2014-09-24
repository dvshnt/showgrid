import inspect, itertools, json
from datetime import timedelta, date

from showgrid.models import *

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
			d2 = d1 + timedelta(days=7)
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=7)

		data = []
		venues = Venue.objects.all()
		if request.GET.get('_escaped_fragment_', ''):
			for venue in venues:
				shows = Show.objects.filter(venue=venue.id).filter(date__range=
					[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
				)
				venue.shows = shows

				return render(request, 'index_seo.html', {'venues' : venues})

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
		# elif request.method == "POST":
		# 	return post_venue(request)

	#/venue/<?venue>
	elif validate_object_existence(venue=venue):
		if request.method == "GET":
			return get_venue(request, venue=venue)
		# elif request.method == "PUT":
		# 	return edit_venue(request, venue=venue)
		# elif request.method == "DELETE":
		# 	return delete_venue(request, venue=venue)
	
	return error_handler(request)

def show(request, show=None):
	# /show/
	if show == None:
		if request.method == "GET":
			return get_show(request)
		# elif request.method == "POST":
		# 	if validate_object_existence(request.POST.get('venue', '')):
		# 		return post_show(request, venue=venue)
		# 	return HttpResponse("no such venue")

	#/show/<?show?>
	elif validate_object_existence(show=show):
		if request.method == "GET":
			return get_show(request, show=show)
		# elif request.method == "PUT":
		# 	return edit_show(request, show=show)
		# elif request.method == "DELETE":
		# 	return delete_show(request, show=show)

	return error_handler(request)

def venue_and_show(request, venue, show=None):
	#/venue/<?venue?>/show/
	if validate_object_existence(venue=venue):
		if show == None:
			if request.method == "GET":
				return get_show(request, venue=venue)
			# elif request.method == "POST":
			# 	return post_show(request, venue=venue)

		#/venue/<?venue?>/show/<?show?>
		if request.method == "GET":
			return get_show(request, venue=venue, show=show)
		# elif request.method == "PUT":
		# 	return edit_show(request, venue=venue, show=show)
		# elif request.method == "DELETE":
		# 	return delete_show(request, venue=venue, show=show)

	return error_handler(request)






##### VENUE REST METHODS #####
# @login_required
# @validate_json
def post_venue(request):
	resp = {'status' : 'success'}

	# Check if venue already exists
	name = request.POST.get('name', '')
	website = request.POST.get('website', '')
	image = request.POST.get('image', '')
	
	street = request.POST.get('street', '')
	city = request.POST.get('city', '')
	state = request.POST.get('state', '')
	zip_code = request.POST.get('zip_code', '')

	# Check if Address already exists
	address = Address(street=street, city=city, state=state, zip_code=zip_code)
	address.save()

	with open(image) as f:
		image = File(f)
		venue = Venue(name=name, website=website, image=image, address=address)
		venue.save()

	response = HttpResponse(json.dumps(resp), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response
	

def get_venue(request, venue=None):
	if venue == None:
		data = [ venue.json() for venue in Venue.objects.all() ]
		return HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')

	data = Venue.objects.get(id=venue).json()
	response = HttpResponse(json.dumps(data), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response
	

# @login_required
# @validate_json
# We assume that the Venue item does exist at this point
def edit_venue(request, venue):
	resp = {'status' : 'success'}

	data = {
		'name' : request.POST.get('name', ''),
		'website' : request.POST.get('website', ''),
		'image' : request.POST.get('image', '')
	}

	venue = Venue.objects.get(id=venue)

	for k, v in data.iteritems():
		if v != '':
			setattr(venue, k, v)

	response = HttpResponse(json.dumps(resp), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response
	

# @login_required
def delete_venue(request, venue):
	venue = Venue.objects.get(id=venue)
	venue.delete()

	response = HttpResponse(json.dumps({'status' : 'success'}), content_type='application/json; charset=UTF-8')
	response.__setitem__("Content-type", "application/json")
	response.__setitem__("Access-Control-Allow-Origin", "*")
	return response


##### SHOW REST METHODS #####
# @login_required
# @validate_json
def post_show(request, venue):
	# read JSON
	# validate JSON
	# create object from JSON if it doesn't already exist
	# save object
	# return status
	return HttpResponse("")


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


# @login_required
# @validate_json
def edit_show(request, show, venue=None):
	return HttpResponse("")


# @login_required
def delete_show(request, show, venue=None):
	show = Show.objects.get(id=show)
	show.delete()

	response = HttpResponse(json.dumps({'status' : 'success'}), content_type='application/json; charset=UTF-8')
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