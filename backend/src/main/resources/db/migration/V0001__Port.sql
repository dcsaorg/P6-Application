
CREATE TABLE port
(
    id          serial       NOT NULL,
    name        varchar(150) NOT NULL,
    un_country  varchar(2)   NOT NULL,
    un_locode   varchar(6)   NOT NULL,
    un_location varchar(3)   NOT NULL,
    timezone    varchar(40)  null,

    constraint port_pk primary key (id),
    constraint port_uq_un_locode unique (un_locode)
);
