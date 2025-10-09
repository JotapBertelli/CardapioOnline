# cardapio/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token # ✅ Correção aqui
from .views import MenuItemViewSet, CartItemViewSet, BancoDeImagensViewSet

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'banco-imagens', BancoDeImagensViewSet, basename='bancoimagem')

urlpatterns = [
    path('', include(router.urls)),
    # A rota para obter o token de autenticação
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]