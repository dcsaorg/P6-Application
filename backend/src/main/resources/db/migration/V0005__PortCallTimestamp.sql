CREATE TABLE port_call_timestamp
(
    id               serial                   NOT NULL,
    vessel           integer                  NOT NULL,
    port_of_call     integer                  NOT NULL,
    port_previous    integer                  NOT NULL,
    port_next        integer                  NOT NULL,
    timestamp_type   port_call_timestamp_type NOT NULL,
    event_timestamp  timestamp with time zone NOT NULL,
    log_of_timestamp timestamp with time zone NOT NULL,
    direction        direction                NOT NULL,
    terminal         integer                  NOT NULL,
    location_id      varchar(255)             null,
    change_comment   varchar(512)             null,
    deleted          boolean                  NOT NULL DEFAULT false,
    CONSTRAINT message_pk PRIMARY KEY (id)
);

ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_vessel FOREIGN KEY (vessel) REFERENCES vessel (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_of_call FOREIGN KEY (port_of_call) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_previous FOREIGN KEY (port_previous) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_port_next FOREIGN KEY (port_next) REFERENCES port (id);
ALTER TABLE port_call_timestamp
    ADD CONSTRAINT message_fk_terminal FOREIGN KEY (terminal) REFERENCES terminal (id);
