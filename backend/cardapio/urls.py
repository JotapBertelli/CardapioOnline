from django.urls import path, include
from rest_framework.routers import DefaultRouter
# ✅ Corrigido para importar os nomes corretos do ficheiro views.py
from .views import MenuItemViewSet, CartItemViewSet

router = DefaultRouter()
# ✅ Corrigido para usar os nomes corretos e os URLs que o frontend espera
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')

urlpatterns = [
    path('', include(router.urls)),
]