from server.models import *

from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from datetime import timedelta, date, datetime

from django.utils import timezone


class ShowgridUserSerializer(UserDetailsSerializer):
	profile = serializers.SerializerMethodField('get_user_profile')
	favorites = serializers.SerializerMethodField('get_user_favorites')
	alerts = serializers.SerializerMethodField('get_user_alerts')

	class Meta:
		model = ShowgridUser
		fields = ['id', 'profile', 'favorites', 'alerts']


	def update(self, instance, validated_data):
		profile_data = validated_data.pop('showgriduser', {})
		phone = profile_data.get('phone')

		instance = super(ShowgridUserSerializer, self).update(instance, validated_data)

		# get and update user profile
		profile = instance.userprofile
		if profile_data and phone:
			profile.phone = company_name
			profile.save()
		return instance

	def get_user_profile(self, obj):
		return {
			'email': obj.username,
			'phone': str(obj.phone)
		}

	def get_user_favorites(self, obj):
		favorites = []
		for show in obj.favorites.all():
			if show.date > timezone.now():
				favorites.append(show)

		shows = ShowListSerializer(favorites, many=True)
		return shows.data

	def get_user_alerts(self, obj):
		alerts = Alert.objects.filter(user=obj)
		alerts = alerts.filter(show__date__gte=date.today())
		alerts = alerts.filter(sent=0)
		alerts = alerts.order_by('show__date')
		serialzier = AlertPanelSerializer(alerts, many=True)
		return serialzier.data



class AlertPanelSerializer(serializers.ModelSerializer):
	show = serializers.SerializerMethodField('get_alert_show')

	def get_alert_show(self, obj):
		serializer = ShowListSerializer(obj.show)
		return serializer.data

	class Meta:
		model = Alert
		fields = (
			'id', 'date', 'sent', 'user', 'show', 'which'
		)


class ShowListSerializer(serializers.ModelSerializer):
	venue = serializers.SerializerMethodField('get_shows_venue')
	review = serializers.SerializerMethodField('get_shows_review')

	def get_shows_venue(self, obj):
		serializer = VenueListSerializer(obj.venue)
		return serializer.data

	def get_shows_review(self, obj):
		if obj.review:
			return obj.review.read().decode('utf-8')
		return ""

	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'star', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'age', 'venue'
		)


class VenueListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'name', 'primary_color', 'secondary_color', 'accent_color'
		)


class AlertSerializer(serializers.ModelSerializer):
	class Meta:
		model = Alert
		fields = (
			'id', 'date', 'sent', 'user', 'show'
		)




class ShowSerializer(serializers.ModelSerializer):
	# venue = serializers.SerializerMethodField('get_show_venue')

	# def get_show_venue(self, obj):
	# 	data = Venue.objects.get(id=obj.venue.id)
	# 	serializer = VenueSerializer(data)
	# 	return serializer.data

	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'star', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'age' #, 'venue'
		)



class VenueSerializer(serializers.ModelSerializer):
	shows = serializers.SerializerMethodField('get_shows_in_range')
	address = serializers.SerializerMethodField('get_venue_address')

	def get_shows_in_range(self, obj):
		start = self.context.get("start").strftime("%Y-%m-%d")
		end = self.context.get("end").strftime("%Y-%m-%d")

		if start is not None and end is not None:
			data = Show.objects.filter(venue=obj.id)
			data = data.filter(date__range=[ start, end ])
			data = data.order_by('date')
			
			serializer = ShowSerializer(data, many=True)

			return serializer.data
		
		else:
			print "Error stuff"


	def get_venue_address(self, obj):
		return {
			'street': obj.address.street,
			'state': obj.address.state,
			'city': obj.address.city,
			'zip_code': obj.address.zip_code
		}


	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'id', 'name', 'image', 'website', 'address',
			'primary_color', 'secondary_color', 'accent_color', 
			'opened', 'autofill', 'age', 'shows'
		)