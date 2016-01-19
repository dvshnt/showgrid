from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

import datetime
import hashlib
from random import randint
from django.conf import settings
import os
import math
import pytz

from django.db import models
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext as _
from localflavor.us.models import USStateField
from django.core.validators import RegexValidator

from colorful.fields import RGBColorField
from django.db.models.signals import post_save
from django.dispatch import receiver

from colorful.fields import RGBColorField


from rest_framework.authtoken.models import Token

from server.twillio_handle import MessageClient
Sender = MessageClient()
from termcolor import colored


# class Performance(models.Model):
# 	position = models.CharField(_("position"), max_length=128)
# 	show = 





import server.get_spotify
import server.get_echonest

class Artist(models.Model):
	name = models.CharField(_("name"), max_length=128)
	about = models.CharField(_("about"), max_length=128)
	
	pulled = models.BooleanField(default=False)
	queued = models.BooleanField(default=False)

	pulled_date = models.DateTimeField(default=datetime.date(1999, 12, 5))
	pulled_spotify =  models.BooleanField(default=False)
	pulled_echonest =  models.BooleanField(default=False)

	def pull_echonest(self):
		pass

	def pull_spotify(self):
		pass







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



class Venue(models.Model):
	name = models.CharField(max_length=200)
	address = models.ForeignKey(Address)
	image = models.ImageField (upload_to='showgrid/img/venues/')
	website = models.URLField()
	description = models.TextField(default="This is a description")
	twitter_url = models.CharField(max_length=200, default=None)
	facebook_url = models.CharField(max_length=200, default=None)
	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
	phone = models.CharField(validators=[phone_regex], blank=True, null=True,max_length=255) # validators should be a list

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

	def json(self):
		return {
			'description': self.description,
			'twitter': self.twitter_url,
			'facebook': self.facebook_url,
			'id' : self.id,
			'name' : self.name,
			'website' : self.website,
			'image' : self.image.url,
			'address' : self.address.json(),
			'primary_color':  self.primary_color,
			'secondary_color':  self.secondary_color,
			'accent_color':  self.accent_color,
		}



class Show(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	title = models.CharField(max_length=100, blank=True)
	headliners = models.CharField(max_length=300, blank=False)
	headliner_artists = models.ManyToManyField(Artist,related_name='shows_headliner')
	openers = models.CharField(max_length=400, blank=True)
	opener_artists = models.ManyToManyField(Artist,related_name='shows_opener')
	website = models.URLField(blank=True)

	date = models.DateTimeField(blank=False)

	venue = models.ForeignKey(Venue, related_name='shows')

	star = models.BooleanField(default=False)

	banner = models.ImageField(upload_to='showgrid/banners/', default='', blank=True)
	review = models.FileField(upload_to='showgrid/reviews/', default='', blank=True)
	
	price = models.SmallIntegerField(default=-1, blank=True)
	ticket = models.URLField(blank=True)

	# cancelled = models.BooleanField(default=False)
	soldout = models.BooleanField(default=False)
	onsale = models.DateTimeField(default=datetime.datetime.now(), blank=True)

	age = models.PositiveSmallIntegerField(default=0, blank=True)


	def __unicode__ (self):
		return self.headliners

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


class ShowgridUserManager(BaseUserManager):

	def _create_user(self, email, password, is_active, is_staff, is_superuser, **extra_fields):
		"""
		Creates and saves a User with the given email and password.
		"""
		now = datetime.datetime.now()

		if not email:
			raise ValueError('The given email must be set')

		email = ShowgridUserManager.normalize_email(email)
		user = self.model(email=email, username=email, is_active=is_active,
						is_superuser=is_superuser, is_staff=is_staff, 
						last_login=now, date_joined=now, **extra_fields)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, email, password=None, **extra_fields):
		return self._create_user(email, password, False, False, False, **extra_fields)

	def create_superuser(self, email, password, **extra_fields):
		return self._create_user(email, password, True, True, True, **extra_fields)


from django.core.validators import RegexValidator


