package org.dcsa.portcall.util;

import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.model.ClassifierCode;
import org.dcsa.portcall.model.LocationTypeCode;

import java.util.EnumMap;
import java.util.Map;

public class PortcallTimestampTypeMapping {

    private static final Map<PortCallTimestampType, LocationTypeCode> PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP = new EnumMap<>(PortCallTimestampType.class);
    private static final Map<PortCallTimestampType, ClassifierCode> PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP = new EnumMap<>(PortCallTimestampType.class);

    static {
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETA_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTA_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTA_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATA_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATD_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETD_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTD_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTD_Berth, LocationTypeCode.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATS, LocationTypeCode.CARGO_OPS);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTA_PBP, LocationTypeCode.PBP);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATA_PBP, LocationTypeCode.PBP);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETA_PBP, LocationTypeCode.PBP);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTA_PBP, LocationTypeCode.PBP);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTC_Cargo_Ops, LocationTypeCode.CARGO_OPS);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTC_Cargo_Ops, LocationTypeCode.CARGO_OPS);


        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETA_Berth, ClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTA_Berth, ClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTA_Berth, ClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATA_Berth, ClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATD_Berth, ClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETD_Berth, ClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTD_Berth, ClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTD_Berth, ClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTA_PBP, ClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATA_PBP, ClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETA_PBP, ClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTA_PBP, ClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATC_Cargo_Ops, ClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETC_Cargo_Ops, ClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTC_Cargo_Ops, ClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTC_Cargo_Ops, ClassifierCode.REQ);
    }

    private PortcallTimestampTypeMapping() {
    }

    public static LocationTypeCode getLocationCodeForTimeStampType(PortCallTimestampType timestampType) {
        return PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.get(timestampType);
    }

    public static ClassifierCode getClassifierCodeForTimeStamp(PortCallTimestampType timestampType) {
        return PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.get(timestampType);
    }
}
