create type message_direction as enum
    (
        'inbound',
        'outbound'
        );

create table message
(
    id           serial            not null,
    direction    message_direction not null,
    timestamp_id integer           not null,
    filename     varchar(255)      not null,
    payload      bytea             not null,

    constraint message_pk primary key (id),
    constraint message_fk_port_call_timestamp foreign key (timestamp_id) references port_call_timestamp (id)
);