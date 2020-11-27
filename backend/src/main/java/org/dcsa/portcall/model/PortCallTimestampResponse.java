package org.dcsa.portcall.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.ALWAYS;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

public class PortCallTimestampResponse extends PortCallTimestamp {

    @JsonProperty
    private PortCallTimestampType response;

    public PortCallTimestampType setResponse() {
        return this.response;
    }

    public void setResponse(PortCallTimestampType response) {
        this.response = response;
    }
}
