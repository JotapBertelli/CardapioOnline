from rest_framework import viewsets, status

from rest_framework.response import Response
from .models import MenuItem, CartItem, BancoDeImagens
from .serializers import MenuItemSerializer, CartItemSerializer, BancoDeImagensSerializer

class BancoDeImagensViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BancoDeImagens.objects.all()
    serializer_class = BancoDeImagensSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('nome')
    serializer_class = MenuItemSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    # Sobrescrevendo create para calcular final_price corretamente
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Cria o item do carrinho
        cart_item = serializer.save(final_price=None)  # o save() do modelo calcula final_price

        # Serializa o objeto completo para retorno
        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_201_CREATED
        )
