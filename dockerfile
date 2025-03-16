# Passo 1: Usar uma imagem base com Node.js
FROM node:18-alpine

# Passo 2: Criar e definir o diretório de trabalho
WORKDIR /app

# Passo 3: Copiar package.json e package-lock.json para o container
COPY package*.json ./

# Passo 4: Instalar as dependências
RUN npm install

# Passo 5: Copiar o restante dos arquivos do projeto para o container
COPY . .

# Passo 6: Compilar o código TypeScript (se necessário)
RUN npm run build

# Passo 7: Expor a porta que o app vai rodar
EXPOSE 3000

# Passo 8: Definir o comando para rodar o app
CMD ["npm", "run", "start:prod"]
