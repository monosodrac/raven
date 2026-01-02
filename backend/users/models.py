# users/models.py
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from .managers import MyUserManager

class User(AbstractUser):
    # Remove o username herdado
    username = None
    
    email = models.EmailField(unique=True)

    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    groups = models.ManyToManyField(Group, related_name='custom_user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions', blank=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # sem username, sem first_name etc.,

    # Atribui o manager customizado
    objects = MyUserManager()

    def __str__(self):
        return self.email
