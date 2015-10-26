from django.conf.urls import patterns, include, url

from server import settings, views
from rest_framework.authtoken import views as auth_views

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',

    ## Standard Django admin endpoints for a crude CMS
    url(r'^admin/', include(admin.site.urls)),


    ## Authentication flow via django-rest-auth
    url(r'^login$', auth_views.obtain_auth_token),
        

    ## static page endpoints
    url(r'^$', 'server.views.index', name='index'),
    url(r'^recent$', 'server.views.index', name='index'),
    url(r'^profile$', 'server.views.index', name='index'),
    url(r'^featured$', 'server.views.index', name='index'),


    ## user actions
    url(r'^user/(?P<action>\w+)$', views.UserActions.as_view(), name='favorite'),


 	url(r'^i/grid/$', views.VenueList.as_view(), name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', views.VenueList.as_view(), name='grid'),


    url(r'^i/search$', 'server.views.get_search_results', name='search results'),

	url(r'^i/shows/$', views.ShowList.as_view(), name='recently added shows'),


    url(r'^check/venues$', 'server.views.check_venues', name='check_venues'),
)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()

urlpatterns += patterns("",
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    	{'document_root': settings.MEDIA_ROOT, 'show_indexes': True }
    )
)