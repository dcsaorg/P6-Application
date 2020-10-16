create type delay_type as enum (
    'SHIP Related',
    'SHORE Related',
    'CARGO Related',
    'Force Majeure',
    'Planned Events'
    );

create table delay_code
(
    id          serial       NOT NULL,
    smdg_code   varchar(4)   NOT NULL,
    name        varchar(150) NULL,
    delay_type  delay_type   NOT NULL,
    description varchar(200) NULL,
    CONSTRAINT delay_code_pk PRIMARY KEY (id),
    CONSTRAINT delay_code_key UNIQUE (smdg_code)
);