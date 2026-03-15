from django.urls import path
from . import views  # Import the views from the api app

urlpatterns = [
    path('hello/', views.hello_world),  # Define your API route here
]
