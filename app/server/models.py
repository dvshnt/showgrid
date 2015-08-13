import datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.contrib.localflavor.us.models import USStateField

from colorful.fields import RGBColorField

class Venue_v2(models.Model):
	name = models.CharField(max_length=200)
	address = models.ForeignKey('Address')
	image = models.ImageField (upload_to='showgrid/img/venues/')
	website = models.URLField()

	primary_color = RGBColorField()
	secondary_color = RGBColorField()
	accent_color = RGBColorField()

	# Sign-post for if venue is open or not
	opened = models.BooleanField(default=True)

	# Auto-fill URL for calendars without unique links
	autofill = models.CharField(max_length=200, blank=True)
	age = models.PositiveSmallIntegerField(default=0, blank=True)

	def __unicode__ (self):
		return self.name

	def json(self):
		return {
			'id' : self.id,
			'name' : self.name,
			'website' : self.website,
			'image' : self.image.url,
			'address' : self.address.json(),
			'primary_color':  self.primary_color,
			'secondary_color':  self.secondary_color,
			'accent_color':  self.accent_color,
		}

	@property
	def alphabetical_title(self):
		name = self.name
		starts_with_flags = ['the ', 'an ', 'a ']

		for flag in starts_with_flags:
			if name.lower().startswith(flag):
				return "%s, %s" % (name[len(flag):], name[:len(flag)-1])
		else:
			pass
		
		return self.name



class Show_v2(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	title = models.CharField(max_length=100, blank=True)
	headliners = models.CharField(_("headliners"), max_length=300, blank=True)
	openers = models.CharField(_("openers"), max_length=400, blank=True)
	website = models.CharField(max_length=200, blank=True)

	date = models.DateTimeField()

	venue = models.ForeignKey('Venue_v2')

	star = models.BooleanField(default=False)
	
	price = models.SmallIntegerField(default=-1, blank=True)
	ticket = models.URLField(blank=True)
	soldout = models.BooleanField(default=False)
	onsale = models.DateTimeField(default=datetime.datetime.now(), blank=True)

	age = models.PositiveSmallIntegerField(default=0, blank=True)


	def __unicode__ (self):
		return self.headliners

	def json_onsale(self):
		return {
			'id' : self.id,
			'title': self.title,
			'headliners': self.headliners,
			'openers': self.openers,
			'website' : self.website,
			'date' : str(self.date),
			'star' : self.star,
			'price' : self.price,
			'ticket' : self.ticket,
			'soldout' : self.soldout,
			'onsale' : str(self.onsale),
			'age' : self.age,
			'venue' : self.venue.json()
		}

	def json_min(self):
		return {
			'id' : self.id,
			'title': self.title,
			'headliners': self.headliners,
			'openers': self.openers,
			'website' : self.website,
			'date' : str(self.date),
			'star' : self.star,
			'price' : self.price,
			'ticket' : self.ticket,
			'soldout' : self.soldout,
			'onsale' : str(self.onsale),
			'age' : self.age,
			'venue' : self.venue.name
		}

	def json_max(self):
		return {
			'id' : self.id,
			'title': self.title,
			'headliners': self.headliners,
			'openers': self.openers,
			'website' : self.website,
			'date' : str(self.date),
			'star' : self.star,
			'price' : self.price,
			'ticket' : self.ticket,
			'soldout' : self.soldout,
			'onsale' : str(self.onsale),
			'age' : self.age,
			'venue' : self.venue.json()
		}


class Address(models.Model):
	street = models.CharField(_("street"), max_length=128)
	city = models.CharField(_("city"), max_length=64)
	state = models.CharField(_("state"), max_length=2)
	zip_code = models.CharField(_("zip code"), max_length=10)

	def __unicode__ (self):
		return self.street

	def json(self):
		return {
			'street' :self.street,
			'state' : self.state,
			'city' : self.city,
			'zip_code' : self.zip_code
		}
