from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'server.views.index', name='index'),
    url(r'^check/venues$', 'server.views.check_venues', name='check_venues'),


    url(r'^i/search$', 'server.views.get_search_results', name='search results'),
    
 	url(r'^i/grid/$', 'server.views.grid', name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'server.views.grid', name='grid'),

 	url(r'^i/onsale/$', 'server.views.shows_on_sale_soon', name='shows on sale soon'),

 	url(r'^i/recent/$', 'server.views.recently_added', name='recently added shows')
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()
