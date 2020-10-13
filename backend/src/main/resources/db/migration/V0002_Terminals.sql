
-- Drop table

-- DROP TABLE public.terminals;

CREATE TABLE terminals (
                                  id serial NOT NULL,
                                  un_locode varchar(10) NOT NULL,
                                  smdg_code varchar(10) NOT NULL,
                                  terminal_name varchar(150) NULL,
                                  terminal_operator varchar(200) NULL,
                                  CONSTRAINT terminals_pk PRIMARY KEY (id),
                                  CONSTRAINT terminals_un UNIQUE (un_locode, smdg_code)
);

ALTER TABLE terminals ADD CONSTRAINT terminals_fk FOREIGN KEY (un_locode) REFERENCES ports(un_locode);
