from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

import datetime

from django.db import models
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext as _
from django.db.models.signals import post_save
from django.dispatch import receiver

from colorful.fields import RGBColorField

from phonenumber_field.modelfields import PhoneNumberField

from rest_framework.authtoken.models import Token



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
	openers = models.CharField(max_length=400, blank=True)
	website = models.URLField(blank=True)

	date = models.DateTimeField(blank=False)

	venue = models.ForeignKey(Venue, related_name='shows')

	star = models.BooleanField(default=False)

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



class Alert(models.Model):
	is_active = models.BooleanField(default=True)
	show = models.ForeignKey(Show)
	date = models.DateTimeField(blank=False)

	def json(self):
		return {
			'date' : str(self.date)
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



class ShowgridUser(AbstractBaseUser):
	username = models.CharField(_('username'), max_length=30, blank=True)
	email = models.EmailField(_('email address'), unique=True)
	phone = PhoneNumberField(unique=True, blank=True)

	is_active = models.BooleanField(_('active'), default=False)
	is_admin = models.BooleanField(_('admin'), default=False)
	is_staff = models.BooleanField(_('staff'), default=False)

	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	objects = ShowgridUserManager()
	
	USERNAME_FIELD = 'email'


	# Favorites and Alerts
	alerts = models.ManyToManyField(Alert)
	favorites = models.ManyToManyField(Show, related_name='show_set', blank=True)


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