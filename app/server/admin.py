from models import *
from django.contrib import admin

class ShowV2Admin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers', 'venue')

admin.site.register(Address)

admin.site.register(Venue_v2)
admin.site.register(Show_v2, ShowV2Admin)

