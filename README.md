# ES-PI2-2025-T2-G15
Projeto Integrador 2 do curso de engenharia de software da PUC-Campinas - 

Projeto NotaDez é um sistema web focado em docentes do ensino superior.
O projeto visa substituir o uso de planilhas genéricas por uma ferramenta particular e única para o gerenciamento de notas.
A aplicação permite ao professor cadastrar suas instituições, cursos, disciplinas, turmas, alunos, lançar notas por componentes (provas, trabalhos, etc.) e calcular automaticamente a média final do aluno na disciplina.

## 👥 Integrantes da Equipe

| Nome Completo | RA/Matrícula   |
| -----------------------------  |
| **[Beatriz Leme    ]**    | 25015554 | 
| **[Giovanna Uchelli]**    | 25008818 | 
| **[João Pedro Panza]**    | 25006642 | 
| **[Laura Carvalho  ]**    | 25014543 | 
| **[Lucas Hosikawa  ]**    | 25014845 |

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

No Windows, é necessário adicionar o caminho do Instant Client ao PATH: