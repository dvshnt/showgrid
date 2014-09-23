from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.contrib.localflavor.us.models import USStateField

class Venue(models.Model):
	name = models.CharField(max_length=200)
	address = models.ForeignKey('Address')
	website = models.CharField(max_length=200)
	image = models.ImageField (upload_to='img/venues/')

	def __unicode__ (self):
		return self.name

	def json(self):
		return {
			'id' : self.id,
			'name' : self.name,
			'website' : self.website,
			'image' : self.image.url,
			'address' : self.address.json()
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


class Show(models.Model):
	# Validate that at least band or band_name is filled out
	band = models.ManyToManyField('Band', blank=True)
	band_name = models.CharField(_("band"), max_length=300, blank=True)
	website = models.CharField(max_length=200, blank=True)
	date = models.DateTimeField()
	venue = models.ForeignKey('Venue')

	def __unicode__ (self):
		return self.band_name

	def json_min(self):
		return {
			'id' : self.id,
			'band_name': self.band_name,
			'date' : str(self.date),
			'website' : self.website
		}

	def json_max(self):
		return {
			'id' : self.id,
			'band_name': self.band_name,
			'date' : str(self.date),
			'website' : self.website,
			'venue' : self.venue.json()
		}

class Band(models.Model):
	name = models.CharField(_("band"), max_length=300)
	website = models.CharField(max_length=200, blank=True)

class List(models.Model):
	user = models.ForeignKey(User)
	shows = models.ManyToManyField('Show')