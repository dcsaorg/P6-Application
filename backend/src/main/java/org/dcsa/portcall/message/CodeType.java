package org.dcsa.portcall.message;

public enum CodeType {
    SMDG_LINER_CODE("SMDG-LINER-CODE"),
    IMO_VESSEL_NUMBER("IMO-VESSEL-NUMBER"),
    UN_LOCODE("UN/LOCODE"),
    PILOT("PILOTCODE");

    private String name;

    CodeType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
