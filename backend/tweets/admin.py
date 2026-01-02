from django.contrib import admin
from .models import Tweet

@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'content', 'created_at']  # use campos que existem
    list_filter = ['created_at']  # use campos que existem
