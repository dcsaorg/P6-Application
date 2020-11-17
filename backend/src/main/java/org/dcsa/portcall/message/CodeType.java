package org.dcsa.portcall.message;

public enum CodeType {
    SMDG_LINER_CODE("SMDG-LINER-CODE"),
    IMO_VESSEL_NUMBER("IMO-VESSEL-NUMBER"),
    UN_LOCODE("UN/LOCODE"),
    PILOT("PILOTCODE");

    private String jsonName;

    CodeType(String jsonName) {
        this.jsonName = jsonName;
    }

    public String getJsonName() {
        return jsonName;
    }
}
