# Imagem base mais segura e leve
FROM python:3.11-slim-bookworm

# Define variáveis de ambiente para o Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Define o diretório de trabalho
WORKDIR /app

# Cria um usuário e grupo não-root para rodar a aplicação por segurança
RUN addgroup --system app && adduser --system --group app

# Copia apenas o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY requirements.txt .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação para o diretório de trabalho
COPY . .

# Altera a propriedade dos arquivos para o usuário não-root
RUN chown -R app:app /app

# Muda para o usuário não-root
USER app

# Expõe a porta que o Gunicorn (servidor de produção) irá usar
EXPOSE 8000

# Comando para iniciar o servidor Gunicorn
# IMPORTANTE: Substitua 'your_project_name.wsgi:application' pelo caminho correto do seu arquivo wsgi.
# Exemplo: se o seu projeto se chama 'core', o comando seria 'core.wsgi:application'
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "your_project_name.wsgi:application"]
