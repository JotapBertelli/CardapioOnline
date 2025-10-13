# Etapa 1: Build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: Servidor Nginx para produção
FROM nginx:stable-alpine

# Copia os arquivos de build da etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# AQUI ESTÁ A LINHA FALTANDO:
# Copia o arquivo de configuração personalizado do Nginx para o container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]

