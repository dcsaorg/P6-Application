INSERT INTO portcall_timestamp_mapping (timestamp_type,"location",event_classiefier,transport_event) VALUES
                                                                                                           ('ETA-Berth','BERTH','EST','ARRI')
                                                                                                          ,('RTA-Berth','BERTH','REQ','ARRI')
                                                                                                          ,('PTA-Berth','BERTH','PLA','ARRI')
                                                                                                          ,('ATA-Berth','BERTH','ACT','ARRI')
                                                                                                          ,('ETA-PBP','PILOT_BOARDING_AREA','EST','ARRI')
                                                                                                          ,('RTA-PBP','PILOT_BOARDING_AREA','REQ','ARRI')
                                                                                                          ,('PTA-PBP','PILOT_BOARDING_AREA','PLA','ARRI')
                                                                                                          ,('ATA-PBP','PILOT_BOARDING_AREA','ACT','ARRI')
                                                                                                          ,('ATS','PORT','ACT','SOPS')
                                                                                                          ,('ETC Cargo Ops','PORT','EST','COPS')
;
INSERT INTO portcall_timestamp_mapping (timestamp_type,"location",event_classiefier,transport_event) VALUES
                                                                                                           ('RTC Cargo Ops','PORT','REQ','COPS')
                                                                                                          ,('PTC Cargo Ops','PORT','PLA','COPS')
                                                                                                          ,('ATC Cargo Ops','PORT','ACT','COPS')
                                                                                                          ,('ETD-Berth','BERTH','EST','DEPT')
                                                                                                          ,('RTD-Berth','BERTH','REQ','DEPT')
                                                                                                          ,('PTD-Berth','BERTH','PLA','DEPT')
                                                                                                          ,('ATD-Berth','BERTH','ACT','DEPT')
;