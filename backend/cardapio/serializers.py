from rest_framework import serializers
from .models import MenuItem, CartItem, BancoDeImagens, Pedido, ItemPedido, AdicionalProduto


# Serializer para o banco de imagens
class BancoDeImagensSerializer(serializers.ModelSerializer):
    class Meta:
        model = BancoDeImagens
        fields = ['id', 'titulo', 'imagem']


# ✅ NOVO: Serializer para Adicionais
class AdicionalProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdicionalProduto
        fields = ['id', 'nome', 'preco_adicional', 'ordem']


# Serializer para MenuItem
class MenuItemSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()
    imagem_selecionada = serializers.PrimaryKeyRelatedField(
        queryset=BancoDeImagens.objects.all(),
        required=False,
        allow_null=True
    )
    # ✅ NOVO: Inclui os adicionais disponíveis
    adicionais = AdicionalProdutoSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'nome', 'descricao', 'preco', 'categoria',
            'disponivel', 'imagem_url', 'imagem_selecionada', 'adicionais'
        ]
        extra_kwargs = {
            'imagem_selecionada': {'write_only': True}
        }

    def get_imagem_url(self, obj):
        if obj.imagem_selecionada and obj.imagem_selecionada.imagem:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.imagem_selecionada.imagem.url)
            return obj.imagem_selecionada.imagem.url
        return None


# ✅ ATUALIZADO: Serializer para CartItem
class CartItemSerializer(serializers.ModelSerializer):
    produto = MenuItemSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        source='produto',
        write_only=True
    )
    adicional_escolhido_id = serializers.PrimaryKeyRelatedField(
        queryset=AdicionalProduto.objects.all(),
        source='adicional_escolhido',
        required=False,
        allow_null=True,
        write_only=True
    )
    adicional_info = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'produto', 'produto_id', 'quantidade',
            'adicional_escolhido_id', 'adicional_info',
            'observacoes', 'final_price', 'data_adicao'
        ]

    def get_adicional_info(self, obj):
        if obj.adicional_escolhido:
            return {
                'id': obj.adicional_escolhido.id,
                'nome': obj.adicional_escolhido.nome,
                'preco': str(obj.adicional_escolhido.preco_adicional)
            }
        return None


# ✅ NOVO: Serializer para Item do Pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    produto_imagem = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = [
            'id', 'produto', 'produto_nome', 'produto_imagem',
            'quantidade', 'preco_unitario', 'subtotal', 'observacoes'
        ]
        read_only_fields = ['subtotal']

    def get_produto_imagem(self, obj):
        if obj.produto.imagem_selecionada and obj.produto.imagem_selecionada.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.produto.imagem_selecionada.imagem.url)
        return None


# ✅ NOVO: Serializer para criar Pedido
class CriarPedidoSerializer(serializers.Serializer):
    nome_cliente = serializers.CharField(max_length=200)
    telefone = serializers.CharField(max_length=20)
    endereco = serializers.CharField(required=False, allow_blank=True)
    tipo_entrega = serializers.ChoiceField(choices=['delivery', 'retirada'])
    observacoes = serializers.CharField(required=False, allow_blank=True)
    itens = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )

    def validate_itens(self, value):
        if not value:
            raise serializers.ValidationError("O pedido deve ter pelo menos um item.")

        for item in value:
            if 'produto_id' not in item or 'quantidade' not in item:
                raise serializers.ValidationError(
                    "Cada item deve ter 'produto_id' e 'quantidade'."
                )
        return value

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')

        # Calcula totais
        subtotal = 0
        for item_data in itens_data:
            produto = MenuItem.objects.get(id=item_data['produto_id'])
            quantidade = item_data['quantidade']
            subtotal += produto.preco * quantidade

        # Define taxa de entrega
        taxa_entrega = 5.00 if validated_data['tipo_entrega'] == 'delivery' else 0
        total = subtotal + taxa_entrega

        # Cria o pedido
        pedido = Pedido.objects.create(
            nome_cliente=validated_data['nome_cliente'],
            telefone=validated_data['telefone'],
            endereco=validated_data.get('endereco', ''),
            tipo_entrega=validated_data['tipo_entrega'],
            observacoes=validated_data.get('observacoes', ''),
            subtotal=subtotal,
            taxa_entrega=taxa_entrega,
            total=total,
            status='pendente'
        )

        # Cria os itens do pedido
        for item_data in itens_data:
            produto = MenuItem.objects.get(id=item_data['produto_id'])
            ItemPedido.objects.create(
                pedido=pedido,
                produto=produto,
                quantidade=item_data['quantidade'],
                preco_unitario=produto.preco,
                observacoes=item_data.get('observacoes', '')
            )

        return pedido


# ✅ NOVO: Serializer para listar/visualizar Pedidos
class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    tipo_entrega_display = serializers.CharField(source='get_tipo_entrega_display', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'nome_cliente', 'telefone', 'endereco',
            'tipo_entrega', 'tipo_entrega_display',
            'subtotal', 'taxa_entrega', 'total',
            'status', 'status_display', 'observacoes',
            'data_pedido', 'data_atualizacao', 'itens'
        ]
        read_only_fields = ['data_pedido', 'data_atualizacao']