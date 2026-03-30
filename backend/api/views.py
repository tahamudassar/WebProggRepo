from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import StudyPost, CarpoolPost, BloodDonationPost, Post, Like, Comment
from api.serializers import StudyPostSerializer, CarpoolPostSerializer, BloodDonationPostSerializer, RegisterSerializer, CommentSerializer, ShareSerializer,UserSerializer, MaterialSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudyPost, Community, User, Material
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
import json
from rest_framework.permissions import IsAuthenticated
from abc import ABC, abstractmethod
from django.conf import settings

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status


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

#Liskov and Interface Segregation Principle implementation

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
        
        
        
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, *args, **kwargs):
        user_email = request.user.email  # Use the authenticated user's email
        try:
            user = User.objects.get(email=user_email)
            serializer = UserSerializer(user)  # Use the serializer to serialize user data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
     
     
            
class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # Get the authenticated user
        
        # Fetch posts by the user
        
        study_posts = StudyPost.objects.filter(user=user)
        blood_donation_posts = BloodDonationPost.objects.filter(user=user)
        carpool_posts = CarpoolPost.objects.filter(user=user)

        # Serialize the posts
        
        study_posts_serialized = StudyPostSerializer(study_posts, many=True).data
        blood_donation_posts_serialized = BloodDonationPostSerializer(blood_donation_posts, many=True).data
        carpool_posts_serialized = CarpoolPostSerializer(carpool_posts, many=True).data

        # Combine all posts into a single response
        
        all_posts = {
            "study_posts": study_posts_serialized,
            "blood_donation_posts": blood_donation_posts_serialized,
            "carpool_posts": carpool_posts_serialized,
        }

        return Response(all_posts, status=status.HTTP_200_OK)
    
    
##Interface segregation priniciple
from django.contrib.auth import get_user_model

User = get_user_model()  # Get the user model

class ProfileUpdater(ABC):
    @abstractmethod
    def update(self, user, data):
        pass


# Derived classes

class UpdateEmail(ProfileUpdater):
    def update(self, user, data):
        new_email = data.get('email')
        if not new_email:
            raise ValueError("Email is required.")
        
        if user.email == new_email:
            raise ValueError("The new email cannot be the same as the current email.")
        
        # Check if the new email already exists in the database
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            raise ValueError("Email already exists. Please choose a different one.")
        
        user.email = new_email
        user.save()
        return {"message": "Email updated successfully."}


class UpdatePassword(ProfileUpdater):
    def update(self, user, data):
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        if not old_password or not new_password:
            raise ValueError("Old password and new password are required.")
        if not user.check_password(old_password):
            raise ValueError("Old password is incorrect.")
        user.set_password(new_password)
        user.save()
        return {"message": "Password updated successfully."}


class UpdateProfileImageURL(ProfileUpdater):
    def update(self, user, data):
        new_image_url = data.get('profile_image')
        if not new_image_url:
            raise ValueError("Profile image URL is required.")
        user.profile_image = new_image_url
        user.save()
        return {"message": "Profile image updated successfully."}


# API Views

class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, update_type, *args, **kwargs):
        user = request.user
        data = request.data
        updater = None

        # Determine the type of update
        
        if update_type == "password":
            updater = UpdatePassword()
        elif update_type == "profile_image":
            updater = UpdateProfileImageURL()
        elif update_type == "email":
            updater = UpdateEmail()
        else:
            return Response({"error": "Invalid update type."}, status=status.HTTP_400_BAD_REQUEST)

        # Perform the update
        try:
            result = updater.update(user, data)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#forgot password

class PasswordResetRequestView(APIView):
    """
    Endpoint for requesting a password reset email.
    """

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Generate reset token
        token = default_token_generator.make_token(user)
        reset_url = f"http://localhost:3000/reset-password/{token}"
        
        # Send the reset email
        send_mail(
            "Password Reset Request",  # Subject
            f"Click the link below to reset your password:\n\n{reset_url}",  # Email body
            settings.DEFAULT_FROM_EMAIL,  # From email (using the setting from your settings.py)
            [email],  # To email address
        )

        return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
    

class PasswordResetConfirmView(APIView):
    """
    Endpoint to reset the user's password using the token.
    """

    def post(self, request, token):
        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"detail": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Loop through users and check token for each user
            for user in User.objects.all():
                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)

            # If no user matches the token
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MaterialListView(APIView):
    def get(self, request):
        materials = Material.objects.all()  # Fetch all materials
        serializer = MaterialSerializer(materials, many=True)  # Serialize the data
        return Response(serializer.data)
        