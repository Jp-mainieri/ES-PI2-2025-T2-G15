-- Feito por Lucas Kendi Panini Hosikawa- 25014045

-- Criando o USER WEBAPP
CREATE USER WEBAPP IDENTIFIED BY PI2Grupo15$$;
GRANT CREATE SESSION TO WEBAPP;
GRANT CREATE TABLE TO WEBAPP;
GRANT CREATE SEQUENCE TO WEBAPP;
GRANT CREATE TRIGGER TO WEBAPP;

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

-- Tabelas do banco de dados

CREATE TABLE PROFESSORES (
 id_professor NUMBER PRIMARY KEY,
 nome VARCHAR2(100) NOT NULL,
 telefone VARCHAR2(20),
 senha VARCHAR2(100),
 email VARCHAR2(100) UNIQUE NOT NULL
);

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

CREATE TABLE ALUNOS (
RA_aluno VARCHAR2(20) PRIMARY KEY,
nome VARCHAR2(100) NOT NULL,
id_turma NUMBER NOT NULL,
CONSTRAINT fk_aluno_turma
FOREIGN KEY (id_turma) REFERENCES TURMAS(id_turma)
);

CREATE TABLE COMPONENTE_NOTA (
id_componente NUMBER PRIMARY KEY,
nome VARCHAR2(50) NOT NULL,
SIGLA VARCHAR2(5),
id_disciplina NUMBER NOT NULL,
CONSTRAINT fk_comp_disciplina
FOREIGN KEY (id_disciplina) REFERENCES DISCIPLINAS(id_disciplina) ON DELETE CASCADE
);

CREATE TABLE NOTA (
id_nota NUMBER PRIMARY KEY,
valor NUMBER(4, 2),
id_componente NUMBER NOT NULL,
RA_aluno VARCHAR2(20) NOT NULL,
CONSTRAINT fk_nota_componente
FOREIGN KEY (id_componente) REFERENCES COMPONENTE_NOTA(id_componente) ON DELETE CASCADE,
CONSTRAINT fk_nota_aluno
FOREIGN KEY (RA_aluno) REFERENCES ALUNOS(RA_aluno)
ON DELETE CASCADE
);

CREATE TABLE FORMULA_DISCIPLINA (
id_formula NUMBER PRIMARY KEY,
formula VARCHAR2(50),
id_disciplina NUMBER NOT NULL,
CONSTRAINT fk_formula_disciplina
  FOREIGN KEY (id_disciplina) REFERENCES DISCIPLINAS(id_disciplina) ON DELETE CASCADE
);

CREATE TABLE AUDITORIA (
id_auditoria NUMBER PRIMARY KEY,
data_hora TIMESTAMP DEFAULT SYSTIMESTAMP,
descricao VARCHAR2(500),
ID_PROFESSOR NUMBER NOT NULL,
ID_NOTA NUMBER,
CONSTRAINT fk_auditoria_professor
FOREIGN KEY (ID_PROFESSOR) REFERENCES PROFESSORES(ID_PROFESSOR),
CONSTRAINT fk_auditoria_nota
FOREIGN KEY (ID_NOTA) REFERENCES NOTA(ID_NOTA) ON DELETE SET NULL);

-- Sequencias para os TRIGGERS NOS IDS (AUTO INCREMENT)
CREATE SEQUENCE seq_instituicoes START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_cursos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_disciplinas START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_turmas START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_professores START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_componente_nota START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_nota START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_auditoria START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_formula_disciplina START WITH 1 INCREMENT BY 1;

-- TRIGGERS para o AUTO INCREMENT
CREATE OR REPLACE TRIGGER trg_professores_pk
BEFORE INSERT ON PROFESSORES
FOR EACH ROW
WHEN (NEW.id_professor IS NULL)
BEGIN
  SELECT seq_professores.NEXTVAL INTO :NEW.id_professor FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_instituicoes_pk
BEFORE INSERT ON INSTITUICOES
FOR EACH ROW
WHEN (NEW.id_instituicao IS NULL)
BEGIN
  SELECT seq_instituicoes.NEXTVAL INTO :NEW.id_instituicao FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_cursos_pk
