CREATE TABLE port_call_timestamp
(
    id              serial                   NOT NULL,
    vessel          integer                  NOT NULL,
    port_approach   integer                  NOT NULL,
    port_from       integer                  NOT NULL,
    port_next       integer                  NOT NULL,
    timestamp_type  port_call_timestamp_type NOT NULL,
    event_timestamp timestamp with time zone NOT NULL,
    log_of_call     timestamp with time zone NOT NULL,
    direction       direction                NOT NULL,
    terminal        integer                  NOT NULL,
    location_id     varchar(255)             null,
    change_comment  varchar(512)             null,
    deleted         boolean                  NOT NULL DEFAULT false,
    CONSTRAINT message_pk PRIMARY KEY (id)
);

ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_vessel FOREIGN KEY (vessel) REFERENCES vessel (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_approach FOREIGN KEY (port_approach) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_from FOREIGN KEY (port_from) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_next FOREIGN KEY (port_next) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_terminal FOREIGN KEY (terminal) REFERENCES terminal (id);
