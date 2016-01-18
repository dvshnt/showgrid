from models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers', 'venue')




#getter functions
def pull_spotify(id,name):
	pass

def pull_echonest(id,name):
	pass








def pull_artist_data(modeladmin, request, queryset):
    queryset.update(pulled=True)



pull_artist_data.short_description = "Pull Artist Data"



class ArtistAdmin(admin.ModelAdmin):
	list_display = ['name', 'pulled','pulled_date','pulled_spotify','pulled_date']
	ordering = ['name','pulled_date','pulled_spotify','pulled_echonest']
	actions = [pull_artist_data]



admin.site.register(Address)
admin.site.register(Venue)
admin.site.register(ShowgridUser)
admin.site.register(Alert)
admin.site.register(Show, ShowAdmin)
admin.site.register(Artist, ArtistAdmin)