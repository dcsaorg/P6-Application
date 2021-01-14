-- Drop table

-- DROP TABLE public.terminals;

CREATE TABLE terminal
(
    id                serial       NOT NULL,
    port              integer      NOT NULL,
    smdg_code         varchar(10)  NOT NULL,
    terminal_name     varchar(150) NULL,
    terminal_operator varchar(200) NULL,
    CONSTRAINT terminal_pk PRIMARY KEY (id),
    CONSTRAINT terminal_key UNIQUE (port, smdg_code)
);

ALTER TABLE terminal
    ADD CONSTRAINT terminal_fk_port_id FOREIGN KEY (port) REFERENCES port (id);
