from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.contrib.localflavor.us.models import USStateField

class Venue(models.Model):
	name = models.CharField(max_length=200)
	address = models.ForeignKey('Address')
	website = models.CharField(max_length=200)
	image = models.ImageField (upload_to='/static/showgrid/img/venues/')

	autofill_calendar_url = models.CharField(max_length=200, blank=True)


	@property
	def alphabetical_title(self):
		"""
		Returns an alphabetical-friendly string of a title attribute.
		"""
		name = self.name

		# A list of flags to check each `title` against.
		starts_with_flags = [
			'the ',
			'an ',
			'a '
		]

		# Check each flag to see if the title starts with one of it's contents.
		for flag in starts_with_flags:
			if name.lower().startswith(flag):
				# If the title does indeed start with a flag, return the title with
				# the flag appended to the end preceded by a comma.
				return "%s, %s" % (name[len(flag):], name[:len(flag)-1])
		else:
			pass
		
		# If the property did not return as a result of the previous for loop then just
		# return the title.
		return self.name


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
	band_name = models.CharField(_("band"), max_length=300)
	other_info = models.CharField(_("other"), max_length=400, blank=True)
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
