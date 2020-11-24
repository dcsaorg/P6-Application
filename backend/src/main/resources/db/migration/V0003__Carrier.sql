CREATE TABLE carrier (
	id serial NOT NULL,
	smdg_code varchar(4) NOT NULL,
	name varchar(200) NOT NULL,
	valid_from date NOT NULL,
	website varchar(200) NULL,
	CONSTRAINT liner_code_pk PRIMARY KEY (id),
	CONSTRAINT liner_code_un UNIQUE (smdg_code)
);


