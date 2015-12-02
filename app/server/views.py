import inspect, itertools, json
from datetime import timedelta, date, datetime

import json
import collections

import re #regex

import datetime as datetime_2

from operator import attrgetter

from django.views.decorators.csrf import csrf_exempt
from pytz import timezone

from server.models import *

from django.http import HttpResponse
from django.http import HttpResponseServerError

from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist

from haystack.query import SearchQuerySet


#may want to move these to settings.py (b/c thats where the other auth settings are located)



from rest_framework import permissions, status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny

from server.models import *
from server.serializers import *

import dateutil.parser
import re
def index(request, year=None, month=None, day=None):
	return render(request, "index.html")

from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes





#signup a user and respond with token or 500 error.
@api_view(['POST'])
def signupUser(request):
	body = json.loads(request.body.decode('utf-8'))
	email = body['email']
	password = body['password']
	
	#500 invalid parameters
	if email == None or password == None:
		return Response({"status":"bad_params"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	

	users = ShowgridUser.objects.filter(email=email)
	#500 user with same email exists.
	if len(users) > 0:
		return Response({"status":"user_exists"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	#name = re.split("@",email)[0]


	#200 create a new user and generate token
	user = ShowgridUser.objects.create_user(email, password, phone=None)
	user.is_active=True
 	user.save()
	token = Token.objects.get_or_create(user=user)

	return Response({"token":token[0].key})

def socialAuth(backend, user, response, *args, **kwargs):
	if backend.name == 'facebook':
		profile = user.get_profile()
        if profile is None:
            profile = Profile(user_id=user.id)
        # profile.gender = response.get('gender')
        # profile.link = response.get('link')
        # profile.timezone = response.get('timezone')
        #profile.save()





class UserActions(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)


	def get_show(self, pk):
		try:
			return Show.objects.get(id=pk)
		except ObjectDoesNotExist:
			return None


	def put(self, request, action=None):
		user = request.user

		#update profile
		if action == 'profile':
			body = json.loads(request.body.decode('utf-8'))

			if(body['email'] != "None" and body['email'] != "" and body['email'] != None ):
				user.email = body['email']
				user.username = body['email']

			if(body['name'] != "None" and body['name'] != "" and body['name'] != None):
				user.name = body['name']
			if(body['pass'] != "None" and body['pass'] != "" and body['pass'] != None):
				user.set_password(body['pass'])
			user.save()
			serializer = ShowgridUserSerializer(user)
			return Response(serializer.data)

		elif action == 'alert':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			alert = body['alert']
			date = body['date']
			which = body['which']

			try:
				alert = Alert.objects.get(id=alert)
				alert.date = date
				alert.which = which
				alert.save()
			except:
				return  Response({ 'status': '' })

			return  Response({ 'status': 'alert_updated', 'id': alert.id, 'which': alert.which })


	def get(self, request, action=None):
		user = request.user
		
		#return false if phone is not verified
		if action == 'phone_status':
			if user.phone == None:
				return Response({'status':'no_phone_added'})
			return Response({'status':user.phone_verified})

		if action == 'profile':
			serializer = ShowgridUserSerializer(user)
			return Response(serializer.data)





	def delete(self, request, action=None):
		user = request.user

		if action == 'favorite':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']

			show = self.get_show(int(show))
			if show != None:
				if show in user.favorites.all():
					user.favorites.remove(show)
					status = ""

				user.save()

			 	return Response({ 'status': "success", 'show': show.id })
			return Response({ 'status': "failure", 'show': show.id })


		#clear all user alerts
		if action == 'alert':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			alert = body['alert']

			try:
				user_alert = Alert.objects.get(id=alert)
				user_alert.delete()
			except:
				return  Response({ 'status': 'failure', 'alert': alert })

			return  Response({ 'status': 'success', 'alert': alert })


		#clear all user alerts
		if action == 'alerts':
			user_alerts = Alert.objects.filter(user=user)
			for alert in user_alerts:
				alert.delete()
			return  Response({ 'status': 'alerts_cleared' })



	def post(self, request, action=None):
		user = request.user

		if action == 'favorite':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']

			show = self.get_show(int(show))
			if show != None:
				if show not in user.favorites.all():
					user.favorites.add(show)
					status = "active"

				user.save()

			 	return Response({ 'status': "success", 'show': show.id })
			return Response({ 'status': "failure", 'show': show.id })




		#set user phone
		if action == 'phone_set':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			phone = body['phone']
			
			if phone == None:
				return Response({'status':'bad_query'})
			
			if user.phone == None:
				user.phone_verified = False
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set','phone':user.phone})
			
			elif user.phone_verified == False:
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set','phone':user.phone})
			
			else:
				alerts = Alert.objects.filter(user=user)
				for alert in alerts:
					alert.delete()
				user.phone_verified = False
				user.phone = phone
				user.save()
				user.send_pin(user.generate_pin())
				user.save()
				return Response({'status':'phone_set_alerts_cleared','phone':user.phone})


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
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			pin = body['pin']
			
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
		if action == 'alert':
			if user.phone_verified == False:
				return  Response({ 'status': 'phone_not_verified' })

			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			date = body['date']
			show = body['show']
			which = body['which']

			show_id = show
			show = self.get_show(int(show))

			if show == None:
				return  Response({ 'status': 'no such show' })

			user_show_alerts = Alert.objects.filter(user=user,show=show)

			if user_show_alerts:
				return  Response({ 'status': 'alert_already_set' })
			else:
				if date == None:
					return  Response({ 'status': 'bad date' })
				
				date = dateutil.parser.parse(date)

				alert = Alert(is_active=True, show=show, date=date,user=user,which=which)
				alert.save()

				data = AlertSerializer(alert)

				return  Response( data.data )


		#get user alert count
		if action == 'alert_count':
			user_show_alerts = Alert.objects.filter(user=user)
			return  Response({ 'status': len(user_show_alerts) })

		return  Response({ 'status': 'bad_query' })


class VenueList(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, year=None, month=None, day=None):
		if year != None and month != None or day != None:
			d1 = date(int(year), int(month), int(day))
			d2 = d1 + timedelta(days=int(request.GET['range']))
		else:
			d1 = date.today()
			d2 = d1 + timedelta(days=int(request.GET['range']))

		venues = Venue.objects.filter(opened=True)
		venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)


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
			response = Response()
			response.data = {"status": "last_page"}
			return response

		if request.user.is_authenticated():
			print "USER LOGGED IN"
			serializer = ShowListSerializer(shows, many=True)
		else:
			print "USER NOT LOGGED IN"
			serializer = ShowListSerializer(shows, many=True)

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


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_search_results(request):
	if request.method == "GET":
		query = request.GET['q']

		querySet = SearchQuerySet().filter(text=query).order_by('date')

		shows = [ Show.objects.get(id=show.pk) for show in querySet ]

		serializer = ShowListSerializer(shows, many=True)

		return Response(serializer.data)

