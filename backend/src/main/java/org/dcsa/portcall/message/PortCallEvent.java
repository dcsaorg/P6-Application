package org.dcsa.portcall.message;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.time.OffsetDateTime;

/**
 * “Event” :{
 *     “EventClassifierCode” : 	“EST”,
 *     “TransportEventTypeCode” : 	“ARRI”,
 *     “LocationType” : 		“BERTH”
 *     “LocationID” : “urn:mrn:ipcdmc:location:nlrtm:BERTH:CTA/200m”,
 *     “EventDateTime”:			“2020-07-17T09:00:00Z”,
 *     “EventTimeWindowStart”: 	“2020-07-17T08:00:00Z” // opt.
 *     “EventTimeWindowEnd”:	 	“2020-07-17T12:00:00Z” // opt.
 * }
 */
@JsonPropertyOrder({
        "eventClassifierCode", "transportEventTypeCode", "locationTyp", "locationId", "eventDateTime"
})
public class PortCallEvent<ET extends AbstractPortCallEventType> {
    private EventClassifierCode eventClassifierCode;
    private TransportEventType transportEventTypeCode;

    @JsonUnwrapped
    private ET eventType;

    private OffsetDateTime eventDateTime;


    public EventClassifierCode getEventClassifierCode() {
        return eventClassifierCode;
    }

    public PortCallEvent<ET> setEventClassifierCode(EventClassifierCode eventClassifierCode) {
        this.eventClassifierCode = eventClassifierCode;
        return this;
    }

    public TransportEventType getTransportEventTypeCode() {
        return transportEventTypeCode;
    }

    public PortCallEvent<ET> setTransportEventTypeCode(TransportEventType transportEventTypeCode) {
        this.transportEventTypeCode = transportEventTypeCode;
        return this;
    }

    public ET getEventType() {
        return eventType;
    }

    public PortCallEvent<ET> setEventType(ET eventType) {
        this.eventType = eventType;
        return this;
    }

    public OffsetDateTime getEventDateTime() {
        return eventDateTime;
    }

    public PortCallEvent<ET> setEventDateTime(OffsetDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
        return this;
    }
}
