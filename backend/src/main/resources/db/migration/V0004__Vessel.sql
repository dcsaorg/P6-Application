
CREATE TABLE vessel
(
	id serial not null,
	carrier integer not null,
	name varchar(100) not null,
	imo numeric(7) not null,
	teu smallint not null,
	service_name_code varchar(255) null,

	constraint vessel_pk primary key (id),
	constraint vessel_fk_carrier foreign key (carrier) references carrier(id),
	constraint vessel_uq_imo unique (imo)
);

