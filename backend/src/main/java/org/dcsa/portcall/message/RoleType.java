package org.dcsa.portcall.message;

public enum RoleType {
    CARRIER(CodeType.SMDG_LINER_CODE),
    VESSEL(CodeType.IMO_VESSEL_NUMBER),
    TERMINAL(CodeType.UN_LOCODE),
    PORT(CodeType.UN_LOCODE),
    PILOT(CodeType.PILOT);

    private final CodeType codeType;

    RoleType(CodeType codeType) {
        this.codeType = codeType;
    }

    public CodeType getCodeType() {
        return codeType;
    }
}
