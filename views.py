from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MenuItem, CartItem
from .serializers import MenuItemSerializer, CartItemSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('nome')
    serializer_class = MenuItemSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    @action(detail=False, methods=['post'], url_path='adicionar')
    def adicionar_ao_carrinho(self, request):
        menu_item_id = request.data.get('menu_item_id')
        if not menu_item_id:
            return Response({'erro': 'menu_item_id não foi fornecido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            menu_item = MenuItem.objects.get(id=menu_item_id)
        except MenuItem.DoesNotExist:
            return Response({'erro': 'Item do menu não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(produto=menu_item)

        if not created:
            cart_item.quantidade += 1
            cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='remover')
    def remover_do_carrinho(self, request, pk=None):
        try:
            cart_item = CartItem.objects.get(pk=pk)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'erro': 'Item do carrinho não encontrado'}, status=status.HTTP_404_NOT_FOUND)