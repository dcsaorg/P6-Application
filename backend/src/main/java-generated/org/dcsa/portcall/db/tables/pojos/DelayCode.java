/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.pojos;


import java.io.Serializable;

import org.dcsa.portcall.db.enums.DelayType;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class DelayCode implements Serializable {

    private static final long serialVersionUID = -1863770813;

    private Integer   id;
    private String    smdgCode;
    private String    name;
    private DelayType delayType;
    private String    description;

    public DelayCode() {}

    public DelayCode(DelayCode value) {
        this.id = value.id;
        this.smdgCode = value.smdgCode;
        this.name = value.name;
        this.delayType = value.delayType;
        this.description = value.description;
    }

    public DelayCode(
        Integer   id,
        String    smdgCode,
        String    name,
        DelayType delayType,
        String    description
    ) {
        this.id = id;
        this.smdgCode = smdgCode;
        this.name = name;
        this.delayType = delayType;
        this.description = description;
    }

    public Integer getId() {
        return this.id;
    }

    public DelayCode setId(Integer id) {
        this.id = id;
        return this;
    }

    public String getSmdgCode() {
        return this.smdgCode;
    }

    public DelayCode setSmdgCode(String smdgCode) {
        this.smdgCode = smdgCode;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public DelayCode setName(String name) {
        this.name = name;
        return this;
    }

    public DelayType getDelayType() {
        return this.delayType;
    }

    public DelayCode setDelayType(DelayType delayType) {
        this.delayType = delayType;
        return this;
    }

    public String getDescription() {
        return this.description;
    }

    public DelayCode setDescription(String description) {
        this.description = description;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("DelayCode (");

        sb.append(id);
        sb.append(", ").append(smdgCode);
        sb.append(", ").append(name);
        sb.append(", ").append(delayType);
        sb.append(", ").append(description);

        sb.append(")");
        return sb.toString();
    }
}