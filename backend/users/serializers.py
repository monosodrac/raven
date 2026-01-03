from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        validated_data.pop('password_confirmation')
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            bio=validated_data.get('bio', ''),
            avatar=validated_data.get('avatar', None)
        )


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
        fields = ['email', 'bio', 'avatar', 'password']

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
        token['email'] = user.email
        return token

    def validate(self, attrs):
        attrs['username'] = attrs.get('email', '')
        return super().validate(attrs)

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'bio', 'avatar']
