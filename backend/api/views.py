from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import StudyPost, CarpoolPost, BloodDonationPost, Post, Like, Comment
from api.serializers import StudyPostSerializer, CarpoolPostSerializer, BloodDonationPostSerializer, RegisterSerializer, CommentSerializer, ShareSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudyPost, Community, User
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
import json
from rest_framework.permissions import IsAuthenticated

#solid principles to be implemented

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class BaseCreatePostView(APIView):
    model = None
    serializer_class = None
    required_fields = []
    post_data_mapping = {}
    no_community_error = "Community not found."
    auth_error = "User is not authenticated."

    def post(self, request, *args, **kwargs):
        try:
            # Validate that required fields are present
            for field in self.required_fields:
                if not request.data.get(field):
                    return Response(
                        {"error": f"{field} is a required field."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Get the community object
            community_name = request.data.get("community")
            try:
                community = Community.objects.get(name=community_name)
            except Community.DoesNotExist:
                return Response({"error": self.no_community_error}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure the user is authenticated
            user = request.user if request.user.is_authenticated else None
            if not user:
                return Response({"error": self.auth_error}, status=status.HTTP_403_FORBIDDEN)

            # Map and prepare data for the serializer
            post_data = {
                field: request.data.get(source)
                for field, source in self.post_data_mapping.items()
            }
            post_data.update({
                "user": user.id,  # Add user ID
                "community": community.community_id,  # Add community ID
                "created_at": timezone.now(),  # Add timestamp
            })

            # Serialize and validate the data
            serializer = self.serializer_class(data=post_data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": f"{self.model.__name__} created successfully!", "post": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateStudyPost(BaseCreatePostView):
    model = StudyPost
    serializer_class = StudyPostSerializer
    required_fields = ["community", "studytitle", "studyquestion"]
    post_data_mapping = {
        "main_topic": "studytitle",
        "question_asked": "studyquestion",
        "link_url": "questionlink",
        "image_url": "questionimage",
    }


class CreateCarPoolPost(BaseCreatePostView):
    model = CarpoolPost
    serializer_class = CarpoolPostSerializer
    required_fields = ["community", "pickup_point", "dropoff_point", "pickup_time"]
    post_data_mapping = {
        "pickup_point": "pickup_point",
        "dropoff_point": "dropoff_point",
        "pickup_time": "pickup_time",
        "preferred_gender": "preferred_gender",
        "capacity": "capacity",
    }


class CreateBloodDonationPost(BaseCreatePostView):
    model = BloodDonationPost
    serializer_class = BloodDonationPostSerializer
    required_fields = ["community", "blood_type_required", "required_within"]
    post_data_mapping = {
        "blood_type_required": "blood_type_required",
        "required_within": "required_within",
        "urgency": "urgency",
    }


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

#Liskov and ISP
class BasePostListView(APIView):
    model = None
    serializer_class = None
    no_posts_message = "No posts available at the moment."

    def get(self, request, *args, **kwargs):
        if not self.model or not self.serializer_class:
            return Response(
                {"error": "Model and serializer_class must be defined in the subclass."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        # Fetch and order posts
        posts = self.model.objects.all().order_by("-created_at")
        if not posts.exists():
            return Response(
                {"message": self.no_posts_message},
                status=status.HTTP_200_OK,
            )
        
        # Serialize the data
        serializer = self.serializer_class(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudyPostListView(BasePostListView):
    model = StudyPost
    serializer_class = StudyPostSerializer
    no_posts_message = "No study posts available at the moment."

class CarpoolPostListView(BasePostListView):
    model = CarpoolPost
    serializer_class = CarpoolPostSerializer
    no_posts_message = "No carpool posts available at the moment."

class BloodDonationPostListView(BasePostListView):
    model = BloodDonationPost
    serializer_class = BloodDonationPostSerializer
    no_posts_message = "No blood donation posts available at the moment."



class CreateShare(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user_id'] = request.user.id
        serializer = ShareSerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Extract data from the request
            data = request.data.copy()
            data['user'] = request.user.id  # Add the authenticated user to the data
            serializer = CommentSerializer(data=data)  # Pass the data to the serializer
            
            if serializer.is_valid():
                serializer.save()  # Save the valid comment
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateLike(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract post_id and user_id from the request
            post_id = request.data.get('post_id')

            # Validate input
            user = request.user if request.user.is_authenticated else None
            if not user:
                return Response({"error": "User is not authenticated."}, status=status.HTTP_403_FORBIDDEN)

            # Check if the post exists
            try:
                post = Post.objects.get(post_id=post_id)
            except Post.DoesNotExist:
                return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

            # Check if the like already exists
            if Like.objects.filter(post_id=post, user_id=user).exists():
                return Response({"error": "Like already exists for this user and post."}, status=status.HTTP_400_BAD_REQUEST)

            # Create and save the like
            like = Like(post_id=post, user_id=user, created_at=timezone.now())
            like.save()

            return Response({"message": "Like saved successfully!"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)