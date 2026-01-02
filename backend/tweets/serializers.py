# tweet/serializers.py
from rest_framework import serializers
from .models import Tweet
from .models import Tweet, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source='author.id', read_only=True)  # <- ID do autor
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    is_following = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()  # opcional, se quiser exibir contador

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'username', 'author_id', 'timestamp', 'likes', 'is_following', 'total_likes']

    def get_username(self, obj):
        return obj.author.email.split("@")[0]

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.author.followers.filter(id=request.user.id).exists()
        return False

    def get_total_likes(self, obj):
        return obj.likes.count()


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