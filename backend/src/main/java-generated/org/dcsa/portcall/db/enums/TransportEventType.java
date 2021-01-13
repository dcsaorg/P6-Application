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
public enum TransportEventType implements EnumType {

    ARRI("ARRI"),

    COPS("COPS"),

    SOPS("SOPS"),

    SERV("SERV"),

    DEPT("DEPT");

    private final String literal;

    private TransportEventType(String literal) {
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
        return "transport_event_type";
    }

    @Override
    public String getLiteral() {
        return literal;
    }
}
