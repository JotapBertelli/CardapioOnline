from django.urls import path, include
from rest_framework.routers import DefaultRouter
from views import ProdutoViewSet, CarrinhoViewSet

router = DefaultRouter()
router.register(r"produtos", ProdutoViewSet, basename="produto")

urlpatterns = [
    path("", include(router.urls)),
    path("carrinho/", CarrinhoViewSet.as_view({"get":"list"})),
    path("carrinho/adicionar/", CarrinhoViewSet.as_view({"post":"adicionar"})),
    path("carrinho/remover/", CarrinhoViewSet.as_view({"post":"remover"})),
]
