from django.conf.urls import patterns, include, url

from server import settings, views
from rest_framework.authtoken import views as auth_views

from django.contrib import admin
admin.autodiscover()

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from django.views import static

urlpatterns = [

    ## Standard Django admin endpoints for a crude CMS
    url(r'^admin/', include(admin.site.urls)),


    ## version/ping
    url(r'^version/',views.version,name='version'),
   

    ## Authentication flow via django-rest-auth
    url(r'^login$', auth_views.obtain_auth_token),
    url(r'^signup$', views.signupUser, name='signup'), #normal signup (returns token)


    ## static page endpoints
    url(r'^$', views.index, name='index'),
    url(r'^search$', views.index, name='search'),
    url(r'^recent$', views.index, name='recent'),
    url(r'^profile$', views.index, name='profile'),
    url(r'^featured$', views.index, name='featured'),
    url(r'^venue/\d+$', views.index, name='venues'),

    ##static issues
    url(r'^issue/unsubscribe/(?P<hash>\d+)$', views.IssueUnsubscribe, name='issue unsubscribe'),
    url(r'^issue/(?P<id>\d+)$', views.Issues.as_view(), name='issues'),

    ## user actions
    url(r'^user/(?P<action>\w+)$', views.UserActions.as_view(), name='user actions'),
    url(r'^v1/venues/(?P<id>\d+)$', views.VenueList.as_view(), name='venue'),
    url(r'^v1/venues/$', views.VenueList.as_view(), name='grid'),
    url(r'^v1/shows/$', views.ShowList.as_view(), name='grid'),

    url(r'^check/venues$', views.check_venues, name='check_venues'),
    
    url(r'^tinymce/', include('tinymce.urls')),

    url(r'^media/(?P<path>.*)$', static.serve,
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True }
    ),

   
] +  staticfiles_urlpatterns()


