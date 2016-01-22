Showgrid
========

A futuristic calendar that pulls data from your life and tells what to do and when to do it. You never have to think about scheduling another appointment, meeting, or find another job because Show Grid does it all for you in a matter of seconds.

To Run
======


First, install mysql via brew if your on osx
`brew install MySQL`
`brew install python` current project uses 2.7 i believe.


Second, you're going to download a ton of Python packages. I should've noted these down, but to start, download the following using pip:

(if your on windows pip needs to be added to the path and you have to have python using c++ redis in order to compile the packages)

`pip install django-phonenumber-field`
`pip install djangorestframework`
`pip install python-dateutil`
`pip install schedule`
`pip install Pillow`
`pip install twillio`
`pip install django-localflavor`
`pip install django-colorful`
`pip install MySQL-python`
`pip install django==1.8.5`
`pip install django-haystack`

There will inevitably be a bevy of other libraries you need to download now. Most likely, these will show up when launching the server and running into various errors.

You'll want to create a database in MySQL by the name of *showgriddb*.

You'll then need to modify the `settings.py` file to point to the correct directories and contain the correct permissions.

make sure to 

Firstly, make sure the DATABASE object contains the correct name and password of your MySQL user profile as well as teh correct name of the database you want to use for Showgrid.

Then, modify the following fields to point to the relevant directores in the Showgrid app directory:
* MEDIA_ROOT
* STATIC_ROOT
* STATICFILE_DIRS
* TEMPLATE_DIRS
* TWILIO_ACCOUNT_SID
* TWILIO_AUTH_TOKEN
* TWILIO_NUMBER 

After you've done this, run into the client directory and run `npm install` followed by `grunt build`.

Then, cd into the APP directory and run `python manage.py collectstatic`.

Next, run `python manage.py syncdb`.

I may be crazy, but you should then be able to run `python manage.py runserver` to have the site up and running at `localhost:8000`.


Run CRONS from management/commands/crons.py with python manage.py crons


add these settings for show and related artists data pulling form echonest and spotify:
	SPOTIFY_KEY = ''
	SPOTIFY_API = 'https://api.spotify.com/v1/'
	ECHONEST_API = 'http://developer.echonest.com/api/v4/'
	ECHONEST_KEY = 'ZOP6OTHBMGEZHVHTF'


run cron job to check alerts.





###phone cron###
`python manage.py crons`


###phone setup###
`/user/phone_set?phone=6157157754`
add a phone to a user account (if phone already exists, will REMOVE all previous alerts! user phone activated is automatically set to FALSE)

`/user/phone_status`
check if phone is activate, returns status as boolean



###phone pin auth###
`/user/pin_send`
send pin number to phone: (if phone already activated or does not exist will return accordingly)

`/user/pin_check?pin=1234`
check pin number of phone: (if phone already activated or does not exist will return accordingly)



###phone alerts###
`/user/alert_toggle?date=2015-10-27T04:44:58.046Z&show=1`
add alert to loged in user PARAMETERS: show id as integer, javascript UTC ISOString

`/user/alert_toggle?show=1`
remove the alert created previously

`/user/alert_clearall`
remove all alerts

`/user/alert_count`
count all alerts
