# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializador para criar um novo usuário.
    Inclui validação de confirmação de senha.
    """
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirmation', 'bio', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Valida se a senha e a confirmação de senha coincidem.
        """
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError(
                {"password_confirmation": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        """
        Remove o campo password_confirmation e cria o usuário com a senha hashada.
        """
        validated_data.pop(
            'password_confirmation')  # Remove a confirmação antes de criar
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],  # Hash automático no create_user
            bio=validated_data.get('bio', ''),
            avatar=validated_data.get('avatar', None)
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para listar ou detalhar informações de um usuário.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'bio', 'avatar']

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'bio', 'avatar', 'password']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Usa email no lugar de username para autenticação JWT
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adicionar campos extras ao token se quiser
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Troca o "username" por "email"
        attrs['username'] = attrs.get('email', '')
        return super().validate(attrs)