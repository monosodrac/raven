# tweets/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class Tweet(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_tweets", blank=True)

class Comment(models.Model):
    tweet = models.ForeignKey(Tweet, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"
