alter table message
    add column transfer_id varchar(255) null,
    add column status varchar(255) null,
    add column detail varchar(512) null,

    add constraint message_uq_transfer_id unique (transfer_id);