class ShowgridUser(AbstractBaseUser):
	name = models.CharField(max_length=30,blank=True)
	username = models.CharField(_('username'), max_length=30, blank=True)
	email = models.EmailField(_('email address'), unique=True)
	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
	phone = models.CharField(unique=True,validators=[phone_regex], blank=True, null=True,max_length=255) # validators should be a list
	phone_verified = models.BooleanField(default=False,blank=False)
	pin_hash  = models.TextField(blank=True)
	pin_sent =  models.BooleanField(default=False,blank=False)
	
	is_active = models.BooleanField(_('active'), default=False)
	is_admin = models.BooleanField(_('admin'), default=False)
	is_staff = models.BooleanField(_('staff'), default=False)

	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	objects = ShowgridUserManager()
	
	USERNAME_FIELD = 'email'


	# Favorites
	favorites = models.ManyToManyField(Show, related_name='show_set', blank=True)



	def generate_pin(self):
		new_pin = ''
		for x in range(0,4):
			new_pin += str(randint(0,9))

		self.pin_hash = hashlib.md5(new_pin).hexdigest()
		return new_pin

	def check_pin(self,pin):
		#try_hash = str(hashlib.md5(str(pin)).hexdigest())
		try_hash = hashlib.md5(pin).hexdigest()
		if try_hash == self.pin_hash:
			self.phone_verified = True
			return True
		else:
			return False

	def send_pin(self,pin):
		msg = 'Your pin is ' + pin
		Sender.send_message(msg,self.phone)



	class Meta:
		verbose_name = _('user')
		verbose_name_plural = _('users')

	def get_absolute_url(self):
		return "/user/%s/" % urlquote(self.pk)

	def get_full_name(self):
		"""
		Returns the first_name plus the last_name, with a space in between.
		"""
		return self.email

	def get_short_name(self):
		"Returns the short name for the user."
		return self.email
	
	@property
	def is_superuser(self):
		return self.is_admin

	@property
	def is_staff(self):
		return self.is_admin

	def has_perm(self, perm, obj=None):
		return self.is_admin

	def has_module_perms(self, app_label):
		return self.is_admin


@receiver(post_save, sender=ShowgridUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)



DEFAULT_USER_ID = 1 #for migration 
DEFAULT_SHOW_ID = 1 #for migration
alert_leeway = 30 # if alert time distance :30 seconds away from time of check

class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,default=DEFAULT_USER_ID,related_name='alerts')
	date = models.DateTimeField(blank=False)
	show = models.ForeignKey('Show',default=DEFAULT_SHOW_ID,related_name='alerts')
	sent = models.PositiveSmallIntegerField(default=0)
	which = models.PositiveSmallIntegerField(default=0)
	sale = models.BooleanField(default=False)

	def check_send(self):

		def get_show_time_from_now(which, date):
			if which == 0: return "right now"
			if which == 1: return "in 30 minutes"
			if which == 2: return "in an hour"
			if which == 3: return "in 2 hours"
			if which == 4: return "tomorrow"
			if which == 5: return "in 2 days"
			if which == 6: return "in a week"

			return date.strftime('%a, %b %d at %I:%M %p')

		def construct_sale_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Tickets for %s at %s are on sale %s! %s" % (headliner, venue, when, ticket)

			return msg			

		def construct_text_message(alert):
			show = Show.objects.get(id=alert.show.id)
			venue = Venue.objects.get(id=show.venue.id)

			headliner = show.headliners
			venue = venue.name

			if show.ticket:
				ticket = "Get your tickets here: %s" % show.ticket
			else:
				ticket = ""

			when = get_show_time_from_now(alert.which, show.date)

			msg = "Showgrid here reminding you that %s plays at %s %s.\n\n %s" % (headliner, venue, when, ticket,)

			return msg

		now_time = timezone.now()
		alert_time = self.date

		time_diff = alert_time - now_time

		if time_diff.total_seconds() < alert_leeway and self.sent < 1:

			if self.sale:
				msg = construct_sale_message(self)
			else:
				msg = construct_text_message(self)
			print colored('sending alert to '+self.user.phone+' ( is sale ? : ' + str(self.sale) + ' ) ', 'green')
			Sender.send_message(msg,self.user.phone)
			self.sent += 1
			self.save()
			return True
		return False















