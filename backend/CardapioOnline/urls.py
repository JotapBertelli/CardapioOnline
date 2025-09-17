from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),          # painel do Django Admin
    path("api/", include("cardapio.urls")),   # suas rotas da app 'cardapio'
]
