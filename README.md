# 🍔 Cardápio Online  

Um sistema de **cardápio digital completo**, com **painel administrativo em Django** e **interface moderna em React**.  
O objetivo é permitir que estabelecimentos gerenciem seus produtos de forma simples e apresentem aos clientes um cardápio online bonito e funcional.

## 📘 Índice
1. Sobre o Projeto  
2. Tecnologias Utilizadas  
3. Como Executar o Projeto  
   - Opção 1: Com Docker (Recomendado)  
   - Opção 2: Execução Manual  
4. Comandos Úteis  
5. Solução de Problemas  
6. Estrutura do Projeto  

## ✨ Sobre o Projeto  
O **Cardápio Online** foi criado para modernizar o processo de exibição e gerenciamento de cardápios.  
Com ele, é possível **cadastrar produtos, categorias e imagens**, e **gerenciar tudo em um painel administrativo**, enquanto o cliente visualiza tudo em uma interface web leve e reativa.  
O sistema é dividido em dois módulos principais:  
- **Backend (API REST)** → Django + Django REST Framework  
- **Frontend (SPA)** → React + Node.js  

## 🚀 Tecnologias Utilizadas  
**Backend:** Python, Django, Django REST Framework  
**Frontend:** React, Node.js  
**Banco de Dados:** SQLite3 (padrão)  
**Containerização:** Docker, Docker Compose  
**Servidor de Produção:** Nginx  

## 💻 Como Executar o Projeto  
Você pode executar o projeto de duas formas: **com Docker (recomendado)** ou **manualmente**.

### ✅ Opção 1: Com Docker (Recomendado)  
#### Pré-requisitos  
- Docker  
- Docker Compose  

#### Passos  
Clone o repositório:  
```bash

git clone <url-do-seu-repositorio>
```
```bash

cd <nome-da-pasta-do-projeto>
```

#### Construa as imagens e inicie os containers:
```bash

docker-compose up --build
```

# Acesse a aplicação:

### Frontend: http://localhost:3000

### Backend (API): http://localhost:8000

### Admin Django: http://localhost:8000/admin

# Para parar a aplicação:

Ctrl + C
```bash

docker-compose down
```

# 🔧 Opção 2: Execução Manual
## Pré-requisitos

### Python 3.11+ e pip

### Node.js 18+ e npm

## Configuração do Backend (Django)

Navegue até a pasta do backend:

```bash

cd backend
```

### Crie e ative o ambiente virtual:
```bash

python -m venv .venv
.venv\Scripts\activate  # Windows
```

# ou
``` bash

source .venv/bin/activate  # Linux/macOS
```

## Instale as dependências:

``` bash

pip install -r requirements.txt
```

Execute as migrações:
``` bash

python manage.py makemigrations
python manage.py migrate
```

### Crie um superusuário (opcional):
``` bash

python manage.py createsuperuser
```

### Inicie o servidor:
``` bash

python manage.py runserver
```
# Configuração do Frontend (React)

### Abra outro terminal e navegue até a pasta do frontend:
```bash

cd frontend
```

## Instale as dependências:
```bash

npm install
```

## Inicie o servidor de desenvolvimento:
```

npm start
```

O frontend estará disponível em: http://localhost:3000

🌐 Acessando a Aplicação

Frontend (Interface do Usuário): http://localhost:3000

Backend (API Django): http://localhost:8000

Admin Django: http://localhost:8000/admin

📝 Comandos Úteis

Backend (Django):

# Ver rotas disponíveis
python manage.py show_urls

# Executar testes
python manage.py test

# Coletar arquivos estáticos (para produção)
python manage.py collectstatic


Frontend (React):

# Criar build otimizada para produção
npm run build

# Executar testes
npm test

🛠️ Solução de Problemas

Erro de porta ocupada:
Use outra porta para rodar o servidor.

python manage.py runserver 8001


Problemas de CORS:
Verifique se o django-cors-headers está configurado corretamente no settings.py, permitindo a origem do frontend (http://localhost:3000).

Problemas de dependências no React:
Remova node_modules e package-lock.json, depois reinstale:

rm -rf node_modules package-lock.json
npm install


Erro com ImageField:
Certifique-se de ter o Pillow instalado:

pip install Pillow

📂 Estrutura do Projeto
CardapioOnline/
│
├── backend/
│   ├── cardapio/
│   ├── manage.py
│   ├── requirements.txt
│   └── .venv/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── public/
│
├── docker-compose.yml
└── README.md

💬 Autor

Desenvolvido por João Pedro Bertelli 🚀