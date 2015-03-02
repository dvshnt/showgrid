from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'showgrid.views.index', name='index'),
    url(r'^(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'showgrid.views.index', name='index'),

 	url(r'^i/grid/$', 'showgrid.views.grid', name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'showgrid.views.grid', name='grid')
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# ... the rest of your URLconf goes here ...
urlpatterns += staticfiles_urlpatterns()
