
-- Drop table

-- DROP TABLE public.ports;

CREATE TABLE ports (
                              id serial NOT NULL,
                              "name" varchar(150) NOT NULL,
                              un_country varchar(2) NOT NULL,
                              un_locode varchar(6) NOT NULL,
                              un_location varchar(3) NOT NULL,
                              CONSTRAINT ports_pk PRIMARY KEY (id),
                              CONSTRAINT ports_un UNIQUE (un_locode)
);
