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
  ATD_Berth = 'ATD-Berth'
}

export class TimestampTypeUtil {

  static getPortcallTimestampTypes(publisherRole: PublisherRole): string[] {
    switch (publisherRole) {
      case PublisherRole.CA:
        return [
          PortcallTimestampType.ETA_Berth,
          PortcallTimestampType.PTA_Berth,
          PortcallTimestampType.ETA_PBP,
          PortcallTimestampType.PTA_PBP,
          PortcallTimestampType.ATA_PBP,
          PortcallTimestampType.ATA_Berth,
          PortcallTimestampType.RTC_Cargo_Ops,
          PortcallTimestampType.ETD_Berth,
          PortcallTimestampType.PTD_Berth,
          PortcallTimestampType.ATD_Berth,
        ]
      case PublisherRole.TR:
        return [
          PortcallTimestampType.RTA_Berth,
          PortcallTimestampType.ATS_Cargo_Ops,
          PortcallTimestampType.ETC_Cargo_Ops,
          PortcallTimestampType.PTC_Cargo_Ops,
          PortcallTimestampType.ATC_Cargo_Ops,
        ]
      case PublisherRole.ATH:
        return [
          PortcallTimestampType.RTA_PBP,
          PortcallTimestampType.RTD_Berth,
        ]
      case PublisherRole.PLT:
        return [
          PortcallTimestampType.ATS_Pilot,
        ]
      default:
        return [];
    }
  }
}
