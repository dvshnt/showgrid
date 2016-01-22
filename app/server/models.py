from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from os import path
import datetime
import hashlib
from random import randint
from django.conf import settings
import os
import math
import pytz
import requests
import urllib
import re
import json

from jsonfield import JSONField

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



#pretty colors 
def prRed(prt): print("\033[91m {}\033[00m" .format(prt))
def prGreen(prt): print("\033[92m {}\033[00m" .format(prt))
def prYellow(prt): print("\033[93m {}\033[00m" .format(prt))
def prLightPurple(prt): print("\033[94m {}\033[00m" .format(prt))
def prPurple(prt): print("\033[95m {}\033[00m" .format(prt))
def prCyan(prt): print("\033[96m {}\033[00m" .format(prt))
def prLightGray(prt): print("\033[97m {}\033[00m" .format(prt))
def prBlack(prt): print("\033[98m {}\033[00m" .format(prt))







#Analyze spotify data and sync it with passed artist.
def SpotifyArtistParser(artist,data):
	
	# 1000x1000 images
	if 'images' in data:
		for img in data['images']:
			try:
				artist.images.get(url=img['url'])
			except:
				try:
					image = Image.objects.get(url=img['url'])
					artist.images.add(image)
				except:
					new_image = Image.objects.create(url=img['url'])
					new_image.save()
					artist.images.add(new_image)

	if 'external_urls' in data and 'spotify' in data['external_urls']:
		artist.spotify_link = data['external_urls']['spotify']

	#follow count??
	if 'followers' in data and 'total' in data['followers']:
		artist.spotify_followers = data['followers']['total']


	#genres
	if 'genre' in data:				
		for g in data['genres']:
			try:
				artist.genres.get(name=g)
			except:
				try:
					genre = Genre.objects.get(name=g)
					artist.genres.add(genre)
				except:
					new_genre = Genre.objects.create(name=g)
					new_genre.save()
					artist.genres.add(new_genre)






MAX_BIO = 3

#Analyze echonest data and sync it with passed artist.
def EchonestArtistParser(artist,data):
	a_json = t_list = None


	if 'artist' in data['response']:
		a_json = data['response']['artist']
	
	if 'songs' in data['response']:
		t_list = data['response']['songs']

	

	if a_json != None:
		#genres
	
		if 'genres' in a_json:
			for g in a_json['genres']:
				try:
					artist.genres.get(name=g['name'])
				except:
					try:
						genre = Genre.objects.get(name=g['name'])
						artist.genres.add(genre)
					except:
						new_genre = Genre.objects.create(name=g['name'])
						new_genre.save()
						artist.genres.add(new_genre)

		#biography
		bio_count = 0
		if 'biographies' in a_json:
			for b in a_json['biographies']:
				bio_count += 1
				if bio_count > MAX_BIO:
					break
				try:
					artist.bios.get(url=b['url'])
				except:
					try:
						bio = Biography.objects.get(url=b['url'])
						artist.bios.add(bio)
					except:
						new_bio = Biography.objects.create(url=b['url'],text=b['text'],source=b['site'],a_name=artist.name)
						new_bio.save()
						artist.bios.add(new_bio)
				
			

		#articles
		blogs =  a_json['blogs'] + a_json['news']
		
		for blog in blogs:
			try:
				artist.articles.get(external_url=blog['url'])
			except:
				new_title = blog['name']
				new_summary = blog['summary']
				new_external_url = blog['url']
				new_article = Article.objects.create(summary=new_summary,title=new_title,external_url=new_external_url)
				new_article.save()
				artist.articles.add(new_article)				


		#images
		for i in a_json['images']:
			try:
				artist.images.get(url=i['url'])
			except:
				try:
					image = Image.objects.get(url=i['url'])
					artist.images.add(image)
				except:
					new_image = Image.objects.create(url=i['url'])
					new_image.save()
					artist.images.add(new_image)

		artist.popularity = a_json['hotttnesss']
	
	#tracks
	if t_list != None and len(t_list) > 0:

		for t in t_list:
			try:
				artist.tracks.get(url=t['foreign_id'])
			except:
				try:
					track = Track.objects.get(url=t['foreign_id'])
					artist.tracks.add(track)
				except:
					new_track = Track.objects.create(url=t['foreign_id'],source=t['catalog'],name=t['name'])
					new_track.save()
					artist.tracks.add(new_track)

class Biography(models.Model):
	def __unicode__ (self):
		return self.a_name
	a_name =  models.CharField(max_length=255,blank=False)
	text = models.TextField(default="No description",blank=False)
	source = models.CharField(max_length=255,blank=True)
	url = models.CharField(max_length=255,blank=True)

