import inspect, itertools, json
from datetime import timedelta, date, datetime

import json
import collections

import datetime as datetime_2

from operator import attrgetter

from django.views.decorators.csrf import csrf_exempt

from pytz import timezone

from server.models import *

from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist

from haystack.query import SearchQuerySet

from rest_framework import permissions, status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from server.models import *
from server.serializers import *


def index(request, year=None, month=None, day=None):
	return render(request, "index.html")



class UserProfile(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get(self, request):
		return Response({'status' : 'success'})


class UserActions(APIView):
	authentication_class = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get_show(self, pk):
		try:
			return Show.objects.get(id=pk)
		except ObjectDoesNotExist:
			return None

	def post(self, request, action=None):
		if action == 'favorite':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']

			show = self.get_show(int(show))
			if show != None:
				user = request.user

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

		if action == 'alert':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']
			date = body['date']

			show = self.get_show(int(show))
			if show != None:
				import dateutil.parser
				date = dateutil.parser.parse(date)

				alert = Alert(is_active=True, show=show, date=date)
				alert.save()
				
				user = request.user
				user.alerts.add(alert)
				user.save()

			return Response({ 'status': 'active' })

	def delete(self, request, action=None):
		if action == 'favorite':
			return Response({ 'status': '' })

		if action == 'alert':
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			show = body['show']

			show = self.get_show(int(show))
			if show != None:
				user = request.user
				for alert in user.alerts.all():
					if alert.show == show:
						user.alerts.remove(alert)

			return Response({ 'status': 'success' })
	



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

