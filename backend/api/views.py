from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, World!"})