class Genre(models.Model):
	def __unicode__ (self):
		return self.name
	name = models.CharField(max_length=255,blank=False)

class Track(models.Model):
	def __unicode__ (self):
		return self.name
	name = models.CharField(max_length=255,blank=False)
	url = models.CharField(max_length=255,blank=False)
	source = models.CharField(max_length=255,blank=True)

class Image(models.Model):
	def __unicode__ (self):
		if self.path != None and self.path != "":
			return self.path
		else:
			return self.url	
	url = models.CharField(max_length=255,blank=False)
	path = models.CharField(max_length=255,blank=True)

class Article(models.Model):
	def __unicode__ (self):
		return self.title
	title = models.CharField(max_length=255,blank=False)
	external_url = models.CharField( max_length=255,blank=True)
	summary = models.TextField(default="No description")
	published_date = models.DateTimeField(default=timezone.now)
	active =  models.BooleanField(default=True)


class Artist(models.Model):
	def __unicode__ (self):
		return self.name
	name = models.CharField(_("name"), max_length=128)
	


	#pull meta data
	pulled = models.BooleanField(default=False)
	queued = models.BooleanField(default=False)
	pulled_date = models.DateTimeField(default=datetime.date(1999, 12, 5))
	pulled_spotify = models.BooleanField(default=False)
	pulled_echonest =  models.BooleanField(default=False)



	# if we have id's we can update by id
	echonest_id = models.CharField(_("echonest_id"), max_length=255,blank=True)
	spotify_id = models.CharField(_("spotify_id"), max_length=255,blank=True)
	

	#extra links?
	twitter_url =  models.CharField(max_length=255,blank=True)
	facebook_url =  models.CharField(max_length=255,blank=True)

	#pulled data
	bios = models.ManyToManyField(Biography,related_name='artist',blank=True)
	articles = models.ManyToManyField(Article,related_name='artist',blank=True)
	popularity = models.PositiveSmallIntegerField(default=0, blank=True)
	
	genres = models.ManyToManyField(Genre,related_name='artist',blank=True)
	tracks = models.ManyToManyField(Track,related_name='artist',blank=True)
	images = models.ManyToManyField(Image,related_name='artist',blank=True)

	spotify_link = models.CharField(max_length=255,blank=True)


	#search echonest for artist.
	def pull_echonest(self):
		payload = {'api_key': settings.ECHONEST_KEY, 'format':'json', 'results':1, 'name':re.sub(' +',' ',self.name)}
		r = requests.get(path.join(settings.ECHONEST_API,'artist/search'),params=payload)
		data = r.json()

		# print r.url
		# print data

		if data['response'] and data['response']['status']['code'] != 0 or len(data['response']['artists']) == 0 :
			return
		self.echonest_id = data['response']['artists'][0]['id']
		self.save()
		self.update_echonest()



	#already have id, update artist with already existing id.
	def update_echonest(self):
		prGreen("UPDATE ECHONEST "+self.name)
		if self.echonest_id == None: 
			return


		#artist data
		payload = {'api_key': settings.ECHONEST_KEY, 'format': 'json', 'id': self.echonest_id,'bucket':['id:spotify','biographies','hotttnesss','images','blogs','news','songs','genre']}			
		r = requests.get(path.join(settings.ECHONEST_API,'artist/profile/'),params=payload)
		prLightPurple(r.url)
		data = r.json();

		#artist track data
		payload_tracks = {'api_key': settings.ECHONEST_KEY, 'format': 'json', 'artist': self.name,'bucket' : ['id:spotify','tracks'],'limit':'true'}
		r_tracks = requests.get(path.join(settings.ECHONEST_API,'song/search'),params=payload_tracks)
		prPurple(r_tracks.url)
		data_tracks = r_tracks.json();

		if not 'response' in data and not 'response' in data_tracks:
			return False

		#combine tracks response data with artist response data
		if 'response' in data and 'response' in data_tracks and 'songs' in data_tracks['response']:
			data['response']['songs'] = []
			for song in data_tracks['response']['songs']:
				if len(song['tracks']):
					song['tracks'][0]['name'] = song['title']
					data['response']['songs'].append(song['tracks'][0])
		elif 'response' in data_tracks and 'songs' in data_tracks['response']:
			data['response'] = {'songs':[]}
			if len(song['tracks']):
				song['tracks'][0]['name'] = song['title']
				data['response']['songs'].append(song['tracks'][0])
		


		artist = None

		if 'artist' in data['response']:
			artist = data['response']['artist']


		#spotify id
		if self.spotify_id == None or self.spotify_id == "":
			if 'foreign_ids' in artist:
				for source in artist['foreign_ids']:
					if source['catalog'] == 'spotify':
						r_match = re.match('spotify:artist:(.+)',source['foreign_id'])
						if r_match != None:
							self.spotify_id = r_match.group(1)
				


		EchonestArtistParser(self,data)
		self.pulled_echonest = True

		prGreen('saving echonest: '+self.name)
		self.save()


	#already have spotify id update artist with already existing id
	def update_spotify(self):
		#we dont have the id?
		if self.spotify_id == None: 
			return
		
		#pull
		r = requests.get(path.join(settings.SPOTIFY_API,'artists',self.spotify_id))
		prCyan(r.url)
		data = r.json();

		if data != None and 'id' in data:
			SpotifyArtistParser(self,data)
			self.pulled_spotify = True
			prGreen('saving spotify: '+self.name)
			self.save()


	def pull_all(self):
		#cant pull if already pulling
		# if self.queued == True:
		# 	return False

		#reset meta
		self.queued=True
		self.pulled_spotify=False
		self.pulled_echonest=False
		self.save()

		#search/update endpoints
		self.pull_echonest()
		if self.spotify_id != None:
			self.update_spotify()
		
		#done
		self.pulled = True
		self.pulled_date = timezone.now()
		self.queued = False
		self.save()
		prGreen('SAVE')





	def update_all(self):
		#cant update if already updaing
		# if self.queued == True:
		# 	return False

		#reset meta
		self.queued=True
		self.pulled_spotify=False
		self.pulled_echonest=False
		self.save()

		#update endpoints
		self.update_echonest()
		self.update_spotify()
		
		#done
		self.pulled = True
		self.pulled_date = timezone.now()
		self.queued = False
		self.save()
		















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

	#extract meta_data
	

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
	headliner_artists = models.ManyToManyField(Artist,related_name='shows_headliner',blank=True)

	openers = models.CharField(max_length=400, blank=True)
	opener_artists = models.ManyToManyField(Artist,related_name='shows_opener',blank=True)
	
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
	onsale = models.DateTimeField(default=timezone.now, blank=True)

	age = models.PositiveSmallIntegerField(default=0, blank=True)

	#extract metadata
	extract_queued = models.BooleanField(default=False)

	def extract_artists_from_name(self,update):
		self.extract_queued = True
		self.save()

		artists = []

		#headliner request
		payload = {'api_key': settings.ECHONEST_KEY, 'format':'json', 'results':10, 'text':re.sub(' +',' ',self.headliners)}
		r = requests.get(path.join(settings.ECHONEST_API,'artist/extract'),params=payload)
		h_data = r.json()

		#opener request
		payload = {'api_key': settings.ECHONEST_KEY, 'format':'json', 'results':10, 'text':re.sub(' +',' ',self.openers)}
		r = requests.get(path.join(settings.ECHONEST_API,'artist/extract'),params=payload)
		o_data = r.json()

	

		if 'response' in h_data and 'status' in h_data['response'] and h_data['response']['status']['code'] != 0:
			prRed(h_data)
		if 'response' in h_data and 'status' in o_data['response'] and o_data['response']['status']['code'] != 0:
			prRed(o_data)


		#extract headliners
		if 'response' in h_data and 'artists' in h_data['response']:
			for artist in h_data['response']['artists']:

				#if we already have an artist like that.
				try:
					self.headliner_artists.get(echonest_id=artist['id'])
				except:
					#is the artist in the database?
					try:
						found_artist = Artist.objects.get(echonest_id=artist['id'])
						self.headliner_artists.add(found_artist)
					#create new artist and sync later
					except:
						new_artist = Artist.objects.create(name=artist['name'],echonest_id=artist['id'])
						if update == True:
							new_artist.queued=True
						new_artist.save()
						self.headliner_artists.add(new_artist)
						artists.append(new_artist)
						self.save()
						

		#extract openers (same as above)
		if 'response' in o_data and 'artists' in o_data['response']:
			for artist in o_data['response']['artists']:
				try:
					self.opener_artists.get(echonest_id=artist['id'])
				except:
					try:
						found_artist = Artist.objects.get(echonest_id=artist['id'])
						self.opener_artists.add(found_artist)
					except:
						new_artist = Artist.objects.create(name=artist['name'],echonest_id=artist['id'],queued=True)
						new_artist.save()
						self.opener_artists.add(new_artist)
						artists.append(new_artist)
						self.save()

		if update == True:
			for a in artists:
				a.update_all()


		self.extract_queued = False
		self.save()

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
		now = timezone.now()

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















