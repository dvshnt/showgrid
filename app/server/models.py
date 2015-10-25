import datetime
import hashlib
from random import randint
import os

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from localflavor.us.models import USStateField
from django.core.validators import RegexValidator

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



from server.twillio_handle import MessageClient
import logging

Sender = MessageClient()
# from __future__ import unicode_literals
class Phone_Account(models.Model):
	phone_regex = RegexValidator(regex=r'^\d{10}$', message="phone is not 10 digits")
	verified = models.BooleanField(default=False)
	phone_number = models.CharField(validators=[phone_regex],max_length=10,blank=True) # validators should be a list
	_pin_md5  = models.TextField(blank=True)


	def generate_pin(self):
		new_pin = ''
		for x in range(0,4):
			new_pin += str(randint(0,9))


		
		self._pin_md5 = hashlib.md5(new_pin).hexdigest()
		return new_pin

	def check_pin(self,pin):
		#try_hash = str(hashlib.md5(str(pin)).hexdigest())
		try_hash = hashlib.md5(pin).hexdigest()
		if try_hash == self._pin_md5:
			self.verified = True
			return True
		else:
			return False

	def send_pin(self,pin):
		msg = 'your pin is ' + pin
		Sender.send_message(msg,self.phone_number)


class Phone_Alert(models.Model):
	phone_account = models.ForeignKey('Phone_Account')
	time = models.DateTimeField()
	show = models.ForeignKey('Show_v2')
	sent = models.PositiveSmallIntegerField(default=0)

	def check_send(self):
		if (datetime.datetime.now().time - self.time.time) < (60 * 5) and self.sent < 1:
			msg = self.show.title
			Sender.send_message(msg,self.phone_account.phone_number)
			self.sent += 1
			self.save()
			return True
		return False


