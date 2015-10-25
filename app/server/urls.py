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


 	url(r'^i/featured/$', 'server.views.recommended_shows', name='recommended shows'),


 	#phone authentication and alerts
 	url(r'^phone/send_pin$', 'server.views.phone_send_pin', name='send phone pin'),
 	url(r'^phone/check_pin$', 'server.views.phone_verify_pin', name='verify phone pin'),
 	url(r'^phone/status$', 'server.views.phone_check_status', name='check phone status'),
 	url(r'^phone/add_alert$', 'server.views.phone_add_alert', name='add alert to phone number'),
	url(r'^phone/remove_alert$', 'server.views.phone_remove_alert', name='add alert to phone number'),
 	url(r'^phone/clear_alerts$', 'server.views.phone_remove_all_alert', name='add alert to phone number'),



    url(r'^check/venues$', 'server.views.check_venues', name='check_venues'),

)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()

urlpatterns += patterns("",
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    	{'document_root': settings.MEDIA_ROOT, 'show_indexes': True }
    )
)