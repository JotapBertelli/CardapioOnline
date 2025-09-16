from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Produto, ItemCarrinho
from .serializers import ProdutoSerializer, ItemCarrinhoSerializer

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class CarrinhoViewSet(viewsets.ViewSet):
    def list(self, request):
        itens = ItemCarrinho.objects.all()
        serializer = ItemCarrinhoSerializer(itens, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def adicionar(self, request):
        produto_id = request.data.get("produto_id")
        quantidade = int(request.data.get("quantidade", 1))
        item, created = ItemCarrinho.objects.get_or_create(produto_id=produto_id)
        if not created:
            item.quantidade += quantidade
        else:
            item.quantidade = quantidade
        item.save()
        return Response(ItemCarrinhoSerializer(item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def remover(self, request):
        produto_id = request.data.get("produto_id")
        try:
            item = ItemCarrinho.objects.get(produto_id=produto_id)
            item.delete()
            return Response({"message":"item removido"})
        except ItemCarrinho.DoesNotExist:
            return Response({"error":"item não encontrado"}, status=status.HTTP_404_NOT_FOUND)
