from models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.conf.urls import patterns, include, url
import random
class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers', 'venue')


from django.http import HttpResponse, HttpResponseRedirect 
from django.template.response import TemplateResponse

from threading import Thread









def get_artists_data(queryset):

	artists = list(queryset)

	for artist in artists:
		artist.pull_spotify()
		artist.pull_echonest()





def pull_artist_data_action(modeladmin, request, queryset):

	
	ct = ContentType.objects.get_for_model(queryset.model)
	selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
	
	#que artist for update
	queryset.update(queued=True,pulled_spotify=False,pulled_echonest=False)
	
	#start thread
	tr = Thread(target=get_artists_data,args=(queryset,))
	tr.start()

	#redirect to update view status
	return HttpResponseRedirect('/admin/server/artist/pullstatus/?ids=%s' % (",".join(selected)) );



pull_artist_data_action.short_description = "Pull Artist Data"



class ArtistAdmin(admin.ModelAdmin):
	list_display = ['name', 'pulled','pulled_date']
	ordering = ['name','pulled_date','pulled']
	fields = ('name', 'about')
	actions = [pull_artist_data_action]

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
		print ids

		done = 0


		for i in ids:
		

			artist = Artist.objects.get(id=i)

			
			if artist.queued == False:
				done += 1

			artists.append({'name':artist.name,'done_all':False if artist.queued else True,'done_spotify':artist.pulled_spotify,'done_echonest':artist.pulled_echonest})



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


