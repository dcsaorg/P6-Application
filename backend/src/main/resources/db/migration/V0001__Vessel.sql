
-- Drop table

-- DROP TABLE public.vessel;

CREATE TABLE vessel (
	id serial NOT NULL,
	"name" varchar(100) NOT NULL,
	imo numeric(7) NOT NULL,
	teu int2 NOT NULL,
	service_name varchar NULL,
	CONSTRAINT vessel_pkey PRIMARY KEY (id),
	CONSTRAINT vessel_un UNIQUE (imo)
);

