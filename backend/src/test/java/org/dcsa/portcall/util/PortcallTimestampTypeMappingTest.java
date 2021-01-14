package org.dcsa.portcall.util;

import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.message.LocationType;
import org.dcsa.portcall.message.TransportEventType;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;

class PortcallTimestampTypeMappingTest {

    @ParameterizedTest
    @EnumSource(PortCallTimestampType.class)
    void getLocationCodeForTimeStampType(PortCallTimestampType timestampType) {
        assertThat(PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestampType)).isInstanceOfAny(LocationType.class);
    }

    @ParameterizedTest
    @EnumSource(PortCallTimestampType.class)
    void getEventClassifierCodeForTimeStamp(PortCallTimestampType timestampType) {
        assertThat(PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(timestampType)).isInstanceOfAny(EventClassifierCode.class);
    }

    @ParameterizedTest
    @EnumSource(PortCallTimestampType.class)
    void getTransPortEventTypeForTimestamp(PortCallTimestampType timestampType) {
        assertThat(PortcallTimestampTypeMapping.getTransPortEventTypeForTimestamp(timestampType)).isInstanceOfAny(TransportEventType.class);
    }
}