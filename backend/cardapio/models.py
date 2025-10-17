# seu_app/models.py

from django.db import models
from django.utils.html import format_html
from django.utils import timezone  # ✅ ADICIONADO

# ✅ 1. MODELO PARA O BANCO DE IMAGENS
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

    # ✅ CAMPO QUE SE CONECTA AO BANCO DE IMAGENS
    imagem_selecionada = models.ForeignKey(
        BancoDeImagens,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Imagem do Banco"
    )

    def __str__(self):
        return self.nome


# ✅ NOVO MODELO: Adicional do Produto (opções de personalização)
class AdicionalProduto(models.Model):
    produto = models.ForeignKey(
        MenuItem,
        on_delete=models.CASCADE,
        related_name='adicionais'
    )
    nome = models.CharField(max_length=100, help_text="Ex: Copo com gelo, Limão espremido")
    preco_adicional = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        help_text="Valor extra (0 se for grátis)"
    )
    ordem = models.IntegerField(default=0, help_text="Ordem de exibição")

    class Meta:
        ordering = ['ordem', 'nome']
        verbose_name = 'Adicional do Produto'
        verbose_name_plural = 'Adicionais dos Produtos'

    def __str__(self):
        preco_str = f"+R$ {self.preco_adicional}" if self.preco_adicional > 0 else "Grátis"
        return f"{self.nome} ({preco_str})"


class CartItem(models.Model):
    produto = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    adicional_escolhido = models.ForeignKey(
        'AdicionalProduto',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Adicional selecionado pelo cliente"
    )
    observacoes = models.TextField(blank=True, null=True, help_text="Observações extras do cliente")
    final_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True,
                                      help_text="Preço do produto + adicional")
    data_adicao = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calcula preço: produto + adicional (se houver)
        if self.final_price is None:
            self.final_price = self.produto.preco
            if self.adicional_escolhido:
                self.final_price += self.adicional_escolhido.preco_adicional
        super().save(*args, **kwargs)

    def __str__(self):
        adicional_str = f" - {self.adicional_escolhido.nome}" if self.adicional_escolhido else ""
        return f'{self.quantidade} x {self.produto.nome}{adicional_str}'


# ✅ NOVO MODELO: Pedido
class Pedido(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('em_preparo', 'Em Preparo'),
        ('pronto', 'Pronto'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]

    TIPO_ENTREGA_CHOICES = [
        ('delivery', 'Delivery'),
        ('retirada', 'Retirada no Local'),
    ]

    # Informações do cliente
    nome_cliente = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)
    endereco = models.TextField(blank=True, null=True)

    # Tipo de pedido
    tipo_entrega = models.CharField(
        max_length=20,
        choices=TIPO_ENTREGA_CHOICES,
        default='retirada'
    )

    # Valores
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    taxa_entrega = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    # Status e observações
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente'
    )
    observacoes = models.TextField(blank=True, null=True)

    # Datas
    data_pedido = models.DateTimeField(default=timezone.now)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-data_pedido']
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

    def __str__(self):
        return f"Pedido #{self.id} - {self.nome_cliente} - {self.get_status_display()}"


# ✅ NOVO MODELO: Item do Pedido
class ItemPedido(models.Model):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='itens'
    )
    produto = models.ForeignKey('MenuItem', on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    observacoes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Calcula o subtotal automaticamente
        self.subtotal = self.preco_unitario * self.quantidade
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome}"