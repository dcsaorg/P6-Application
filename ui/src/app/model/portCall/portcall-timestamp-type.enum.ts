import {PublisherRole} from "../enums/publisherRole";

export enum PortcallTimestampType {
  ETA_Berth = 'ETA-Berth',
  RTA_Berth = 'RTA-Berth',
  PTA_Berth = 'PTA-Berth',
  ETA_PBP = 'ETA-PBP',
  RTA_PBP = 'RTA-PBP',
  PTA_PBP = 'PTA-PBP',
  ATA_PBP = 'ATA-PBP',
  ATA_Berth = 'ATA-Berth',
  ATS_Pilot = "ATS Pilotage",
  ATS_Cargo_Ops = 'ATS Cargo Ops',
  ETC_Cargo_Ops = 'ETC Cargo Ops',
  RTC_Cargo_Ops = 'RTC Cargo Ops',
  PTC_Cargo_Ops = 'PTC Cargo Ops',
  ATC_Cargo_Ops = 'ATC Cargo Ops',
  ETD_Berth = 'ETD-Berth',
  RTD_Berth = 'RTD-Berth',
  PTD_Berth = 'PTD-Berth',
  ATD_Berth = 'ATD-Berth',

  // JIT 1.1 Timestamps
  SOSP = 'SOSP', // start of seaway passage
  EOSP = 'EOSP', // end of seaway passage
  RTS_Towage = 'RTS-Towage',
  PTS_Towage = 'PTS-Towage',
  ATS_Towage = 'ATS-Towage',
  ATC_Towage = 'ATC-Towage',
  RTS_Pilotage = 'RTS-Pilotage',
  PTS_Pilotage = 'PTS-Pilotage',
  ATS_Pilotage = 'ATS-Pilotage',
  AT_All_Fast = 'AT-All-Fast',
  Gangway_Down_and_Safe = 'Gangway Down and Safe',
  Vessel_Readiness_for_Cargo_Ops = 'Vessel Readiness for Cargo Operations',
  ETS_Cargo_Ops = 'ETS-Cargo-Operations',
  RTS_Cargo_Ops = 'RTS-Cargo-Operations',
  PTS_Cargo_Ops = 'PTS-Cargo-Operations',
  ETS_Bunkering = 'ETS-Bunkering',
  RTS_Bunkering = 'RTS-Bunkering',
  PTS_Bunkering = 'PTS-Bunkering',
  ATS_Bunkering = 'ATS-Bunkering',
  ETC_Bunkering = 'ETC-Bunkering',
  RTC_Bunkering = 'RTC-Bunkering',
  PTC_Bunkering = 'PTC-Bunkering',
  ATC_Bunkering = 'ATC-Bunkering',
  ATC_Lashing = 'ATC-Lashing',
  Terminal_Ready_for_Vessel_Departure = 'Terminal Ready for Vessel Departure',
  ATC_Pilotage = 'ATC-Pilotage'
}

