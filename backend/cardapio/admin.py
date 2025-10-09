# seu_app/admin.py

from django.contrib import admin
from .models import MenuItem, CartItem, BancoDeImagens

# ✅ 1. REGISTRAR E CONFIGURAR O ADMIN DO BANCO DE IMAGENS
@admin.register(BancoDeImagens)
class BancoDeImagensAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'ver_imagem')
    search_fields = ('titulo',)

# ✅ 2. MELHORAR O ADMIN DO MENUITEM
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'preco', 'disponivel', 'ver_imagem_selecionada')
    list_filter = ('categoria', 'disponivel')
    search_fields = ('nome', 'descricao')
    # Adiciona a pré-visualização da imagem no formulário de edição
    readonly_fields = ('ver_imagem_selecionada',)

    def ver_imagem_selecionada(self, obj):
        # Chama a função 'ver_imagem' do modelo relacionado
        if obj.imagem_selecionada:
            return obj.imagem_selecionada.ver_imagem()
        return "Nenhuma imagem selecionada"
    ver_imagem_selecionada.short_description = 'Imagem Atual'


# Registro do CartItem (opcional, mas bom para debug)
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('produto', 'quantidade', 'data_adicao')