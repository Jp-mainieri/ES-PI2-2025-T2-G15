CREATE USER WEBAPP IDENTIFIED BY PI2Grupo15$$;
GRANT CREATE SESSION TO WEBAPP;

SELECT username, authentication_type
FROM dba_users WHERE username = 'WEBAPP';

ALTER USER WEBAPP
DEFAULT TABLESPACE DATA
TEMPORARY TABLESPACE TEMP;

ALTER USER WEBAPP QUOTA 100M ON DATA;

SELECT username, default_tablespace, temporary_tablespace
FROM dba_users
WHERE username = 'WEBAPP';

SELECT tablespace_name, bytes, max_bytes
FROM dba_ts_quotas
WHERE username = 'WEBAPP';


CREATE TABLE INSTITUICOES (
id_instituicao NUMBER PRIMARY KEY,
nome VARCHAR2(200) NOT NULL, 
id_PROFESSOR Number NOT NULL,
CONSTRAINT fk_instituicao_professor
FOREIGN KEY (id_professor) REFERENCES PROFESSORES(id_professor)

);

CREATE TABLE CURSOS (
id_curso NUMBER PRIMARY KEY,
nome VARCHAR2(100) NOT NULL,
codigo VARCHAR2(20) NOT NULL,
id_instituicao NUMBER NOT NULL,
CONSTRAINT fk_curso_instituicao
FOREIGN KEY (id_instituicao) REFERENCES INSTITUICOES(id_instituicao)
);

CREATE TABLE DISCIPLINAS (
id_disciplina NUMBER PRIMARY KEY,
nome VARCHAR2(100) NOT NULL,
sigla VARCHAR2(10) NOT NULL,
codigo VARCHAR2(20) UNIQUE NOT NULL,
periodo NUMBER,
id_curso NUMBER NOT NULL,
CONSTRAINT fk_disciplina_curso
FOREIGN KEY (id_curso) REFERENCES CURSOS(id_curso)
);

CREATE TABLE TURMAS (
id_turma NUMBER PRIMARY KEY,
nome VARCHAR2(100) NOT NULL,
codigo VARCHAR2(20),
turno VARCHAR2(10),
id_disciplina NUMBER NOT NULL,
CONSTRAINT fk_turma_disciplina
FOREIGN KEY (id_disciplina) REFERENCES DISCIPLINAS(id_disciplina)
);

CREATE TABLE PROFESSORES (
 id_professor NUMBER PRIMARY KEY,
 nome VARCHAR2(100) NOT NULL,
 telefone VARCHAR2(20),
 senha VARCHAR2(100),
 e_mail VARCHAR2(100) UNIQUE NOT NULL
);
/*
CREATE TABLE PROFESSORES_INSTITUICOES (
 id_professor NUMBER NOT NULL,
 id_instituicao NUMBER NOT NULL,
 PRIMARY KEY (id_professor, id_instituicao),
 CONSTRAINT fk_pi_professor FOREIGN KEY (id_professor) REFERENCES
PROFESSORES(id_professor),
 CONSTRAINT fk_pi_instituicao FOREIGN KEY (id_instituicao) REFERENCES
INSTITUICOES(id_instituicao)
);
*/

CREATE TABLE ALUNOS (
RA_aluno VARCHAR2(20) PRIMARY KEY,
nome VARCHAR2(100) NOT NULL,
matricula VARCHAR2(20) UNIQUE NOT NULL,
curso VARCHAR2(100),
data_nascimento DATE
);

CREATE TABLE COMPONENTE_NOTA (
id_componente NUMBER PRIMARY KEY,
nome VARCHAR2(50) NOT NULL,
sigla VARCHAR2(10),
descricao VARCHAR2(200),
id_disciplina NUMBER NOT NULL,
CONSTRAINT fk_comp_disciplina
FOREIGN KEY (id_disciplina) REFERENCES DISCIPLINAS(id_disciplina)
);

CREATE TABLE NOTA (
id_nota NUMBER PRIMARY KEY,
valor NUMBER(4, 2),
id_componente NUMBER NOT NULL,
RA_aluno VARCHAR2(20) NOT NULL,
CONSTRAINT fk_nota_componente
FOREIGN KEY (id_componente) REFERENCES COMPONENTE_NOTA(id_componente),
CONSTRAINT fk_nota_aluno
FOREIGN KEY (RA_aluno) REFERENCES ALUNOS(RA_aluno)
);

CREATE TABLE AUDITORIA (
id_auditoria NUMBER PRIMARY KEY,
data_hora TIMESTAMP DEFAULT SYSTIMESTAMP,
descricao VARCHAR2(500),
id_nota NUMBER,
CONSTRAINT fk_auditoria_nota
FOREIGN KEY (id_nota) REFERENCES NOTA(id_nota));
CREATE TABLE TURMAS_ALUNOS (
id_turma NUMBER NOT NULL,
RA_aluno VARCHAR2(20) NOT NULL,
PRIMARY KEY (id_turma, RA_aluno),
CONSTRAINT fk_ta_turma FOREIGN KEY (id_turma) REFERENCES TURMAS(id_turma),
CONSTRAINT fk_ta_aluno FOREIGN KEY (RA_aluno) REFERENCES ALUNOS(RA_aluno)
);

CREATE TABLE PROFESSORES_TURMAS (
id_professor NUMBER NOT NULL,
id_turma NUMBER NOT NULL,
PRIMARY KEY (id_professor, id_turma),
CONSTRAINT fk_pt_professor FOREIGN KEY (id_professor) REFERENCES
PROFESSORES(id_professor),
CONSTRAINT fk_pt_turma FOREIGN KEY (id_turma) REFERENCES TURMAS(id_turma)
);
COMMIT;