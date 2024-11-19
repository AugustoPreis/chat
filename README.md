# Chat
Chat em tempo real

## Rodando o Projeto
- Certifique-se de ter um arquivo chamado `.env` nas pastas `frontend` e `backend`
- Eles devem conter as seguintes informações:

```
# .../frontend/.env

#Porta em que o frontend irá rodar
#Valor utilizado apenas em desenvolvimento
VITE_FRONTEND_PORT=4000

#Porta em que o backend irá rodar
#Deve ser o mesmo valor de PORT, localizado no .env do backend
VITE_BACKEND_PORT=3000 

#IP em que o backend irá rodar
#Evitar utilizar localhost, para o correto funcionamento do socket
#Ex: http://192.168.0.1
VITE_BACKEND_URL=seu_ip

```
```
# .../backend/.env

#Porta em que o backend irá rodar
#Deve ser o mesmo valor de VITE_FRONTEND_PORT, localizado no .env do frontend
PORT=3000

#Chave de encriptamento do Json WEB Token
JWT_SECRET=157ad8db5c86ff5e12b8614c0343e6b7d0fe43a6a021d00c818bbe0818f1fb44

#Dados do banco de dados
#Evitar alterar, o docker cria um banco com as informações abaixo
DB_HOST=localhost
DB_NAME=chat
DB_PASS=admin
DB_USER=postgres
DB_PORT=5432

#Chave de encriptamento, para criação de senhas no backend
AES_256_CBC_KEY=ec23c1979e04645892e4543ab7ad154da4e2241535b8e3b1c337fb16cea40e04
```
- Na pasta raiz do projeto, rodar o seguinte comando: `docker compose up --build`
- Após finalizar o build, o projeto deverá estar rodando na porta do backend, informada no `.env`
