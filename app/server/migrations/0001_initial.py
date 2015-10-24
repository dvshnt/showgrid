# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
import colorful.fields
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ShowgridUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('username', models.CharField(max_length=30, verbose_name='username', blank=True)),
                ('email', models.EmailField(unique=True, max_length=254, verbose_name='email address')),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(unique=True, max_length=128, blank=True)),
                ('is_active', models.BooleanField(default=False, verbose_name='active')),
                ('is_admin', models.BooleanField(default=False, verbose_name='admin')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('street', models.CharField(max_length=128, verbose_name='street')),
                ('city', models.CharField(max_length=64, verbose_name='city')),
                ('state', models.CharField(max_length=2, verbose_name='state')),
                ('zip_code', models.CharField(max_length=10, verbose_name='zip code')),
            ],
        ),
        migrations.CreateModel(
            name='Show',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=100, blank=True)),
                ('headliners', models.CharField(max_length=300)),
                ('openers', models.CharField(max_length=400, blank=True)),
                ('website', models.URLField(blank=True)),
                ('date', models.DateTimeField()),
                ('star', models.BooleanField(default=False)),
                ('review', models.FileField(default=b'', upload_to=b'showgrid/reviews/')),
                ('price', models.SmallIntegerField(default=-1, blank=True)),
                ('ticket', models.URLField(blank=True)),
                ('soldout', models.BooleanField(default=False)),
                ('onsale', models.DateTimeField(default=datetime.datetime(2015, 10, 13, 0, 50, 26, 414414), blank=True)),
                ('age', models.PositiveSmallIntegerField(default=0, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Venue',
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
            model_name='show',
            name='venue',
            field=models.ForeignKey(related_name='shows', to='server.Venue'),
        ),
        migrations.AddField(
            model_name='showgriduser',
            name='favorites',
            field=models.ManyToManyField(to='server.Show'),
        ),
    ]
