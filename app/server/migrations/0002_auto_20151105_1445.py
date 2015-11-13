# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
import colorful.fields


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Venue_v2',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('image', models.ImageField(upload_to=b'showgrid/img/venues/')),
                ('website', models.URLField()),
                ('primary_color', colorful.fields.RGBColorField()),
                ('secondary_color', colorful.fields.RGBColorField()),
                ('accent_color', colorful.fields.RGBColorField()),
                ('opened', models.BooleanField(default=True)),
                ('autofill', models.CharField(max_length=200, blank=True)),
                ('age', models.PositiveSmallIntegerField(default=0, blank=True)),
                ('address', models.ForeignKey(to='server.Address')),
            ],
        ),
        migrations.AddField(
            model_name='alert',
            name='which',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='show',
            name='onsale',
            field=models.DateTimeField(default=datetime.datetime(2015, 11, 5, 14, 45, 12, 558835), blank=True),
        ),
    ]
