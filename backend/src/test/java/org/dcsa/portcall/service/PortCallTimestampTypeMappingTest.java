package org.dcsa.portcall.service;

import org.dcsa.portcall.db.enums.EventClassifier;
import org.dcsa.portcall.db.enums.LocationType;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.enums.TransportEventType;
import org.dcsa.portcall.db.tables.pojos.PortcallTimestampMapping;
import org.dcsa.portcall.service.persistence.PortCallTimestampMappingService;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.HashMap;

@SpringBootTest
public class PortCallTimestampTypeMappingTest extends AbstractDatabaseTest {

    @Autowired
    private PortCallTimestampMappingService timestampMappingService;

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

    void testMappingService(String locationTypeString, String transportEventTypeString, String eventClassifierCodeString,
                            String portCallTimestampTypeString){

        LocationType locationType = LocationType.valueOf(locationTypeString);
        TransportEventType transportEventType = TransportEventType.valueOf(transportEventTypeString);
        EventClassifier eventCalssifier = EventClassifier.valueOf(eventClassifierCodeString);

        PortCallTimestampType portCallTimestampType = PortCallTimestampType.valueOf(portCallTimestampTypeString);

        timestampMappingService.getTimestampTypeMapping();
        HashMap<PortCallTimestampType, PortcallTimestampMapping> mappingTable = this.timestampMappingService.getTimestampTypeMappingTable();

        assertThat(locationType.equals(mappingTable.get(portCallTimestampType).getLocation()));
        assertThat(transportEventType.equals(mappingTable.get(portCallTimestampType).getTransportEvent()));
        assertThat(eventCalssifier.equals(mappingTable.get(portCallTimestampType).getEventClassiefier()));

    }


}



