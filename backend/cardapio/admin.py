# Adicione ao seu admin.py existente

from django.contrib import admin
from .models import Pedido, ItemPedido, AdicionalProduto, BancoDeImagens, MenuItem, CartItem


# ✅ Admin para Banco de Imagens
@admin.register(BancoDeImagens)
class BancoDeImagensAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'ver_imagem')
    search_fields = ('titulo',)


# ✅ Admin para Menu Items
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'preco', 'disponivel', 'ver_imagem_selecionada')
    list_filter = ('categoria', 'disponivel')
    search_fields = ('nome', 'descricao')
    readonly_fields = ('ver_imagem_selecionada',)

    def ver_imagem_selecionada(self, obj):
        if obj.imagem_selecionada:
            return obj.imagem_selecionada.ver_imagem()
        return "Nenhuma imagem selecionada"

    ver_imagem_selecionada.short_description = 'Imagem Atual'


# ✅ Admin para Cart Items
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('produto', 'quantidade', 'adicional_escolhido', 'data_adicao')


# ✅ Admin para Adicionais dos Produtos
@admin.register(AdicionalProduto)
class AdicionalProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'produto', 'preco_adicional', 'ordem')
    list_filter = ('produto__categoria',)
    search_fields = ('nome', 'produto__nome')
    ordering = ('produto', 'ordem')


# ✅ Inline para mostrar itens dentro do pedido
class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('subtotal',)
    can_delete = False


# ✅ Admin do Pedido
@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'nome_cliente', 'telefone', 'tipo_entrega',
        'status', 'total', 'data_pedido'
    )
    list_filter = ('status', 'tipo_entrega', 'data_pedido')
    search_fields = ('nome_cliente', 'telefone', 'id')
    readonly_fields = ('data_pedido', 'data_atualizacao', 'subtotal', 'total')
    inlines = [ItemPedidoInline]

    fieldsets = (
        ('Informações do Cliente', {
            'fields': ('nome_cliente', 'telefone', 'endereco')
        }),
        ('Detalhes do Pedido', {
            'fields': ('tipo_entrega', 'status', 'observacoes')
        }),
        ('Valores', {
            'fields': ('subtotal', 'taxa_entrega', 'total')
        }),
        ('Datas', {
            'fields': ('data_pedido', 'data_atualizacao')
        }),
    )