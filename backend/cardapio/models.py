from django.db import models

class MenuItem(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    categoria = models.CharField(max_length=50)
    disponivel = models.BooleanField(default=True)
    imagem = models.ImageField(upload_to='menu_images/', blank=True, null=True)

    def __str__(self):
        return self.nome

class CartItem(models.Model):
    produto = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    data_adicao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantidade} x {self.produto.nome}'