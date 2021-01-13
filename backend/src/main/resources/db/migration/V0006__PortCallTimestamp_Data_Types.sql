create type port_call_timestamp_type as enum (
    'ETA-Berth',
    'RTA-Berth',
    'PTA-Berth',
    'ATA-Berth',
    'ETA-PBP',
    'RTA-PBP',
    'PTA-PBP',
    'ATA-PBP',
    'ATS',
    'ETC Cargo Ops',
    'RTC Cargo Ops',
    'PTC Cargo Ops',
    'ATC Cargo Ops',
    'ETD-Berth',
    'RTD-Berth',
    'PTD-Berth',
    'ATD-Berth'
    );

create type direction as enum (
    'N',
    'E',
    'S',
    'W'
    );

create type event_classifier AS ENUM (
    'EST',
    'REQ',
    'PLA',
    'ACT');


create type location_type AS ENUM (
    'ANCHORING_AREA',
    'BERTH',
    'BOUY',
    'ETUG_ZONE',
    'HOME_BASE',
    'PILOT_BOARDING_AREA',
    'PORT',
    'PORT_AREA',
    'RENDEZV_AREA',
    'TRAFFIC_AREA',
    'TUG_ZONE',
    'VESSEL',
    'VTS_AREA');

create type transport_event_type AS ENUM (
    'ARRI',
    'COPS',
    'SOPS',
    'SERV',
    'DEPT');
