from django.contrib import admin
from django.urls import path, include
# Imports necessários para as imagens
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('cardapio.urls')),
    path('api/token/', obtain_auth_token, name='api_token_auth'),
]

# ✅ Adiciona a rota para servir as imagens em modo de desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)