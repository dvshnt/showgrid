from models import *
from django.contrib import admin

class ShowAdmin(admin.ModelAdmin):
	search_fields = ['band_name']
	list_display = ('date', 'band_name', 'venue')

admin.site.register(Venue)
admin.site.register(Show, ShowAdmin)
admin.site.register(Address)