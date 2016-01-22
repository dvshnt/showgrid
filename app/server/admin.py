from models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.conf.urls import patterns, include, url
import random
from django.http import HttpResponse, HttpResponseRedirect 
from django.template.response import TemplateResponse
from threading import Thread
from itertools import chain
import requests








def extract_artists_data(queryset,update):
	shows = queryset.all()
	for show in shows:
		show.extract_artists_from_name(update)





def update_artists_data(queryset):
	artists = list(queryset)
	for artist in artists:
		artist.update_all()


def get_artists_data(queryset):
	artists = list(queryset)
	for artist in artists:
		artist.pull_all()

def extract_artists_from_shows_action_noupdate(modeladmin, request, queryset):
	queryset.update(extract_queued=True)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
	tr = Thread(target=extract_artists_data,args=(queryset,False))
	tr.start()
	return HttpResponseRedirect('/admin/server/show/extractstatus/?ids=%s' % (",".join(selected)) );
extract_artists_from_shows_action_noupdate.short_description = "Extract artists with IDs only"

def extract_artists_from_shows_action(modeladmin, request, queryset):
	queryset.update(extract_queued=True)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)	
	tr = Thread(target=extract_artists_data,args=(queryset,True))
	tr.start()
	return HttpResponseRedirect('/admin/server/show/extractstatus/?ids=%s' % (",".join(selected)) );
extract_artists_from_shows_action.short_description = "Extract artists with full data"


#only update thos
def update_artist_data_action(modeladmin, request, queryset):
	queryset.update(queued=True,pulled_spotify=False,pulled_echonest=False)
	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
	#que artist for update
	#start thread
	tr = Thread(target=update_artists_data,args=(queryset,))
	tr.start()
	return HttpResponseRedirect('/admin/server/artist/pullstatus/?ids=%s' % (",".join(selected)) );
update_artist_data_action.short_description = "Update artist data"






def pull_artist_data_action(modeladmin, request, queryset):
	queryset.update(queued=True,pulled_spotify=False,pulled_echonest=False)
	
	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
	
	#que artist for update
	
	
	#start thread
	tr = Thread(target=get_artists_data,args=(queryset,))
	tr.start()

	#redirect to update view status
	return HttpResponseRedirect('/admin/server/artist/pullstatus/?ids=%s' % (",".join(selected)) );
pull_artist_data_action.short_description = "Pull artist data"


class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers', 'venue')
	actions = [extract_artists_from_shows_action,extract_artists_from_shows_action_noupdate]
	def get_urls(self):
		urls = super(ShowAdmin, self).get_urls()
		my_urls = [
			url(r'^extractstatus/$', self.extract_view),
		]
		return my_urls + urls
	def extract_view(self, request):
		ids = request.GET['ids'].split(',')
		shows = []
		done = 0
		done_artists = total_artists = 0

		for i in ids:
			show = Show.objects.get(id=i)
			if show.extract_queued == False:
				# print show.extract_queued
				done += 1
				done_artists = total_artists = show.headliner_artists.count() + show.opener_artists.count()
			else:
				headliners = show.headliner_artists.all()
				openers = show.opener_artists.all()
				total_artists = done_artists = 0
				for a in openers:
					total_artists += 1
					if a.queued == False:
						done_artists += 1
				for a in headliners:
					total_artists += 1
					if a.queued == False:
						done_artists += 1

			shows.append({'name':show.headliners,'done_all':False if show.extract_queued else True,'artist_count':str(done_artists)+'/'+str(total_artists)})

		context = dict(
			self.admin_site.each_context(request),
			done = True if len(shows) <= done else False,
			count = str(done)+'/'+str(len(shows)),
			shows = shows
		)

		return TemplateResponse(request, "admin/show_extract_status.html", context)

class BioAdmin(admin.ModelAdmin):
	list_display = ['url', 'source']
	search_fields = ['source']

class ArticleAdmin(admin.ModelAdmin):
	list_display = ['title', 'external_url']
	search_fields = ['title']

class ArtistAdmin(admin.ModelAdmin):
	list_display = ['name','queued','pulled','pulled_date']
	ordering = ['name','pulled_date','pulled','queued']
	fields = ('name','facebook_url','twitter_url','articles','tracks','bios')
	actions = [pull_artist_data_action,update_artist_data_action]

	def get_urls(self):
		urls = super(ArtistAdmin, self).get_urls()
		my_urls = [
			url(r'^pullstatus/$', self.status_view),
		]
		return my_urls + urls

	def status_done_view(self, request):
		ids = request.GET['ids'].split(',')

	def status_view(self, request):
		ids = request.GET['ids'].split(',')
		artists = []
		done = 0

		for i in ids:
			artist = Artist.objects.get(id=i)
			if artist.queued == False:
				done += 1
			artists.append({'id':i,'name':artist.name,'done_all':False if artist.queued else True,'done_spotify':artist.pulled_spotify,'done_echonest':artist.pulled_echonest})

		context = dict(
			self.admin_site.each_context(request),
			done = True if len(artists) <= done else False,
			count = str(done)+'/'+str(len(artists)),
			artists = artists
		)

		return TemplateResponse(request, "admin/artist_pull_status.html", context)


admin.site.register(Address)
admin.site.register(Venue)
admin.site.register(ShowgridUser)
admin.site.register(Alert)
admin.site.register(Show, ShowAdmin)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Biography,BioAdmin)
admin.site.register(Track)
admin.site.register(Genre)
admin.site.register(Image)
