from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.exceptions import NotFound
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import Collection, DataSet, Metric
from .renderers import DataSetJSONRenderer, MetricsJSONRenderer
from .serializers import (DataSetSerializer, DistributionSerializer,
                          MetricSerializer)


@api_view(['GET'])
@renderer_classes([DataSetJSONRenderer])
def datasets(request):
    datasets = DataSet.objects.visible().order_by('-created_at')
    return Response([DataSetSerializer(d).data for d in datasets])


@api_view(['GET'])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')

    ds = request.query_params.get('ds')
    if ds:
        # Further filter metrics by dataset.
        metrics = (metrics.filter(collection__dataset__slug=ds)
                          .distinct('id', 'name'))
        if not metrics:
            raise NotFound('No data set with given dataset found.')

    return Response([MetricSerializer(m).data for m in metrics])


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def metric(request, metric_id):
    # Get requested dataset or most recent prior dataset by date.
    ds = request.query_params.get('ds')
    if ds:
        dataset = DataSet.objects.visible().filter(slug=ds).first()
    else:
        dataset = DataSet.objects.visible().order_by('-created_at').first()

    if not dataset:
        raise NotFound('No data set with given dataset found.')

    metric = get_object_or_404(Metric, id=metric_id)

    qs = (Collection.objects.select_related('dataset', 'metric')
                            .filter(dataset=dataset, metric=metric))

    sg = request.query_params.get('sg')
    if sg:
        qs = qs.filter(subgroup=sg)

    # Note: We simply get any record here to verify there is data.
    # We collect the requested populations later in the serializer.
    qs = qs.first()

    if not qs:
        raise NotFound('No metrics found for the given dataset.')

    pops = None
    pop = request.query_params.get('pop')
    if pop:
        pops = pop.split(',')

    serializer = DistributionSerializer(qs, populations=pops, subgroup=sg)
    return Response(serializer.data)
