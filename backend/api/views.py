from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.serializers import RegisterSerializer
from .models import StudyPost, CarpoolPost, BloodDonationPost
from .serializers import StudyPostSerializer, CarpoolPostSerializer, BloodDonationPostSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, World!"})


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LatestPostsView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch the latest 5 posts across all types
        study_posts = StudyPost.objects.all().order_by('-created_at')[:5]
        blood_posts = BloodDonationPost.objects.all().order_by('-created_at')[:5]
        carpool_posts = CarpoolPost.objects.all().order_by('-created_at')[:5]

        # Combine and sort them by creation time
        all_posts = sorted(
            list(study_posts) + list(blood_posts) + list(carpool_posts),
            key=lambda x: x.created_at,
            reverse=True
        )[:5]

        # If no posts exist, return a message
        if not all_posts:
            return Response(
                {"message": "No posts available at the moment."},
                status=status.HTTP_200_OK
            )

        # Serialize the results
        response_data = []
        for post in all_posts:
            if isinstance(post, StudyPost):
                serializer = StudyPostSerializer(post)
            elif isinstance(post, BloodDonationPost):
                serializer = BloodDonationPostSerializer(post)
            elif isinstance(post, CarpoolPost):
                serializer = CarpoolPostSerializer(post)
            response_data.append(serializer.data)

        return Response(response_data, status=status.HTTP_200_OK)


class StudyPostListView(APIView):
    def get(self, request, *args, **kwargs):
        posts = StudyPost.objects.all().order_by('-created_at')
        if not posts.exists():  # Check if no posts exist
            return Response(
                {"message": "No study posts available at the moment."},
                status=status.HTTP_200_OK
            )
        serializer = StudyPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CarpoolPostListView(APIView):
    def get(self, request, *args, **kwargs):
        posts = CarpoolPost.objects.all().order_by('-created_at')
        if not posts.exists():  # Check if no posts exist
            return Response(
                {"message": "No carpool posts available at the moment."},
                status=status.HTTP_200_OK
            )
        serializer = CarpoolPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BloodDonationPostListView(APIView):
    def get(self, request, *args, **kwargs):
        posts = BloodDonationPost.objects.all().order_by('-created_at')
        if not posts.exists():  # Check if no posts exist
            return Response(
                {"message": "No blood donation posts available at the moment."},
                status=status.HTTP_200_OK
            )
        serializer = BloodDonationPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
