from models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

class ShowAdmin(admin.ModelAdmin):
	search_fields = ['headliners', 'openers', 'title']
	list_display = ('date', 'headliners', 'openers', 'venue')

admin.site.register(Address)

admin.site.register(Venue)
admin.site.register(ShowgridUser)
admin.site.register(Alert)
admin.site.register(Show, ShowAdmin)