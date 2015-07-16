Showgrid
========

A futuristic calendar that pulls data from your life and tells what to do and when to do it. You never have to think about scheduling another appointment, meeting, or find another job because Show Grid does it all for you in a matter of seconds.


To Run
======

First, you're going to download a ton of Python packages. I should've noted these down, but to start, download the following using pip:

`pip install MySQL-python`
`pip install django==1.5.5`
`pip install django-haystack`

There will inevitably be a bevy of other libraries you need to download now. Most likely, these will show up when launching the server and running into various errors.

You'll want to create a database in MySQL by the name of *showgriddb*.

You'll then need to modify the `settings.py` file to point to the correct directories and contain the correct permissions.

Firstly, make sure the DATABASE object contains the correct name and password of your MySQL user profile as well as teh correct name of the database you want to use for Showgrid.

Then, modify the following fields to point to the relevant directores in the Showgrid app directory:
* MEDIA_ROOT
* STATIC_ROOT
* STATICFILE_DIRS
* TEMPLATE_DIRS

After you've done this, run into the client directory and run `npm install` followed by `grunt build`.

Then, run into the APP directory and run `python manage.py collectstatic`.

Next, run `python manage.py syncdb`.

I may be crazy, but you should then be able to run `python manage.py runserver` to have the site up and running at `localhost:8000`.
