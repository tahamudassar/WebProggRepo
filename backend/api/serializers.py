from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from api.models import User  # Replace with your custom user model

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        # Add custom claims (e.g., role) to the JWT payload
        data['role'] = user.role  # Assuming your User model has a role field
        return data
