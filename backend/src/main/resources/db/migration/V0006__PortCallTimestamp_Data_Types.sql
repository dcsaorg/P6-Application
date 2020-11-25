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
