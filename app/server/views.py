import inspect, itertools, json
from datetime import timedelta, date, datetime

import datetime as datetime_2

from operator import attrgetter

from pytz import timezone

from server.models import *

from django.http import HttpResponse
from django.http import HttpResponseServerError
from django.http import JsonResponse

from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# from haystack.query import SearchQuerySet


#may want to move these to settings.py (b/c thats where the other auth settings are located)




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








from dateutil.parser import parse

# SEND PHONE NUMBER PIN
def phone_send_pin(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')

	phone = request.GET.get('phone')
	
	#error exception
	if phone == None:
		return HttpResponseServerError('error')

	#search db for maching phone numbers
	matches = Phone_Account.objects.filter(phone_number=phone)

	#no matches, create a new phone account
	if not matches:
		account = Phone_Account.objects.create(phone_number=phone)
		account.send_pin(account.generate_pin())
		account.save() #will return 500 error if failed
		return JsonResponse({'status':'SENT','phone':account.phone_number})
	else:
		account = matches[0]


	#return verified status if phone number is already verified
 	if account.verified == True:
		return JsonResponse({'status':'VERIFIED','phone':account.phone_number})
	
	#resend the pin if phone number is not verified
	else:
		account.send_pin(account.generate_pin())
		account.save()
		return JsonResponse({'status':'PIN_RESENT','phone':account.phone_number})


# VERIFY PHONE NUMBER PIN
def phone_verify_pin(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')
	pin = request.GET.get('pin')
	phone = request.GET.get('phone')

	if pin == None or phone == None:
		return HttpResponseServerError('error')


	account = Phone_Account.objects.get(phone_number=phone)

	if account.check_pin(pin):
		account.save()
		return JsonResponse({'status':'VERIFIED','phone':account.phone_number})
	else:
		return JsonResponse({'status':'BADPIN','phone':account.phone_number})


# VERIFY PHONE NUMBER STATUS
def phone_check_status(request):
	if request.method != 'GET':
		return HttpResponseServerError('bad query')

	phone = request.GET.get('phone')

	if phone == None:
		return HttpResponseServerError('invalid param')

	account = Phone_Account.objects.get(phone_number=phone)
	if account.verified == True:
		account.save()
		return JsonResponse({'status':'VERIFIED','phone':account.phone_number})
	else:
		return JsonResponse({'status':'NOTVERIFIED','phone':account.phone_number})


# SET PHONE NUMBER ALERT
def phone_add_alert(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')

	phone = request.GET.get('phone')
	alert_time = request.GET.get('time')
	show_id = request.GET.get('show_id')

	if phone == None or slert_at == None or show_id == None:
		return HttpResponseServerError('bad query')

	show = Show_v2.objects.get(id=show_id)
	account = Phone_Account.objects.get(phone_number=phone)

	if account.verified == False:
		return JsonResponse({'status':'NOT_VERIFIED','phone':account.phone_number})

	#avoid duplicate alerts
	matches = Phone_Alert.objects.filter(phone_account = account,show = show)

	#if no matching alerts
	if not len(matches):
		alert = Phone_Alert.objects.create(phone_account=account,time = parse(alert_time),show = show)
		alert.save()
		return JsonResponse({'status':'ALERT_ADDED','phone':account.phone_number,'time':alert_time})
	
	#else change alert
	else:
		alert = matches[0]
		alert.time = parse(alert_time)
		alert.save();
		return JsonResponse({'status':'ALERT_CHANGED','phone':account.phone_number,'time':alert_time})


#SHOW ALL ALERTS
def phone_show_alerts(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')
	phone = request.GET.get('phone')
	if phone == None:
		return HttpResponseServerError('bad query')

	phone_account = Phone_Account.objects.get(phone_number=phone)
	alerts = Phone_Alert.objects.filter(phone_account=phone_account)

	return JsonResponse({'alerts':account.alerts})


#REMOVE ALERT
def phone_remove_alert(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')

	account = Phone_Account.objects.get(phone_number=phone)
	alert = Phone_Alert.objects.get(id=alert_id)

	if account.verified == False:
		return JsonResponse({'status':'NOT_VERIFIED','phone':account.phone_number})

	alert.delete()
	
	return JsonResponse({'status':'ALERT_REMOVED','phone':account.phone_number})
	


#REMOVE ALL ALERTS
def phone_remove_all_alerts(request):
	if request.method != 'GET':
		return HttpResponseServerError('error')

	phone = request.GET.get('phone')
	if phone == None:
		return HttpResponseServerError('bad query')

	account = Phone_Account.objects.get(phone_number=phone)

	if account.verified == False:
		return JsonResponse({'status':'NOT_VERIFIED','phone':account.phone_number})

	alerts = Phone_Alert.objects.filter(phone_account=account)
	
	for alert in alerts:
		alert.delete()

	return JsonResponse({'status':'ALERTS_REMOVED','phone':account.phone_number})







