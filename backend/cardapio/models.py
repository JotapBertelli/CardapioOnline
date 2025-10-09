# seu_app/models.py

from django.db import models
from django.utils.html import format_html # Vamos usar isso no admin

# ✅ 1. NOVO MODELO PARA O BANCO DE IMAGENS
class BancoDeImagens(models.Model):
    titulo = models.CharField(max_length=100, help_text="Um nome descritivo para a imagem, ex: 'Foto do Hambúrguer Clássico'")
    imagem = models.ImageField(upload_to='banco_de_imagens/')

    def __str__(self):
        return self.titulo

    # Função para mostrar a miniatura no admin
    def ver_imagem(self):
        if self.imagem:
            return format_html(f'<img src="{self.imagem.url}" width="100" />')
        return "Sem imagem"
    ver_imagem.short_description = 'Miniatura'


class MenuItem(models.Model):
    CATEGORIA_CHOICES = [
        ('entradas', 'Entradas'),
        ('porcoes', 'Porções'),
        ('pratos_quentes', 'Pratos Quentes'),
        ('bebidas', 'Bebidas'),
        ('bebidas_alcoolicas', 'Bebidas Alcoólicas'),
        ('drinks', 'Drinks'),
        ('sobremesas', 'Sobremesas'),
    ]

    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)

    categoria = models.CharField(
        max_length=50,
        choices=CATEGORIA_CHOICES,
        default='pratos_quentes'
    )

    disponivel = models.BooleanField(default=True)

    # ❌ 2. CAMPO ANTIGO COMENTADO/REMOVIDO
    # imagem = models.ImageField(upload_to='menu_images/', blank=True, null=True)

    # ✅ 3. NOVO CAMPO QUE SE CONECTA AO BANCO DE IMAGENS
    imagem_selecionada = models.ForeignKey(
        BancoDeImagens,
        on_delete=models.SET_NULL, # Se a imagem for deletada do banco, o campo no prato fica nulo
        null=True,
        blank=True,
        verbose_name="Imagem do Banco"
    )

    def __str__(self):
        return self.nome

# O modelo CartItem não precisa de alterações
class CartItem(models.Model):
    produto = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    addons = models.TextField(blank=True, null=True, help_text="Adicionais escolhidos, ex: Limão e Gelo")
    final_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True,
                                      help_text="Preço do produto + adicionais")
    data_adicao = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.final_price is None:
            self.final_price = self.produto.preco
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.quantidade} x {self.produto.nome}'