CREATE TABLE usuarios (
	id uuid NOT NULL PRIMARY KEY,
	nome varchar(100) NOT NULL,
	login varchar(100) NOT NULL,
	senha TEXT NOT NULL,
	ativo bool NOT NULL DEFAULT TRUE,
	adm bool NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX uk_usuarios_login_ativo_true ON usuarios USING btree(login, ativo) WHERE ativo IS TRUE;

CREATE TABLE chats (
	id uuid NOT NULL PRIMARY KEY,
	criador uuid NOT NULL REFERENCES usuarios,
	nome varchar(100) NOT NULL,
	qtd_usuarios_ativos int NOT NULL,
	qtd_maxima_usuarios int NOT NULL,
	privado bool NOT NULL DEFAULT FALSE
);

CREATE TABLE mensagens (
	id uuid NOT NULL PRIMARY KEY,
	usuario uuid NOT NULL REFERENCES usuarios,
	chat uuid NOT NULL REFERENCES chats,
	descricao varchar(250) NOT NULL,
	data_cadastro timestamp NOT NULL DEFAULT current_timestamp,
	ativo bool NOT NULL DEFAULT TRUE
);

CREATE TABLE public.historico (
	id uuid NOT NULL PRIMARY KEY,
	usuario uuid NOT NULL REFERENCES usuarios,
	chat uuid NOT NULL REFERENCES usuarios,
	tipo varchar(20) NOT NULL,
	descricao varchar(100) NULL,
	data_cadastro timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION usuarios_ativos_chat(pr_chat uuid)
RETURNS int
LANGUAGE plpgsql
AS $function$
DECLARE
	qtd int;
BEGIN
  SELECT
		COUNT(DISTINCT historico.usuario)
  INTO qtd
  FROM historico
  WHERE historico.chat = pr_chat
    AND historico.tipo = 'conectou'
    AND NOT EXISTS (
        SELECT
					TRUE
        FROM historico historico2
        WHERE historico2.usuario = historico.usuario
          AND historico2.chat = historico.chat
          AND historico2.data_cadastro > historico.data_cadastro
          AND historico2.tipo = 'desconectou'
    );

	IF (qtd IS NULL OR qtd < 0) THEN
		qtd := 0;
	END IF;

	RETURN qtd;
END;
$function$;