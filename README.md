# CardapioOnline

CardapioOnline é uma aplicação para gerenciamento e visualização de cardápios online, com backend em Python (Flask) e frontend em React. Este projeto permite visualizar produtos, categorias e integrar o backend via API REST.

---

## Estrutura do Projeto

O projeto possui a seguinte organização:

CardapioOnline/
├── backend/ # Código do backend (Python)
│ ├── app.py # Arquivo principal do backend
│ ├── routes.py # Rotas da API
│ ├── models.py # Modelos de dados
│ └── requirements.txt
├── frontend/ # Código do frontend (React)
│ ├── src/
│ │ ├── index.js
│ │ └── pages/
│ │ └── MenuPage.js
│ └── package.json
├── README.md # Este arquivo


---

## Pré-requisitos

Para executar o projeto, você precisa ter instalado em sua máquina:

- Python 3.10 ou superior
- Node.js 18 ou superior
- NPM ou Yarn
- MySQL (ou outro banco de dados compatível)
- Git

---

## Configuração do Projeto

### Backend


### Entre na pasta do backend:

```bash

cd backend

```
### Crie um ambiente virtual:

```bash

python -m venv venv

```
## Ative o ambiente virtual:

### Windows:
```bash

venv\Scripts\activate
```

### Linux / macOS:
```bash

source venv/bin/activate
```

## Instale as dependências:
```bash

pip install -r requirements.txt
```

 ### Configure as variáveis de ambiente criando um arquivo .env na pasta backend com o seguinte conteúdo (ajuste de acordo com seu banco de dados):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cardapioonline
SECRET_KEY=sua_chave_secreta
```

## Execute o backend:
```bash

python app.py
```

## Frontend

### Entre na pasta do frontend:
```bash

cd frontend
```

## Instale as dependências:
```bash

npm install
```
# ou
```bash

yarn install
```

## Configure as variáveis de ambiente criando um arquivo .env na pasta frontend:
```env
REACT_APP_API_URL=http://localhost:5000
```

Execute o frontend:
```bash

npm start
```
# ou
```bash

yarn start
```

# Funcionalidades

### - Visualização de cardápios online

### - Gerenciamento de produtos e categorias

### - Integração entre backend e frontend via API REST e filtragem de produtos

### - Estrutura modular para fácil manutenção e expansão


# Scripts Úteis

## Backend:
```env
pip install -r requirements.txt
python app.py
```

## Frontend:
```env
npm install
npm start
```
Observações

Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

Ajuste as variáveis de ambiente conforme a sua configuração local.

Para deploy em produção, configure a porta do backend, otimizações do React e segurança do servidor.

Contato

João Pedro Bertelli
📧 jpbertelli10@gmail.com