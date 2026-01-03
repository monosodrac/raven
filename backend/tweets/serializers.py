from rest_framework import serializers
from .models import Tweet, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    author_avatar = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)

    is_following = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()

    # vem do annotate no queryset
    replies_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tweet
        fields = [
            'id', 'content', 'username', 'author_id', 'author_avatar', 'timestamp',
            'is_following', 'likes_count', 'liked_by_me', 'replies_count'
        ]

    def get_username(self, obj):
        return obj.author.email.split("@")[0]

    def get_author_avatar(self, obj):
        if not obj.author.avatar:
            return None
        request = self.context.get('request')
        url = obj.author.avatar.url
        return request.build_absolute_uri(url) if request else url

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author.followers.filter(id=request.user.id).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    author_email = serializers.ReadOnlyField(source='author.email')

    class Meta:
        model = Comment
        fields = ['id', 'tweet', 'author', 'author_email', 'content', 'created_at']
        read_only_fields = ['author', 'author_email', 'created_at', 'tweet']

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'bio', 'avatar']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance