from rest_framework import serializers
from .models import MenuItem, CartItem, BancoDeImagens

# Serializer para o banco de imagens
class BancoDeImagensSerializer(serializers.ModelSerializer):
    class Meta:
        model = BancoDeImagens
        fields = ['id', 'titulo', 'imagem']


# Serializer para MenuItem
class MenuItemSerializer(serializers.ModelSerializer):
    imagem_url = serializers.ImageField(source='imagem_selecionada.imagem', read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'nome', 'descricao', 'preco', 'categoria',
            'disponivel', 'imagem_url'
        ]


# Serializer para CartItem
class CartItemSerializer(serializers.ModelSerializer):
    produto = MenuItemSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        source='produto',  # associa produto_id ao campo produto do modelo
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'addons', 'final_price', 'data_adicao']
