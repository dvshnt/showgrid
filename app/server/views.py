VERSION = 'v1'

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

from django.utils import dateparse

from django.http import HttpResponse
from django.http import HttpResponseServerError

from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist

from haystack.query import SearchQuerySet

#may want to move these to settings.py (b/c thats where the other auth settings are located)
# from django.http import JsonResponse


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


def version(request):
	return HttpResponse(VERSION)


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

		# Update users profile
		if action == 'profile':
			body = json.loads(request.body.decode('utf-8'))

			# Change email
			if(body['email'] != "None" and body['email'] != "" and body['email'] != None ):
				user.email = body['email']
				user.username = body['email']

			# Change name
			if(body['name'] != "None" and body['name'] != "" and body['name'] != None):
				user.name = body['name']

			# Change password
			if(body['pass'] != "None" and body['pass'] != "" and body['pass'] != None):
				user.set_password(body['pass'])

			user.save()
			serializer = ShowgridUserSerializer(user)
			return Response(serializer.data)


		# Edit alert
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
				user.phone = None
				if(phone == user.phone):
					return Response({'status':'phone_same','phone':user.phone})
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
			sale = ( body['sale'] or False )
			show_id = show
			show = self.get_show(int(show))

			if show == None:
				return  Response({ 'status': 'no such show' })

			user_show_alerts = Alert.objects.filter(user=user,show=show,sale=sale)

			if user_show_alerts:
				return  Response({ 'status': 'alert_already_set' })
			else:
				if date == None:
					return  Response({ 'status': 'bad date' })
				
				date = dateutil.parser.parse(date)

				alert = Alert(is_active=True, show=show, date=date,user=user,which=which,sale=sale)
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

	def get(self, request, id=None):

		start = request.GET.get('start', None)
		end = request.GET.get('end', None)


		if start != None:
			start = start.split("-")
			d1 = date(int(start[0]), int(start[1]), int(start[2]))
		else:
			d1 = date.today()
		if end != None:
			end = end.split("-")
			d2 = date(int(end[0]), int(end[1]), int(end[2]))
		else:
			d2 = date.today() + timedelta(days=365)

		if id == None:
			orderby = request.GET.get('orderby', 'alpha')
			opened = request.GET.get('opened', False)
			if opened:
				venues = Venue.objects.filter(opened=opened)
			else:
				venues = Venue.objects.all()


			if orderby == 'alpha':
				venues = sorted(venues, key=attrgetter('alphabetical_title'), reverse=False)


			serializer = VenueSerializer(venues, many=True, context={ 'start': d1, 'end': d2 })
			return Response(serializer.data)


		try:
			venue = Venue.objects.get(id=id)
		except ObjectDoesNotExist:
			return  Response({ 'status': 'bad_query' })

		serializer = VenueSerializer(venue,context={ 'start': d1, 'end': d2 })
		return Response(serializer.data)


class ShowList(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticatedOrReadOnly,)

	def get(self, request, id=None):
		if id == None:
			query = request.GET.get('q', None)
			featured = request.GET.get('featured', None)
			orderby = request.GET.get('orderby', 'date').split(",")
			soldout = request.GET.get('soldout', None)
			onsale = request.GET.get('onsale', None)
			start = request.GET.get('start', None)
			end = request.GET.get('end', None)


			# Search has a different branch as it utilizes Haystack
			if query != None:
				querySet = SearchQuerySet().filter(text=query).order_by('date')
				shows = [ Show.objects.get(id=show.pk) for show in querySet ]
				serializer = ShowListSerializer(shows, many=True)
				return Response(serializer.data)



			if start != None and end != None:
				d1 = dateparse.parse_datetime(start)
				d2 = dateparse.parse_datetime(end)

				#d3 = d2 + timedelta(hours=11.99)
				#print d1.date(), d2.date()
				shows = Show.objects.filter(date__range=[d1.date(), d2.date()])
			else:
				shows = Show.objects.filter(date__gte=date.today())


			if featured != None:
				shows = shows.filter(star=featured)

			if soldout != None:
				shows = shows.filter(soldout=soldout)

			if onsale != None:
				shows = shows.filter(onsale__gte=date.today())

			# ORDER BY
			shows = shows.order_by(*orderby)


			paginator = Paginator(shows, 100)

			page = request.GET.get('page', 1)
			try:
				shows = paginator.page(page)
			except PageNotAnInteger:
				shows = paginator.page(1)
			except EmptyPage:
				response = Response()
				response.data = {"status": "last_page"}
				return response

			if request.user.is_authenticated():
				serializer = ShowListSerializer(shows, many=True)
			else:
				serializer = ShowListSerializer(shows, many=True)

			return Response(serializer.data)



		try:
			show = Show.objects.get(id=id)
		except ObjectDoesNotExist:
			return  Response({ 'status': 'bad_query' })

		serializer = ShowListSerializer(show)
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






class Issues(APIView):
	def get(self, request, index=None):
		if index == None:
			print "NO ID"
		else:
			issue = Issue.filter(index=index)
			if issue == None or issue.html == None:
				return HttpResponseNotFound("<h3>this issue does not exist!</h3>")
			else:
				return HttpResponse(issue.html)