BEFORE INSERT ON CURSOS
FOR EACH ROW
WHEN (NEW.id_curso IS NULL)
BEGIN
  SELECT seq_cursos.NEXTVAL INTO :NEW.id_curso FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_disciplinas_pk
BEFORE INSERT ON DISCIPLINAS
FOR EACH ROW
WHEN (NEW.id_disciplina IS NULL)
BEGIN
  SELECT seq_disciplinas.NEXTVAL INTO :NEW.id_disciplina FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_turmas_pk
BEFORE INSERT ON TURMAS
FOR EACH ROW
WHEN (NEW.id_turma IS NULL)
BEGIN
  SELECT seq_turmas.NEXTVAL INTO :NEW.id_turma FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_componente_nota_pk
BEFORE INSERT ON COMPONENTE_NOTA
FOR EACH ROW
WHEN (NEW.id_componente IS NULL)
BEGIN
  SELECT seq_componente_nota.NEXTVAL INTO :NEW.id_componente FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_nota_pk
BEFORE INSERT ON NOTA
FOR EACH ROW
WHEN (NEW.id_nota IS NULL)
BEGIN
  SELECT seq_nota.NEXTVAL INTO :NEW.id_nota FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_auditoria_pk
BEFORE INSERT ON AUDITORIA
FOR EACH ROW
WHEN (NEW.id_auditoria IS NULL)
BEGIN
  SELECT seq_auditoria.NEXTVAL INTO :NEW.id_auditoria FROM DUAL;
END;

CREATE OR REPLACE TRIGGER trg_formula_disciplina_pk
BEFORE INSERT ON FORMULA_DISCIPLINA
FOR EACH ROW
WHEN (NEW.id_formula IS NULL)
BEGIN
  SELECT seq_formula_disciplina.NEXTVAL INTO :NEW.id_formula FROM DUAL;
END;

-- TRIGGERS para a atualização automática na auditoria, a partir da inserção/edição de notas

CREATE OR REPLACE TRIGGER trg_auditoria_nota_insert
AFTER INSERT ON NOTA
FOR EACH ROW
DECLARE
    v_prof  NUMBER;
    v_desc  VARCHAR2(500);
BEGIN
    SELECT i.id_professor
      INTO v_prof
      FROM ALUNOS a
      JOIN TURMAS t ON t.id_turma = a.id_turma
      JOIN DISCIPLINAS d ON d.id_disciplina = t.id_disciplina
      JOIN CURSOS c ON c.id_curso = d.id_curso
      JOIN INSTITUICOES i ON i.id_instituicao = c.id_instituicao
     WHERE a.RA_aluno = :NEW.RA_aluno;

    v_desc :=
        'Nota inserida: RA: ' || :NEW.RA_aluno ||
        ', componente:  ' || :NEW.id_componente ||
        ', valor: ' || :NEW.valor;

    INSERT INTO AUDITORIA (descricao, id_professor, id_nota)
    VALUES (v_desc, v_prof, :NEW.id_nota);
END;

CREATE OR REPLACE TRIGGER trg_auditoria_nota_upd
AFTER UPDATE ON NOTA
FOR EACH ROW
DECLARE
    v_prof  NUMBER;
    v_desc  VARCHAR2(500);
BEGIN
    SELECT i.id_professor
      INTO v_prof
      FROM ALUNOS a
      JOIN TURMAS t ON t.id_turma = a.id_turma
      JOIN DISCIPLINAS d ON d.id_disciplina = t.id_disciplina
      JOIN CURSOS c ON c.id_curso = d.id_curso
      JOIN INSTITUICOES i ON i.id_instituicao = c.id_instituicao
     WHERE a.RA_aluno = :OLD.RA_aluno;

    v_desc :=
        'Nota atualizada: RA: ' || :OLD.RA_aluno ||
        ', componente: ' || :OLD.id_componente ||
        ', de: ' || :OLD.valor ||
        ' para: ' || :NEW.valor;

    INSERT INTO AUDITORIA (descricao, id_professor, id_nota)
    VALUES (v_desc, v_prof, :OLD.id_nota);
END;

COMMIT;