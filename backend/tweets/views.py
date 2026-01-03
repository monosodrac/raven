
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from django.http import JsonResponse
from .models import Tweet
from .serializers import TweetSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class TweetViewSet(viewsets.ModelViewSet):
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return (
            Tweet.objects
            .filter(Q(author__followers=user) | Q(author=user))
            .select_related("author")
            .annotate(replies_count=Count("comments", distinct=True))
            .order_by("-created_at")
            .distinct()
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        """Associa o tweet ao usuário autenticado."""
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        """Cria e retorna o tweet recém-criado em JSON."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like_tweet(self, request, pk=None):
        """Toggle like/unlike de um tweet."""
        tweet = self.get_object()
        user = request.user

        if user in tweet.likes.all():
            tweet.likes.remove(user)
            liked = False
        else:
            tweet.likes.add(user)
            liked = True

        return JsonResponse({
            "liked": liked,
            "total_likes": tweet.likes.count()
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        """POST /tweets/{id}/add_comment/"""
        tweet = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, tweet=tweet)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def comments(self, request, pk=None):
        tweet = self.get_object()
        comments = tweet.comments.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


