### 2. Configuração do Backend (Django)
**Navegue até a pasta do backend:**
``` bash
cd backend
```

### 2. Ative o ambiente virtual
# ou
.venv\Scripts\activate  

**Instale as dependências do Python:**
``` bash
pip install -r requirements.txt
```
**Execute as migrações do banco de dados:**
``` bash
python manage.py makemigrations
python manage.py migrate
```

**Crie um superusuário (opcional):**
``` bash
python manage.py createsuperuser
```
**Inicie o servidor Django:**
``` bash
python manage.py runserver
```
### 3. Configuração do Frontend (React)
**Abra um novo terminal e navegue até a pasta do frontend:**
``` bash
cd frontend
```
**Instale as dependências do Node.js:**
``` bash
npm install
```
**Inicie o servidor de desenvolvimento do React:**
``` bash
npm start
```
O frontend estará rodando em `http://localhost:3000`
### 4. Acessando a aplicação
- **Frontend (Interface do usuário):** [http://localhost:3000](http://localhost:3000)
- **Backend (API Django):** [http://localhost:8000](http://localhost:8000)
- **Admin Django:** [http://localhost:8000/admin](http://localhost:8000/admin) (se você criou um superusuário)

### 📝 Comandos úteis
**Para o Django (backend):**
``` bash
# Ver rotas disponíveis
python manage.py show_urls

# Executar testes
python manage.py test

# Coletar arquivos estáticos
python manage.py collectstatic
```
**Para o React (frontend):**
``` bash
# Build de produção
npm run build

# Executar testes
npm test
```
### 🔧 Solução de problemas comuns
1. **Erro de porta ocupada:** Use `python manage.py runserver 8001` para usar outra porta
2. **Problemas de CORS:** Verifique se o django-cors-headers está configurado corretamente
3. **Problemas de dependências:** Delete `node_modules` e , depois execute `npm install` `package-lock.json`

