from django.urls import path
from api.views import CustomTokenObtainPairView
from . import views  # Import the views from the api app
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import RegisterView
from .views import LatestPostsView, StudyPostListView, BloodDonationPostListView, CarpoolPostListView, CreateStudyPost, CreateCarPoolPost, CreateBloodDonationPost,CreateComment, CreateLike, CreateShare

urlpatterns = [
    #path('hello/', views.hello_world),
    path('token/',CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register'),
    path('posts/study/', StudyPostListView.as_view(), name='study-posts'),
    path('posts/latest/', LatestPostsView.as_view(), name='latest-posts'),
    path('posts/blood-donation/', BloodDonationPostListView.as_view(), name='blood-donation-posts'),
    path('posts/carpool/', CarpoolPostListView.as_view(), name='carpool-posts'),
    #path('posts/study/', StudyPostListView.as_view(), name='study-posts'),
    path('posts/blood-donation/', BloodDonationPostListView.as_view(), name='blood-donation-posts'),
    path('posts/carpool/', CarpoolPostListView.as_view(), name='carpool-posts'),
    path('createStudyPost', CreateStudyPost.as_view(), name='create_study_post'),
    path('createCarpoolPost', CreateCarPoolPost.as_view(), name='create_carpool_post'),
    path('createBloodDonationPost', CreateBloodDonationPost.as_view(), name='create_blood_donation_post'),
    path('createComment/', CreateComment.as_view(), name='comments'),
    path('createLike/', CreateLike.as_view(), name='likes'),
    path('createShare/', CreateShare.as_view(), name='shares'),
]
