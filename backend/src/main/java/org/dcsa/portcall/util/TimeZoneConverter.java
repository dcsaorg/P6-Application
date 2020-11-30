package org.dcsa.portcall.util;

import org.dcsa.portcall.db.tables.pojos.Port;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public class TimeZoneConverter {

    public static OffsetDateTime convertToTimezone(OffsetDateTime utcDate, Port port) {
        Instant instant = Instant.now();
        OffsetDateTime ret = OffsetDateTime.of(utcDate.getYear(),
                utcDate.getMonthValue(),
                utcDate.getDayOfMonth(),
                utcDate.getHour(),
                utcDate.getMinute(),
                0,
                0,
                ZoneId.of(port.getTimezone()).getRules().getOffset(instant));

        return ret;

    }

}
