package org.dcsa.portcall.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.dcsa.portcall.message.converter.CodeTypeToStringConverter;
import org.dcsa.portcall.message.converter.StringToCodeTypeConverter;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

/**
 * {
 * "PortCallMessage":{
 *      “VesselIDType”:         “urn:mrn:ipcdmc:vessel:imo”
 *      "VesselID":             “9074729”,
 *      "PortIDType":           "SMDG",
 *      "PortID":               "deham",
 *      "TerminalIDType":       "SMDG-TERMINAL",
 *      "TerminalID":           "cta",
 *      “PreviousPortOfCall”:   "nlrtm",	// optional
 *      “NextPortOfCall”:       “beanr”, 	// optional
 *      “VoyageNumber”:         “ABCDEFGH”, 	// optional
 *      “Event” :{
 *          “EventClassifierCode” : 	“EST”,
 *          “TransportEventTypeCode” : 	“ARRI”,
 *          “LocationType” : 		    “BERTH”
 *          “LocationID” :              “urn:mrn:ipcdmc:location:nlrtm:BERTH:CTA/200m”,
 *          “EventDateTime”:			“2020-07-17T09:00:00Z”,
 *          “EventTimeWindowStart”: 	“2020-07-17T08:00:00Z” // opt.
 *          “EventTimeWindowEnd”:	 	“2020-07-17T12:00:00Z” // opt.
 *      },
 *      “Remark” :		“Hey Joe, here is the missing timestamp that I just now got from our Agent”
 * }
 * }
 */
@JsonPropertyOrder({
        "vesselIdType", "vesselId", "portIdType", "portId", "terminalIdType", "terminalId",
        "lastPortOfCall", "nextPortOfCall", "voyageNumber", "voyageNumber2", "event", "remark"
})
public class PortCallMessage<ET extends AbstractPortCallEventType> {

    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType vesselIdType;
    private String vesselId;

    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType portIdType;
    private String portId;

    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType terminalIdType;
    private String terminalId;

    @JsonInclude(NON_NULL)
    private String previousPortOfCall;
    @JsonInclude(NON_NULL)
    private String nextPortOfCall;

    private String voyageNumber;
    @JsonInclude(NON_NULL)
    private String voyageNumber2;

    private PortCallEvent<ET> event;

    @JsonInclude(NON_NULL)
    private String remarks;

    public PortCallMessage() {
        this.vesselIdType = RoleType.VESSEL.getCodeType();
        this.portIdType = RoleType.PORT.getCodeType();
        this.terminalIdType = RoleType.TERMINAL.getCodeType();
    }

    public CodeType getVesselIdType() {
        return vesselIdType;
    }

    public PortCallMessage setVesselIdType(CodeType vesselIdType) {
        this.vesselIdType = vesselIdType;
        return this;
    }

    public String getVesselId() {
        return vesselId;
    }

    public PortCallMessage setVesselId(String vesselId) {
        this.vesselId = vesselId;
        return this;
    }

    public CodeType getPortIdType() {
        return portIdType;
    }

    public PortCallMessage setPortIdType(CodeType portIdType) {
        this.portIdType = portIdType;
        return this;
    }

    public String getPortId() {
        return portId;
    }

    public PortCallMessage setPortId(String portId) {
        this.portId = portId;
        return this;
    }

    public CodeType getTerminalIdType() {
        return terminalIdType;
    }

    public PortCallMessage setTerminalIdType(CodeType terminalIdType) {
        this.terminalIdType = terminalIdType;
        return this;
    }

    public String getTerminalId() {
        return terminalId;
    }

    public PortCallMessage setTerminalId(String terminalId) {
        this.terminalId = terminalId;
        return this;
    }

    public String getPreviousPortOfCall() {
        return previousPortOfCall;
    }

    public PortCallMessage setPreviousPortOfCall(String previousPortOfCall) {
        this.previousPortOfCall = previousPortOfCall;
        return this;
    }

    public String getNextPortOfCall() {
        return nextPortOfCall;
    }

    public PortCallMessage setNextPortOfCall(String nextPortOfCall) {
        this.nextPortOfCall = nextPortOfCall;
        return this;
    }

    public String getVoyageNumber() {
        return voyageNumber;
    }

    public PortCallMessage setVoyageNumber(String voyageNumber) {
        this.voyageNumber = voyageNumber;
        return this;
    }

    public String getVoyageNumber2() {
        return voyageNumber2;
    }

    public PortCallMessage setVoyageNumber2(String voyageNumber2) {
        this.voyageNumber2 = voyageNumber2;
        return this;
    }

    public PortCallEvent getEvent() {
        return event;
    }

    public PortCallMessage setEvent(PortCallEvent event) {
        this.event = event;
        return this;
    }

    public String getRemarks() {
        return remarks;
    }

    public PortCallMessage setRemarks(String remarks) {
        this.remarks = remarks;
        return this;
    }
}
