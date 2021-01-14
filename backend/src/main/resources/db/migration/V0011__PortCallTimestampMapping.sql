CREATE TABLE public.portcall_timestamp_mapping (
                                                   id serial NOT NULL,
                                                   timestamp_type port_call_timestamp_type NOT NULL,
                                                   "location" location_type NOT NULL,
                                                   event_classiefier event_classifier NOT NULL,
                                                   transport_event transport_event_type NOT NULL
);
