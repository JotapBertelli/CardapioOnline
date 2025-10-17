from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MenuItem, CartItem, BancoDeImagens, Pedido
from .serializers import (
    MenuItemSerializer,
    CartItemSerializer,
    BancoDeImagensSerializer,
    PedidoSerializer,
    CriarPedidoSerializer
)


class BancoDeImagensViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BancoDeImagens.objects.all()
    serializer_class = BancoDeImagensSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('nome')
    serializer_class = MenuItemSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_item = serializer.save(final_price=None)
        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_201_CREATED
        )


# ✅ NOVO: ViewSet para Pedidos
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-data_pedido')
    serializer_class = PedidoSerializer

    def get_serializer_class(self):
        """Usa serializer diferente para criação"""
        if self.action == 'create':
            return CriarPedidoSerializer
        return PedidoSerializer

    def create(self, request, *args, **kwargs):
        """Cria um pedido e limpa o carrinho"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido = serializer.save()

        # ✅ Limpa o carrinho após criar o pedido
        CartItem.objects.all().delete()

        # Retorna o pedido criado
        pedido_serializer = PedidoSerializer(pedido, context={'request': request})
        return Response(pedido_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def atualizar_status(self, request, pk=None):
        """Atualiza apenas o status do pedido"""
        pedido = self.get_object()
        novo_status = request.data.get('status')

        if novo_status not in dict(Pedido.STATUS_CHOICES):
            return Response(
                {'erro': 'Status inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido.status = novo_status
        pedido.save()

        serializer = self.get_serializer(pedido)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pendentes(self, request):
        """Retorna apenas pedidos pendentes ou em preparo"""
        pedidos = self.queryset.filter(
            status__in=['pendente', 'em_preparo']
        )
        serializer = self.get_serializer(pedidos, many=True)
        return Response(serializer.data)