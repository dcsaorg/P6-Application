create table vessel (
    id serial primary key,
    name varchar(100) not null,
    imo decimal(7,0) not null,
    teu smallint not null
)