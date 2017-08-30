from django.db.models.expressions import RawSQL
from django.db import models


class DataSetQuerySet(models.QuerySet):

    def visible(self):
        return self.filter(display=True)


class DataSet(models.Model):
    name = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    display = models.BooleanField(default=False)
    import_start = models.DateTimeField(null=True)
    import_stop = models.DateTimeField(null=True)

    objects = DataSetQuerySet.as_manager()

    class Meta:
        get_latest_by = 'date'

    def __str__(self):
        return '%s, date=%s, display=%s' % (
            self.name, self.date.strftime('%Y-%m-%d'), self.display)

    def get_metrics(self):
        return list(
            Metric.objects.filter(collection__dataset=self)
                          .distinct('id')
                          .values_list('id', flat=True)
        )

    def get_populations(self):
        populations = (
            Collection.objects.filter(dataset=self)
                              .distinct('population')
                              .values_list('population', flat=True))

        stats = (
            Stats.objects.filter(dataset=self)
                         .values_list('population', 'key', 'value'))
        data = {
            p: {
                k: v for b, k, v in stats if b == p
            } for p in populations
        }

        return data

    def get_subgroups(self):
        return list(
            Collection.objects.filter(dataset=self)
                              .exclude(subgroup='')
                              .distinct('subgroup')
                              .values_list('subgroup', flat=True))


TOOLTIP_HELP = (
    "The tooltip displayed on hover. Available variables are: "
    "{x} - the x-axis label (if categorical) or value, "
    "{y} - the y-axis value which will be the summed proportions, and "
    "{p} - the individual proportion for the hovered data point.")


class Metric(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    tooltip = models.CharField(
        max_length=255, blank=True,
        help_text=TOOLTIP_HELP)
    type = models.CharField(max_length=50, blank=True, default='')
    units = models.CharField(max_length=50, blank=True, default='')
    source_name = models.CharField(
        max_length=255,
        help_text="The metric's name in the source telemetry data.")

    def __str__(self):
        return '%s, type=%s' % (self.name, self.type)


class Collection(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric)
    num_observations = models.IntegerField()
    population = models.CharField(max_length=255)
    subgroup = models.CharField(max_length=255, default='')

    def __str__(self):
        return (
            'population=%s, subgroup=%s, n=%d, dataset_id=%d, metric_id=%d'
            % (self.population, self.subgroup, self.num_observations,
               self.dataset_id, self.metric_id)
        )

    def points(self):
        return self._points.annotate(
            cumulative=RawSQL('SUM(proportion) OVER (ORDER BY bucket::int)', []))


class Point(models.Model):
    collection = models.ForeignKey(Collection, related_name='_points')
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    count = models.BigIntegerField(null=True)
    rank = models.IntegerField(null=True)


class Stats(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric, blank=True, null=True)
    population = models.CharField(max_length=255, default='')
    subgroup = models.CharField(max_length=255, default='')
    key = models.CharField(max_length=100)
    value = models.IntegerField()
