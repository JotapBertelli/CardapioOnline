from rest_framework import serializers
from .models import Produto, ItemCarrinho

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ["id", "nome", "preco"]

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(write_only=True, source="produto", queryset=Produto.objects.all())

    class Meta:
        model = ItemCarrinho
        fields = ["id", "produto", "produto_id", "quantidade"]
