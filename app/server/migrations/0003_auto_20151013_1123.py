# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_auto_20151013_0051'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alert',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_active', models.BooleanField(default=True)),
                ('date', models.DateTimeField()),
            ],
        ),
        migrations.AlterField(
            model_name='show',
            name='onsale',
            field=models.DateTimeField(default=datetime.datetime(2015, 10, 13, 11, 23, 49, 365232), blank=True),
        ),
        migrations.AlterField(
            model_name='showgriduser',
            name='favorites',
            field=models.ManyToManyField(related_name='show_set', to='server.Show', blank=True),
        ),
        migrations.AddField(
            model_name='alert',
            name='show',
            field=models.ForeignKey(to='server.Show'),
        ),
        migrations.AddField(
            model_name='showgriduser',
            name='alerts',
            field=models.ManyToManyField(to='server.Alert'),
        ),
    ]
