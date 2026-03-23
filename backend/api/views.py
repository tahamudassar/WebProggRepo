from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import StudyPost, CarpoolPost, BloodDonationPost
from api.serializers import StudyPostSerializer, CarpoolPostSerializer, BloodDonationPostSerializer, RegisterSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudyPost, Community, User
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
import json

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CreateBloodDonationPost(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract data from the request
            community_name = request.data.get("community")
            blood_type_required = request.data.get("blood_type_required")
            required_within = request.data.get("required_within")
            urgency = request.data.get("urgency")

            # Validate required fields
            if not community_name or not blood_type_required or not required_within:
                return Response(
                    {"error": "Community, blood type, and required within are mandatory fields."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the community object
            try:
                community = Community.objects.get(name=community_name)
            except Community.DoesNotExist:
                return Response({"error": "Community not found."}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure the user is authenticated
            user = request.user if request.user.is_authenticated else None
            if not user:
                return Response({"error": "User is not authenticated."}, status=status.HTTP_403_FORBIDDEN)

            # Prepare data for serialization
            blood_donation_post_data = {
                "user": user.id,  # User ID (pk)
                "community": community.community_id,  # Community ID (pk)
                "blood_type_required": blood_type_required,
                "required_within": required_within,
                "urgency": urgency,
                "created_at": timezone.now()
            }

            # Serialize data
            serializer = BloodDonationPostSerializer(data=blood_donation_post_data)

            # Validate and save the serialized data
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Blood donation post created successfully!", "post": serializer.data},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CreateCarPoolPost(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract data from the request
            community_name = request.data.get("community")
            pickup_point = request.data.get("pickup_point")
            dropoff_point = request.data.get("dropoff_point")
            pick_time = request.data.get("pickup_time")
            gender = request.data.get("preferred_gender")
            capacity = request.data.get("capacity")
            # Validate input
            if not community_name or not pickup_point or not dropoff_point or not pick_time:
                return Response({"error": "Community, pickup point, dropoff point, and pickup time are required."}, status=400)

            # Get the community object
            try:
                community = Community.objects.get(name=community_name)
            except Community.DoesNotExist:
                return Response({"error": "Community not found."}, status=400)

            # Get the currently authenticated user (if available)
            user = request.user if request.user.is_authenticated else None
            if not user:
                return Response({"error": "User is not authenticated."}, status=403)

            # Create the CarPoolPost data
            carpool_post_data = {
                "user": user.id,  # Pass the user's ID (pk)
                "community": community.community_id,  # Pass the community's ID (pk)
                "pickup_point": pickup_point,
                "dropoff_point": dropoff_point,
                "pickup_time": pick_time,
                "preferred_gender": gender,
                "created_at": timezone.now(),
                "capacity": capacity
            }

            # Serialize data
            serializer = CarpoolPostSerializer(data=carpool_post_data)

            if serializer.is_valid():
                # Save the carpool post to the database
                serializer.save()

                # Return success response
                return Response({"message": "Carpool post created successfully!"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateStudyPost(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Extract data from request
            community_name = request.data.get("community")
            study_title = request.data.get("studytitle")
            study_question = request.data.get("studyquestion")
            question_link = request.data.get("questionlink")
            image_url = request.data.get("questionimage")  # Expecting a URL for image

            # Validate input
            if not community_name or not study_title or not study_question:
                return Response({"error": "Community, title, and question are required."}, status=400)

            # Get the community object
            try:
                community = Community.objects.get(name=community_name)
            except Community.DoesNotExist:
                return Response({"error": "Community not found."}, status=400)

            # Get the currently authenticated user (if available)
            user = request.user if request.user.is_authenticated else None
            if not user:
                return Response({"error": "User is not authenticated."}, status=403)

            # Create the StudyPost data
            study_post_data = {
                "user": user.id,  # Pass the user's ID (pk)
                "community": community.community_id,  # Pass the community's ID (pk)
                "main_topic": study_title,
                "question_asked": study_question,
                "link_url": question_link if question_link else None,
                "image_url": image_url if image_url else None,
                "created_at": timezone.now()
            }

            # Serialize data
            serializer = StudyPostSerializer(data=study_post_data)

            if serializer.is_valid():
                # Save the study post to the database
                serializer.save()

                # Return success response
                return Response({"message": "Study post created successfully!"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
