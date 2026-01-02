# users/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    MyTokenObtainPairSerializer,
    UserUpdateSerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated

User = get_user_model()


# -------------------------------
# UserViewSet: lista/detalha usuários
# -------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":  # criar usuário
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]  # outras ações exigem login


# -------------------------------
# Endpoint de cadastro (signup)
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'id': user.id, 'email': user.email},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Endpoint de autenticação JWT
# -------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# -------------------------------
# Endpoint de perfil do usuário logado
# -------------------------------
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """GET para ver o perfil e PATCH para atualizar"""
    user = request.user

    if request.method == 'GET':
        serializer = UserUpdateSerializer(user)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Endpoint de seguir/desseguir
# -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, user_id):
    """Segue ou desseguir outro usuário"""
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado.'}, status=404)

    if request.user == target_user:
        return Response({'detail': 'Você não pode seguir a si mesmo.'}, status=400)

    if target_user.followers.filter(id=request.user.id).exists():
        target_user.followers.remove(request.user)
        is_following = False
    else:
        target_user.followers.add(request.user)
        is_following = True

    return Response({
        'status': 'followed' if is_following else 'unfollowed',
        'is_following': is_following,
        'followers_count': target_user.followers.count()
    }, status=200)
