# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='show',
            name='onsale',
            field=models.DateTimeField(default=datetime.datetime(2015, 10, 13, 0, 51, 25, 170791), blank=True),
        ),
    ]
