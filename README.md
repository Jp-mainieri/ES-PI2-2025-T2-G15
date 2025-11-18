<!--Feito por Lucas Kendi Panini Hosikawa - 25014845 -->
# Projeto Integrador 2 — Engenharia de Software — PUC-Campinas

![alt text](img/image.png)

## 📚 Projeto NotaDez

O Projeto NotaDez é um sistema web voltado para docentes do ensino superior.


O objetivo é substituir o uso de planilhas genéricas por uma ferramenta própria, completa e integrada para gerenciamento de notas acadêmicas.

A aplicação permite ao professor:

Cadastrar instituições, cursos, disciplinas e turmas

Cadastrar alunos

Lançar notas por componentes (provas, trabalhos, atividades etc.)

Calcular automaticamente a média final de cada aluno na disciplina

👥 Integrantes da Equipe
- Nome Completo	    RA

- Beatriz Leme	    25015554 
- Giovanna Uchelli  25008818 
- João Pedro Panza Mainieri  25006642 
- Laura Carvalho	25014543 
- Lucas Hosikawa	25014845  

## Guia de instalação e execução em ambientes de testes       


Abaixo seguem todas as instruções necessárias para baixar, configurar e executar o projeto localmente.


INICIAR clonando o repositório do GitHub utilizando o comando `git clone https://github.com/Jp-mainieri/PI_II_ES_TIME_15.git` no terminal 

ENTRAR na pasta do projeto inserindo o comando `cd (path para o repositorio)`  

INSTALAR as dependendencias do projeto, com o Node.js instalado execute o comando `npm install`, o comando instala todas as dependencias listadas no package.json

### Configurar a Oracle OCI Wallet
`oracle/Wallet_jpDB01`

*Confirme se o diretório contém arquivos como*

- tnsnames.ora
- sqlnet.ora
- cwallet.sso


### ORACLE INSTANT CLIENT
Instalar o Oracle Instant Client

Baixe o Oracle Instant Client (módulos Basic ou Basic Lite):
https://www.oracle.com/database/technologies/instant-client.html

-- Extraia o conteúdo para um diretório
*EX:* C:\oracle\instantclient_23_9

#### No sqlnet.ora:

*Confirme que na sessão DIRECTORY="" tenha o caminho para a sua wallet*
*EX:* 
`WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="C:/oracle/Wallet_JPDB01")))
SSL_SERVER_DN_MATCH=yes`

### .ENV

Configuração do ambiente (.env) - Criar um arquivo chamado .env na raiz do projeto com as variáveis necessárias para
- Conexão com o banco de dados Oracle via OCI Wallet 
- Caminhos para os arquivos da Wallet
- Outras variáveis internas do sistema 

#### Exemplo do .env

```.dotenv
#Caminho para os arquivos Oracle Instant Client
ORACLE_LIB_DIR=caminho/do/instantclient

#Caminhos da Wallet OCI
ORACLE_WALLET_DIR=caminho/da/wallet

#Credenciais do Banco
ORACLE_USER=WEBAPP
ORACLE_PASSWORD=PI2Grupo15$$
ORACLE_CONNECT_STRING=joaopedromainieridatabase01_high
```


### Executar o Projeto em Ambiente de Testes

*Rodar o servidor Node.js*
Backend em Node utilizar:
`npm run start`
Abrir o arquivo `Pages/index.html` (Se tiver, utilizar o live server para rodar no navegador)
