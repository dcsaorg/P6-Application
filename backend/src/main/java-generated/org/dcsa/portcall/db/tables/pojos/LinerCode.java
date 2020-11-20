/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.pojos;


import java.io.Serializable;
import java.time.LocalDate;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class LinerCode implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer   id;
    private String    smdgCode;
    private String    line;
    private LocalDate validFrom;
    private String    website;

    public LinerCode() {}

    public LinerCode(LinerCode value) {
        this.id = value.id;
        this.smdgCode = value.smdgCode;
        this.line = value.line;
        this.validFrom = value.validFrom;
        this.website = value.website;
    }

    public LinerCode(
        Integer   id,
        String    smdgCode,
        String    line,
        LocalDate validFrom,
        String    website
    ) {
        this.id = id;
        this.smdgCode = smdgCode;
        this.line = line;
        this.validFrom = validFrom;
        this.website = website;
    }

    /**
     * Getter for <code>public.liner_code.id</code>.
     */
    public Integer getId() {
        return this.id;
    }

    /**
     * Setter for <code>public.liner_code.id</code>.
     */
    public LinerCode setId(Integer id) {
        this.id = id;
        return this;
    }

    /**
     * Getter for <code>public.liner_code.smdg_code</code>.
     */
    public String getSmdgCode() {
        return this.smdgCode;
    }

    /**
     * Setter for <code>public.liner_code.smdg_code</code>.
     */
    public LinerCode setSmdgCode(String smdgCode) {
        this.smdgCode = smdgCode;
        return this;
    }

    /**
     * Getter for <code>public.liner_code.line</code>.
     */
    public String getLine() {
        return this.line;
    }

    /**
     * Setter for <code>public.liner_code.line</code>.
     */
    public LinerCode setLine(String line) {
        this.line = line;
        return this;
    }

    /**
     * Getter for <code>public.liner_code.valid_from</code>.
     */
    public LocalDate getValidFrom() {
        return this.validFrom;
    }

    /**
     * Setter for <code>public.liner_code.valid_from</code>.
     */
    public LinerCode setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
        return this;
    }

    /**
     * Getter for <code>public.liner_code.website</code>.
     */
    public String getWebsite() {
        return this.website;
    }

    /**
     * Setter for <code>public.liner_code.website</code>.
     */
    public LinerCode setWebsite(String website) {
        this.website = website;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("LinerCode (");

        sb.append(id);
        sb.append(", ").append(smdgCode);
        sb.append(", ").append(line);
        sb.append(", ").append(validFrom);
        sb.append(", ").append(website);

        sb.append(")");
        return sb.toString();
    }
}
