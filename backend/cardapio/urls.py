# cardapio/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenuItemViewSet,
    CartItemViewSet,
    BancoDeImagensViewSet,
    PedidoViewSet  # ✅ NOVO
)

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'banco-imagens', BancoDeImagensViewSet, basename='bancoimagem')
router.register(r'pedidos', PedidoViewSet, basename='pedido')  # ✅ NOVO

urlpatterns = [
    path('', include(router.urls)),
]