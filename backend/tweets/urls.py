# tweets/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import TweetViewSet

router = routers.SimpleRouter()
router.register(r'tweets', TweetViewSet, basename='tweets')

urlpatterns = [
    path('', include(router.urls)),
]