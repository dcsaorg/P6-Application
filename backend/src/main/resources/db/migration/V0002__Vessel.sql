
-- Drop table

-- DROP TABLE public.vessel;

CREATE TABLE vessel
(
	id serial NOT NULL,
	name varchar(100) NOT NULL,
	imo numeric(7) NOT NULL,
	teu smallint NOT NULL,
	service_name varchar NULL,
	CONSTRAINT vessel_pk PRIMARY KEY (id),
	CONSTRAINT vessel_uq_imo UNIQUE (imo)
);

