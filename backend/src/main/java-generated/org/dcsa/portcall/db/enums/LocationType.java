/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.enums;


import org.dcsa.portcall.db.Public;
import org.jooq.Catalog;
import org.jooq.EnumType;
import org.jooq.Schema;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public enum LocationType implements EnumType {

    ANCHORING_AREA("ANCHORING_AREA"),

    BERTH("BERTH"),

    BOUY("BOUY"),

    ETUG_ZONE("ETUG_ZONE"),

    HOME_BASE("HOME_BASE"),

    PILOT_BOARDING_AREA("PILOT_BOARDING_AREA"),

    PORT("PORT"),

    PORT_AREA("PORT_AREA"),

    RENDEZV_AREA("RENDEZV_AREA"),

    TRAFFIC_AREA("TRAFFIC_AREA"),

    TUG_ZONE("TUG_ZONE"),

    VESSEL("VESSEL"),

    VTS_AREA("VTS_AREA");

    private final String literal;

    private LocationType(String literal) {
        this.literal = literal;
    }

    @Override
    public Catalog getCatalog() {
        return getSchema().getCatalog();
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public String getName() {
        return "location_type";
    }

    @Override
    public String getLiteral() {
        return literal;
    }
}
