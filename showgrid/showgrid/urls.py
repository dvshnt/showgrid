from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'showgrid.views.index', name='index'),
    url(r'^(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'showgrid.views.index', name='index'),

 	url(r'^i/grid/$', 'showgrid.views.grid', name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'showgrid.views.grid', name='grid'),

#	url(r'^i/venue/$', 'showgrid.views.venue', name='venue'),
#	url(r'^i/venue/(?P<venue>\d+)/$', 'showgrid.views.venue', name='venue_single'),
#	url(r'^i/venue/(?P<venue>\d+)/show/$', 'showgrid.views.venue_and_show', name='venue_and_show'),
#	url(r'^i/venue/(?P<venue>\d+)/show/(?P<show>\d+)$', 'showgrid.views.venue_and_show', name='venue_and_show_single'),
	
#	url(r'^i/show/$', 'showgrid.views.show', name='show'),
#	url(r'^i/show/(?P<show>\d+)$', 'showgrid.views.show', name='show_single'),
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# ... the rest of your URLconf goes here ...
urlpatterns += staticfiles_urlpatterns()
