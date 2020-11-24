/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import java.time.LocalDate;

import org.dcsa.portcall.db.tables.Carrier;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class CarrierRecord extends UpdatableRecordImpl<CarrierRecord> implements Record5<Integer, String, String, LocalDate, String> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.carrier.id</code>.
     */
    public CarrierRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.carrier.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.carrier.smdg_code</code>.
     */
    public CarrierRecord setSmdgCode(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.carrier.smdg_code</code>.
     */
    public String getSmdgCode() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.carrier.line</code>.
     */
    public CarrierRecord setLine(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.carrier.line</code>.
     */
    public String getLine() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.carrier.valid_from</code>.
     */
    public CarrierRecord setValidFrom(LocalDate value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.carrier.valid_from</code>.
     */
    public LocalDate getValidFrom() {
        return (LocalDate) get(3);
    }

    /**
     * Setter for <code>public.carrier.website</code>.
     */
    public CarrierRecord setWebsite(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.carrier.website</code>.
     */
    public String getWebsite() {
        return (String) get(4);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record5 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row5<Integer, String, String, LocalDate, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Integer, String, String, LocalDate, String> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return Carrier.CARRIER.ID;
    }

    @Override
    public Field<String> field2() {
        return Carrier.CARRIER.SMDG_CODE;
    }

    @Override
    public Field<String> field3() {
        return Carrier.CARRIER.LINE;
    }

    @Override
    public Field<LocalDate> field4() {
        return Carrier.CARRIER.VALID_FROM;
    }

    @Override
    public Field<String> field5() {
        return Carrier.CARRIER.WEBSITE;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getSmdgCode();
    }

    @Override
    public String component3() {
        return getLine();
    }

    @Override
    public LocalDate component4() {
        return getValidFrom();
    }

    @Override
    public String component5() {
        return getWebsite();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getSmdgCode();
    }

    @Override
    public String value3() {
        return getLine();
    }

    @Override
    public LocalDate value4() {
        return getValidFrom();
    }

    @Override
    public String value5() {
        return getWebsite();
    }

    @Override
    public CarrierRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public CarrierRecord value2(String value) {
        setSmdgCode(value);
        return this;
    }

    @Override
    public CarrierRecord value3(String value) {
        setLine(value);
        return this;
    }

    @Override
    public CarrierRecord value4(LocalDate value) {
        setValidFrom(value);
        return this;
    }

    @Override
    public CarrierRecord value5(String value) {
        setWebsite(value);
        return this;
    }

    @Override
    public CarrierRecord values(Integer value1, String value2, String value3, LocalDate value4, String value5) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached CarrierRecord
     */
    public CarrierRecord() {
        super(Carrier.CARRIER);
    }

    /**
     * Create a detached, initialised CarrierRecord
     */
    public CarrierRecord(Integer id, String smdgCode, String line, LocalDate validFrom, String website) {
        super(Carrier.CARRIER);

        setId(id);
        setSmdgCode(smdgCode);
        setLine(line);
        setValidFrom(validFrom);
        setWebsite(website);
    }
}
