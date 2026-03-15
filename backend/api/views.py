from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, World!"})



