Projeto Integrador 2 — Engenharia de Software — PUC-Campinas

📚 Projeto NotaDez

O Projeto NotaDez é um sistema web voltado para docentes do ensino superior.

O objetivo é substituir o uso de planilhas genéricas por uma ferramenta própria, completa e integrada para gerenciamento de notas acadêmicas.

A aplicação permite ao professor:

Cadastrar instituições, cursos, disciplinas e turmas

Cadastrar alunos

Lançar notas por componentes (provas, trabalhos, atividades etc.)

Calcular automaticamente a média final de cada aluno na disciplina

👥 Integrantes da Equipe
Nome Completo	RA/Matrícula
Beatriz Leme	25015554
Giovanna Uchelli	25008818
João Pedro Panza	25006642
Laura Carvalho	25014543
Lucas Hosikawa	25014845

                                    ----------    Guia de instalação e execução em ambientes de testes    ----------            


INICIAR clonando o repositório do GitHub utilizando o comando git clone git clone <!--https://github.com/PI_II_ES_TIME_15.git  ARRUMAR--> no GitHub

ENTRAR na pasta do projeto e inserir o comando cd `repositorio ----`   

INSTALAR as dependendencias do projeto, com o Node.js instalado execute o comando `npm install`, o comando instala todas as dependencias listadas no package.json

Configuracao do ambiente (.env) - Criar um arquivo chamado .env na raiz do projeto com as variáveis necessárias para
- Conexao com o banco de dados Oracle via OCI Wallet 
- Caminhos para os arquivos da Wallet
- Outras variaveis internas do sistema 

Exemplo do .env
# Caminho para os arquivos Oracle Instant Client 
ORACLE_CLIENT_LIB=caminho/do/instantclient

# Caminhos da Wallet OCI 
TNS_ADMIN=caminho/da/wallet

# Credenciais do Banco
DB_USER=usuario
DB_PASSWORD=senha
DB_CONECTION_STRING=nome_da_string_no_tnsnames 

# Outras variaveis do projeto 
PORT=3000

Instalar o Oracle Instant Client

Baixe o Oracle Instant Client (módulos Basic ou Basic Lite):
https://www.oracle.com/database/technologies/instant-client.html

# Extraia o conteúdo para um diretório utilizando
 C:\oracle\instantclient_21_12

Adicione esse caminho à variável de ambiente ORACLE_CLIENT_LIB, dentro do .env.

É necessário adicionar o caminho do Instant Client ao PATH:
`Painel de Controle → Sistema → Configurações Avançadas → Variáveis de Ambiente → Path → Novo → C:\oracle\instantclient_21_12`

# Configurar a Oracle OCI Wallet (para banco na nuvem)
*Extraia os arquivos da Wallet para um diretório dedicado, por exemplo:*
C:\oracle\wallet
No arquivo .env, defina: TNS_ADMIN=C:\oracle\wallet

*Confirme que o diretório contém arquivos como*

- tnsnames.ora
- sqlnet.ora
- cwallet.sso

# Verificar a String de Conexão
*No arquivo tnsnames.ora da wallet, copie o nome da conexão (exemplo: DB2025_HIGH) e use no .env:*
DB_CONNECTION_STRING=DB2025_HIGH

# Executar o Projeto em Ambiente de Testes
*Rodar o servidor Node.js*
Backend em Node utilizar:
*npm start*

