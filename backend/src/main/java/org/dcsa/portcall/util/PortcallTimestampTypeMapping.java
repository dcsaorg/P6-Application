package org.dcsa.portcall.util;

import org.dcsa.portcall.db.enums.PortCallTimestampType;

import java.util.HashMap;
import java.util.Map;

public class PortcallTimestampTypeMapping {



    public static LocationTypeCode getLocationCodeForTimeStampType(PortCallTimestampType timestampType){
        Map<PortCallTimestampType, LocationTypeCode> mapList = new HashMap<PortCallTimestampType, LocationTypeCode>();
        mapList.put(PortCallTimestampType.ETA_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.RTA_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.PTA_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.ATA_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.ATD_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.ETD_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.PTD_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.RTD_Berth, LocationTypeCode.BERTH);
        mapList.put(PortCallTimestampType.PTA_PBP, LocationTypeCode.PBP);
        mapList.put(PortCallTimestampType.ATA_PBP, LocationTypeCode.PBP);
        mapList.put(PortCallTimestampType.ETA_PBP, LocationTypeCode.PBP);
        mapList.put(PortCallTimestampType.RTA_PBP, LocationTypeCode.PBP);
        mapList.put(PortCallTimestampType.ATC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        mapList.put(PortCallTimestampType.ETC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        mapList.put(PortCallTimestampType.PTC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        mapList.put(PortCallTimestampType.RTC_Cargo_Ops, LocationTypeCode.CARGO_OPS);

        return mapList.get(timestampType);
    }

    public static ClassifierCode getClassifierCodeForTimeStamp(PortCallTimestampType timestampType){
        Map<PortCallTimestampType, ClassifierCode> mapList = new HashMap<PortCallTimestampType, ClassifierCode>();
        mapList.put(PortCallTimestampType.ETA_Berth, ClassifierCode.EST);
        mapList.put(PortCallTimestampType.RTA_Berth, ClassifierCode.REQ);
        mapList.put(PortCallTimestampType.PTA_Berth, ClassifierCode.PLA);
        mapList.put(PortCallTimestampType.ATA_Berth, ClassifierCode.ACT);
        mapList.put(PortCallTimestampType.ATD_Berth, ClassifierCode.ACT);
        mapList.put(PortCallTimestampType.ETD_Berth, ClassifierCode.EST);
        mapList.put(PortCallTimestampType.PTD_Berth, ClassifierCode.PLA);
        mapList.put(PortCallTimestampType.RTD_Berth, ClassifierCode.REQ);
        mapList.put(PortCallTimestampType.PTA_PBP, ClassifierCode.PLA);
        mapList.put(PortCallTimestampType.ATA_PBP, ClassifierCode.ACT);
        mapList.put(PortCallTimestampType.ETA_PBP, ClassifierCode.EST);
        mapList.put(PortCallTimestampType.RTA_PBP, ClassifierCode.REQ);
        mapList.put(PortCallTimestampType.ATC_Cargo_Ops, ClassifierCode.ACT);
        mapList.put(PortCallTimestampType.ETC_Cargo_Ops, ClassifierCode.EST);
        mapList.put(PortCallTimestampType.PTC_Cargo_Ops, ClassifierCode.PLA);
        mapList.put(PortCallTimestampType.RTC_Cargo_Ops, ClassifierCode.REQ);

        return mapList.get(timestampType);
    }
}
