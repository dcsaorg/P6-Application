package org.dcsa.portcall.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.dcsa.portcall.message.converter.LocationTypeToStringConverter;
import org.dcsa.portcall.message.converter.OffsetDateTimeDeserializer;
import org.dcsa.portcall.message.converter.OffsetDateTimeSerializer;
import org.dcsa.portcall.message.converter.StringToLocationTypeConverter;

import java.time.OffsetDateTime;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

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
        "eventClassifierCode", "transportEventTypeCode", "locationType", "locationId", "eventDateTime"
})
public class PortCallEvent {
    @JsonInclude(NON_NULL)
    private EventClassifierCode eventClassifierCode;
    @JsonInclude(NON_NULL)
    private TransportEventType transportEventTypeCode;

    @JsonInclude(NON_NULL)
    @JsonSerialize(converter = LocationTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToLocationTypeConverter.class)
    private LocationType locationType;
    @JsonInclude(NON_NULL)
    private String locationId;

    @JsonInclude(NON_NULL)
    @JsonSerialize(using = OffsetDateTimeSerializer.class)
    @JsonDeserialize(using = OffsetDateTimeDeserializer.class)
    private OffsetDateTime eventDateTime;


    public EventClassifierCode getEventClassifierCode() {
        return eventClassifierCode;
    }

    public PortCallEvent setEventClassifierCode(EventClassifierCode eventClassifierCode) {
        this.eventClassifierCode = eventClassifierCode;
        return this;
    }

    public TransportEventType getTransportEventTypeCode() {
        return transportEventTypeCode;
    }

    public PortCallEvent setTransportEventTypeCode(TransportEventType transportEventTypeCode) {
        this.transportEventTypeCode = transportEventTypeCode;
        return this;
    }

    public LocationType getLocationType() {
        return locationType;
    }

    public PortCallEvent setLocationType(LocationType locationType) {
        this.locationType = locationType;
        return this;
    }

    public String getLocationId() {
        return locationId;
    }

    public PortCallEvent setLocationId(String locationId) {
        this.locationId = locationId;
        return this;
    }

    public OffsetDateTime getEventDateTime() {
        return eventDateTime;
    }

    public PortCallEvent setEventDateTime(OffsetDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
        return this;
    }
}
