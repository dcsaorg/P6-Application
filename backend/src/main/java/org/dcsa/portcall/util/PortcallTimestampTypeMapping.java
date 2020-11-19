package org.dcsa.portcall.util;

import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.message.LocationType;
import org.dcsa.portcall.message.TransportEventType;

import java.util.EnumMap;
import java.util.Map;

public class PortcallTimestampTypeMapping {

    private static final Map<PortCallTimestampType, LocationType> PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP = new EnumMap<>(PortCallTimestampType.class);
    private static final Map<PortCallTimestampType, EventClassifierCode> PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP = new EnumMap<>(PortCallTimestampType.class);
    private static final Map<PortCallTimestampType, TransportEventType> PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP = new EnumMap<>(PortCallTimestampType.class);

    static {
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETA_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTA_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTA_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATA_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATD_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETD_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTD_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTD_Berth, LocationType.BERTH);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATS, LocationType.PORT);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTA_PBP, LocationType.PILOT_BOARDING_AREA);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATA_PBP, LocationType.PILOT_BOARDING_AREA);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETA_PBP, LocationType.PILOT_BOARDING_AREA);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTA_PBP, LocationType.PILOT_BOARDING_AREA);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ATC_Cargo_Ops, LocationType.PORT);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.ETC_Cargo_Ops, LocationType.PORT);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.PTC_Cargo_Ops, LocationType.PORT);
        PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.put(PortCallTimestampType.RTC_Cargo_Ops, LocationType.PORT);


        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETA_Berth, EventClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTA_Berth, EventClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTA_Berth, EventClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATA_Berth, EventClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATD_Berth, EventClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETD_Berth, EventClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTD_Berth, EventClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTD_Berth, EventClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATS, EventClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTA_PBP, EventClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATA_PBP, EventClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETA_PBP, EventClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTA_PBP, EventClassifierCode.REQ);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ATC_Cargo_Ops, EventClassifierCode.ACT);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.ETC_Cargo_Ops, EventClassifierCode.EST);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.PTC_Cargo_Ops, EventClassifierCode.PLA);
        PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.put(PortCallTimestampType.RTC_Cargo_Ops, EventClassifierCode.REQ);

        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ETA_Berth, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.RTA_Berth, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.PTA_Berth, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ATA_Berth, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ATD_Berth, TransportEventType.DEPT);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ETD_Berth, TransportEventType.DEPT);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.PTD_Berth, TransportEventType.DEPT);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.RTD_Berth, TransportEventType.DEPT);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ATS, TransportEventType.COPS);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.PTA_PBP, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ATA_PBP, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ETA_PBP, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.RTA_PBP, TransportEventType.ARRI);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ATC_Cargo_Ops, TransportEventType.COPS);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.ETC_Cargo_Ops, TransportEventType.COPS);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.PTC_Cargo_Ops, TransportEventType.COPS);
        PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.put(PortCallTimestampType.RTC_Cargo_Ops, TransportEventType.COPS);

    }

    private PortcallTimestampTypeMapping() {
    }

    public static LocationType getLocationCodeForTimeStampType(PortCallTimestampType timestampType) {
        return PORT_CALL_TIMESTAMP_TYPE_LOCATION_TYPE_CODE_MAP.get(timestampType);
    }

    public static EventClassifierCode getEventClassifierCodeForTimeStamp(PortCallTimestampType timestampType) {
        return PORT_CALL_TIMESTAMP_TYPE_CLASSIFIER_CODE_MAP.get(timestampType);
    }

    public static TransportEventType getTransPortEventTypeForTimestamp(PortCallTimestampType timestampType){
        return PORT_CALL_TIMESTAMP_TYPE_TRANSPORT_EVENT_MAP.get(timestampType);
    }
}
