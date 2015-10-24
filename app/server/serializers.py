from server.models import *

from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer



class ShowgridUserSerializer(UserDetailsSerializer):

    class Meta:
    	model = ShowgridUser
        fields = ['email', 'phone']


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



class ShowListSerializer(serializers.ModelSerializer):
	favorited = serializers.SerializerMethodField('mark_show_as_favorite')
	venue = serializers.SerializerMethodField('get_shows_venue')
	review = serializers.SerializerMethodField('get_shows_review')

	def mark_show_as_favorite(self, obj):
		if self.context.get("user"):
			user = self.context.get("user")
			if obj in user.favorites.all():
				return True
		return False 

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
			'onsale', 'age', 'venue', 'favorited'
		)


class VenueListSerializer(serializers.ModelSerializer):
	class Meta:
		model = Venue
		# ADD BACK ADDRESS INFO LATER
		fields = (
			'name', 'primary_color', 'secondary_color', 'accent_color'
		)


class ShowSerializer(serializers.ModelSerializer):
	favorited = serializers.SerializerMethodField('mark_show_as_favorite')
	alert = serializers.SerializerMethodField('mark_show_alert')

	def mark_show_as_favorite(self, obj):
		if self.context.get("user"):
			user = self.context.get("user")
			if obj in user.favorites.all():
				return True
		return False

	def mark_show_alert(self, obj):
		if self.context.get("user"):
			user = self.context.get("user")
			for alert in user.alerts.all():
				if alert.show.headliners == obj.headliners:
					return alert.json()
		return False


	class Meta:
		model = Show
		# ADD BACK CANCELLED
		fields = (
			'id', 'created_at', 'title', 'headliners', 'openers', 'website', 
			'star', 'review', 'date', 'ticket', 'price', 'soldout', 
			'onsale', 'age', 'favorited', 'alert'
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
			
			if self.context.get("user"):
				serializer = ShowSerializer(data, many=True, context={ 'user': self.context.get("user") })
			else:
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