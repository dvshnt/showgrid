from django.conf.urls import patterns, include, url

from server import settings

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'server.views.index', name='index'),
    url(r'^check/venues$', 'server.views.check_venues', name='check_venues'),


    url(r'^i/search$', 'server.views.get_search_results', name='search results'),
    
 	url(r'^i/grid/$', 'server.views.grid', name='grid'),
	url(r'^i/grid/(?P<year>\d+)/(?P<month>\d+)/(?P<day>\d+)$', 'server.views.grid', name='grid'),

	url(r'^i/recent/$', 'server.views.recently_added', name='recently added shows'),

 	url(r'^i/featured/$', 'server.views.recommended_shows', name='recommended shows'),


 	#phone authentication and alerts
 	url(r'^phone/send_pin$', 'server.views.phone_send_pin', name='send phone pin'),
 	url(r'^phone/check_pin$', 'server.views.phone_verify_pin', name='verify phone pin'),
 	url(r'^phone/status$', 'server.views.phone_check_status', name='check phone status'),
 	url(r'^phone/add_alert$', 'server.views.phone_add_alert', name='add alert to phone number'),
	url(r'^phone/remove_alert$', 'server.views.phone_remove_alert', name='add alert to phone number'),
 	url(r'^phone/clear_alerts$', 'server.views.phone_remove_all_alert', name='add alert to phone number'),

)

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()

urlpatterns += patterns("",
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
    	{'document_root': settings.MEDIA_ROOT, 'show_indexes': True }
    )
)