from models import *
from django.contrib import admin

class ShowAdmin(admin.ModelAdmin):
	search_fields = ['band_name']
	list_display = ('date', 'band_name', 'venue')

# class ShowAdmin(admin.ModelAdmin):
# 	search_fields = ['headliners', 'openers', 'title', 'venue']
# 	list_display = ('date', 'headliners', 'openers', 'venue')

admin.site.register(Venue)
admin.site.register(Show, ShowAdmin)
admin.site.register(Address)

# admin.site.register(Venue_v2)
# admin.site.register(Show_v2, ShowAdmin)
# admin.site.register(Address_v2)

