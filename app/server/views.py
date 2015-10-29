import inspect, itertools, json
from datetime import timedelta, date, datetime

import json
import collections

import datetime as datetime_2

from operator import attrgetter

from django.views.decorators.csrf import csrf_exempt


from server.models import *

from django.http import HttpResponse
from django.http import HttpResponseServerError
from django.http import JsonResponse

from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist

# from haystack.query import SearchQuerySet


#may want to move these to settings.py (b/c thats where the other auth settings are located)



from rest_framework import permissions, status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from server.models import *
from server.serializers import *

import dateutil.parser
import re
def index(request, year=None, month=None, day=None):
	return render(request, "index.html")



class UserActions(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)


	def get_show(self, pk):
		try:
			return Show.objects.get(id=pk)
		except ObjectDoesNotExist:
			return None

	def post(self, request, action=None):

		user = request.user
		if action == 'favorite':


			show = self.get_show(int(request.GET.get('show')))
			if show != None:
				

				print request.user

				if show in user.favorites.all():
					user.favorites.remove(show)
					status = ""
				else:
					user.favorites.add(show)
					status = "active"

				user.save()

			 	return Response({ 'status': status })
			return Response({ 'status': 'failed' })



		#return false if phone is not verified
		if action == 'phone_status':
			if user.phone == None:
				return Response({'status':'no_phone_added'})
			return Response({'status':user.phone_verified})

		#set user phone
		if action == 'phone_set':
			phone = request.GET.get('phone')
			


			if phone == None:
				return Response({'status':'bad_query'})
			
			if user.phone == None:
				user.phone_verified = False
				user.phone = phone
				user.save()
				return Response({'status':'phone_set',phone:user.phone},mimetype="application/json")
			
			elif user.phone_verified == False:
				user.phone = phone
				user.save()
				return Response({'status':'phone_set','phone':user.phone.format_as('GB')})
			
			else:
				alerts = Alert.objects.filter(user=user)
				for alert in alerts:
					alert.delete()
				user.phone = phone
				user.save()
				return Response({'status':'phone_set_alerts_cleared',phone:user.phone})

		#send pin to user phone
		if action == 'pin_send':
			# if user.is_authenticated() == False:
			# 	return Response({'status':'not_authenticated'})

			if user.phone == None:
				return Response({'status':'no_phone_added'})

			if user.phone_verified:
				return Response({'status': 'pin_verified'})

			if user.pin_sent:
				return Response({'status': 'pin_sent_timeout'})

		
			user.send_pin(user.generate_pin())
			user.save()
			return Response({'status': 'pin_sent'})

		#check user pin
		if action == 'pin_check':
			pin = request.GET.get('pin')
			
			if pin == None:
				return Response({'status':'bad_query'})
			if user.phone_verified:
				return Response({'status': 'pin_verified'})
			if user.check_pin(pin):
				user.phone_verified = True
				user.save()
				return Response({'status': 'pin_verified'})
			else:
				return Response({'status': 'bad_pin','phone': user.phone})

		#toggle alert
		if action == 'alert_toggle':
			if user.phone_verified == False:
				return  Response({ 'status': 'phone_not_verified' })



			date = request.GET.get('date')
			show = request.GET.get('show')


			show_id = show
			show = self.get_show(int(show))
			
			

			if show == None:
				return  Response({ 'status': 'failed' })

			user_show_alerts = Alert.objects.filter(user=user,show=show)


			#ALERT EXITS : DELETE
			if user_show_alerts:
				user_show_alerts[0].delete() #assuming there is one alert per show per user
				return  Response({ 'status': 'alert_removed' })
			
			#ALERT DOES NOT EXIST : CREATE NEW
			else:
				if date == None:
					return  Response({ 'status': 'bad_query' })
				
				date = dateutil.parser.parse(date)

				if re.search('^\d+$',show_id) == None:
					return  Response({ 'status': 'bad_query' })
				alert = Alert(is_active=True, show=show, date=date,user=user)
				alert.save()
				return  Response({ 'status': 'alert_created' })

		#clear all user alerts
		if action == 'alert_clearall':
			user_alerts = Alert.objects.filter(user=user)
			for alert in user_alerts:
				alert.delete()
			return  Response({ 'status': 'alerts_cleared' })
		if action == 'alert_count':
			user_show_alerts = Alert.objects.filter(user=user)
			return  Response({ 'status': len(user_show_alerts) })

		if action == 'alert_getall':
			user_show_alerts = Alert.objects.filter(user=user)
			
			return  Response({ 'status' : True , 'data' : [ alert.json() for alert in user_show_alerts ] })

		return  Response({ 'status': 'bad_query' })





class VenueList(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticatedOrReadOnly,)

	def get(self, request, year=None, month=None, day=None):
		if year != None and month != None or day != None:
			d1 = date(int(year), int(month), int(day))
			d2 = d1 + timedelta(days=int(request.GET['range']))
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=int(request.GET['range']))

		venues = Venue.objects.filter(opened=True)
		venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)


		if request.user.is_authenticated():
			serializer = VenueSerializer(venues, many=True, context={ 'start': d1, 'end': d2, 'user': request.user })
		else:
			serializer = VenueSerializer(venues, many=True, context={ 'start': d1, 'end': d2 })

		return Response(serializer.data)





class ShowList(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticatedOrReadOnly,)

	def get_featured_shows(self):
		shows = Show.objects.filter(star=True)
		shows = shows.filter(date__gte=date.today())
		shows = shows.order_by('date', 'venue')
		return shows

	def get_recent_shows(self):
		shows = Show.objects.filter(date__gte=date.today().strftime("%Y-%m-%d"))
		shows = shows.filter(created_at__lte=(date.today() + timedelta(1)))
		shows = shows.order_by('-created_at', 'date', 'venue__name')
		return shows

	def get(self, request):
		method = request.GET.get('method')
		if method == 'recent':
			shows = self.get_recent_shows()
		elif method == 'featured':
			shows = self.get_featured_shows()
		else:
			shows = Show.objects.all()

		paginator = Paginator(shows, 100)

		page = request.GET.get('page')
		try:
			shows = paginator.page(page)
		except PageNotAnInteger:
			shows = paginator.page(1)
		except EmptyPage:
			return JSONResponse("Last Page", status=204)


		if request.user.is_authenticated():
			print "USER LOGGED IN"
			serializer = ShowListSerializer(shows, many=True, context={ 'user': request.user })
		else:
			print "USER NOT LOGGED IN"
			serializer = ShowListSerializer(shows, many=True, context={  })

		return Response(serializer.data)





def check_venues(request):
	d1 = date.today()
	d2 = d1 + timedelta(days=365)

	data = []
	venues = sorted(Venue.objects.all(), key=attrgetter('alphabetical_title'), reverse=False)
	for venue in venues:
		shows = Show.objects.filter(venue=venue.id).filter(date__range=
			[ d1.strftime("%Y-%m-%d"), d2.strftime("%Y-%m-%d") ]
		).order_by('date')

		info = venue.json()
		info['shows'] = [ show.json_min() for show in shows ]
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

		results = [ Show.objects.get(id=show.pk).json_max() for show in querySet ]

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



