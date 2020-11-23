
-- Drop table

-- DROP TABLE public.carrier_vessel_port_history;

CREATE TABLE public.carrier_vessel_port_history (
                                                    id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
                                                    vessel int4 NOT NULL,
                                                    port_of_call int4 NOT NULL,
                                                    port_previous int4 NOT NULL,
                                                    port_next int4 NOT NULL,
                                                    terminal int4 NOT NULL,
                                                    carrier int4 NOT NULL,
                                                    last_update timestamp NOT NULL DEFAULT now()
);

ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT carrier_history_fk FOREIGN KEY (carrier) REFERENCES carrier(id);
ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT port_call_history_fk FOREIGN KEY (port_of_call) REFERENCES port(id);
ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT port_next_history_fk FOREIGN KEY (port_next) REFERENCES port(id);
ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT port_prev_history_fk FOREIGN KEY (port_previous) REFERENCES port(id);
ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT terminal_history_fk FOREIGN KEY (terminal) REFERENCES terminal(id);
ALTER TABLE public.carrier_vessel_port_history ADD CONSTRAINT vessel_history_fk FOREIGN KEY (vessel) REFERENCES vessel(id);
