import datetime
from haystack import indexes
from server.models import Venue, Show


class ShowIndex(indexes.SearchIndex, indexes.Indexable):
	text = indexes.CharField(document=True, use_template=True)

	band = indexes.CharField(model_attr='band_name')
	date = indexes.DateTimeField(model_attr='date')
	website = indexes.CharField(model_attr='website')
	venue = indexes.CharField(model_attr='venue')

	def get_model(self):
		return Show

	def index_queryset(self, using=None):
		return self.get_model().objects.filter(date__gte=datetime.datetime.now())

	def prepare_venue(self, obj):
		return obj.venue.name


# class VenueIndex(indexes.SearchIndex, indexes.Indexable):
# 	text = indexes.CharField(document=True, use_template=True)

# 	band = indexes.CharField(model_attr='name')

# 	def get_model(self):
# 		return Venue