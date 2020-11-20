/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import org.dcsa.portcall.db.enums.DelayType;
import org.dcsa.portcall.db.tables.DelayCode;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class DelayCodeRecord extends UpdatableRecordImpl<DelayCodeRecord> implements Record5<Integer, String, String, DelayType, String> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.delay_code.id</code>.
     */
    public DelayCodeRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.delay_code.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.delay_code.smdg_code</code>.
     */
    public DelayCodeRecord setSmdgCode(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.delay_code.smdg_code</code>.
     */
    public String getSmdgCode() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.delay_code.name</code>.
     */
    public DelayCodeRecord setName(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.delay_code.name</code>.
     */
    public String getName() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.delay_code.delay_type</code>.
     */
    public DelayCodeRecord setDelayType(DelayType value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.delay_code.delay_type</code>.
     */
    public DelayType getDelayType() {
        return (DelayType) get(3);
    }

    /**
     * Setter for <code>public.delay_code.description</code>.
     */
    public DelayCodeRecord setDescription(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.delay_code.description</code>.
     */
    public String getDescription() {
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
    public Row5<Integer, String, String, DelayType, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Integer, String, String, DelayType, String> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return DelayCode.DELAY_CODE.ID;
    }

    @Override
    public Field<String> field2() {
        return DelayCode.DELAY_CODE.SMDG_CODE;
    }

    @Override
    public Field<String> field3() {
        return DelayCode.DELAY_CODE.NAME;
    }

    @Override
    public Field<DelayType> field4() {
        return DelayCode.DELAY_CODE.DELAY_TYPE;
    }

    @Override
    public Field<String> field5() {
        return DelayCode.DELAY_CODE.DESCRIPTION;
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
        return getName();
    }

    @Override
    public DelayType component4() {
        return getDelayType();
    }

    @Override
    public String component5() {
        return getDescription();
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
        return getName();
    }

    @Override
    public DelayType value4() {
        return getDelayType();
    }

    @Override
    public String value5() {
        return getDescription();
    }

    @Override
    public DelayCodeRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public DelayCodeRecord value2(String value) {
        setSmdgCode(value);
        return this;
    }

    @Override
    public DelayCodeRecord value3(String value) {
        setName(value);
        return this;
    }

    @Override
    public DelayCodeRecord value4(DelayType value) {
        setDelayType(value);
        return this;
    }

    @Override
    public DelayCodeRecord value5(String value) {
        setDescription(value);
        return this;
    }

    @Override
    public DelayCodeRecord values(Integer value1, String value2, String value3, DelayType value4, String value5) {
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
     * Create a detached DelayCodeRecord
     */
    public DelayCodeRecord() {
        super(DelayCode.DELAY_CODE);
    }

    /**
     * Create a detached, initialised DelayCodeRecord
     */
    public DelayCodeRecord(Integer id, String smdgCode, String name, DelayType delayType, String description) {
        super(DelayCode.DELAY_CODE);

        setId(id);
        setSmdgCode(smdgCode);
        setName(name);
        setDelayType(delayType);
        setDescription(description);
    }
}
