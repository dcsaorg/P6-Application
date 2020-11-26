package org.dcsa.portcall.service;

import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.message.LocationType;
import org.dcsa.portcall.message.TransportEventType;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class InboundPortCallMessageIdentifyTimestampTypeTest {

    @ParameterizedTest
    @CsvSource({
            "BERTH, ARRI, EST, ETA_Berth",
            "BERTH, ARRI, REQ, RTA_Berth",
            "BERTH, ARRI, PLA, PTA_Berth",
            "BERTH, ARRI, ACT, ATA_Berth",

            "BERTH, DEPT, EST, ETD_Berth",
            "BERTH, DEPT, REQ, RTD_Berth",
            "BERTH, DEPT, PLA, PTD_Berth",
            "BERTH, DEPT, ACT, ATD_Berth",

            "PILOT_BOARDING_AREA, ARRI, EST, ETA_PBP",
            "PILOT_BOARDING_AREA, ARRI, REQ, RTA_PBP",
            "PILOT_BOARDING_AREA, ARRI, PLA, PTA_PBP",
            "PILOT_BOARDING_AREA, ARRI, ACT, ATA_PBP",

            "PORT, COPS, EST, ETC_Cargo_Ops",
            "PORT, COPS, REQ, RTC_Cargo_Ops",
            "PORT, COPS, PLA, PTC_Cargo_Ops",
            "PORT, COPS, ACT, ATC_Cargo_Ops",
    })
    void testIdentifyTimestampType(String locationTypeString, String transportEventTypeString, String eventClassifierCodeString,
                                          String portCallTimestampTypeString) {

        LocationType locationType = LocationType.valueOf(locationTypeString);
        TransportEventType transportEventType = TransportEventType.valueOf(transportEventTypeString);
        EventClassifierCode eventClassifierCode = EventClassifierCode.valueOf(eventClassifierCodeString);

        PortCallTimestampType portCallTimestampType = PortCallTimestampType.valueOf(portCallTimestampTypeString);

        assertThat(InboundPortCallMessageService.identifyTimestampType(locationType, transportEventType, eventClassifierCode)).isEqualTo(portCallTimestampType);

    }
}
