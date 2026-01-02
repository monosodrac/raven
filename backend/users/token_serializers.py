from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer para login com email em vez de username.
    """
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email e senha são obrigatórios.")

        # Autentica o usuário pelo email
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Email ou senha inválidos.")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
