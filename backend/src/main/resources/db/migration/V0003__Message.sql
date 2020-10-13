
-- Drop table

-- DROP TABLE message;

CREATE TABLE message (
                                id serial NOT NULL,
                                vessel int4 NOT NULL,
                                port_approach int4 NOT NULL,
                                port_from int4 NOT NULL,
                                port_next int4 NOT NULL,
                                timestamp_type varchar(30) NOT NULL,
                                event_timestamp timestamp NOT NULL,
                                message_timestamp timestamp NOT NULL,
                                direction varchar(3) NOT NULL,
                                terminal int4 NOT NULL,
                                CONSTRAINT message_pk PRIMARY KEY (id)
);

ALTER TABLE message ADD CONSTRAINT message_fk FOREIGN KEY (vessel) REFERENCES vessel(id);
ALTER TABLE message ADD CONSTRAINT message_fk_1 FOREIGN KEY (port_approach) REFERENCES ports(id);
ALTER TABLE message ADD CONSTRAINT message_fk_2 FOREIGN KEY (port_from) REFERENCES ports(id);
ALTER TABLE message ADD CONSTRAINT message_fk_3 FOREIGN KEY (port_next) REFERENCES ports(id);
ALTER TABLE message ADD CONSTRAINT message_fk_4 FOREIGN KEY (terminal) REFERENCES terminals(id);
