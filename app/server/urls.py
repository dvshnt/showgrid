from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'server.views.index', name='index'),
    
 	url(r'^i/grid/$', 'server.views.grid', name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'server.views.grid', name='grid')
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# ... the rest of your URLconf goes here ...
urlpatterns += staticfiles_urlpatterns()
