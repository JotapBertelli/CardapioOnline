from django.db import models

# Categorias do cardápio (ex: Bebidas, Lanches)
class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome

# Itens do cardápio (produtos disponíveis)
class Produto(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=6, decimal_places=2)
    disponivel = models.BooleanField(default=True)
    categoria = models.ForeignKey(Categoria, related_name='produtos', on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

# Itens do carrinho de compras
class ItemCarrinho(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome}"
