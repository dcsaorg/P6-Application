/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import org.dcsa.portcall.db.tables.Port;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record6;
import org.jooq.Row6;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class PortRecord extends UpdatableRecordImpl<PortRecord> implements Record6<Integer, String, String, String, String, String> {

    private static final long serialVersionUID = 825130779;

    /**
     * Setter for <code>public.port.id</code>.
     */
    public PortRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.port.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.port.name</code>.
     */
    public PortRecord setName(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.port.name</code>.
     */
    public String getName() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.port.un_country</code>.
     */
    public PortRecord setUnCountry(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.port.un_country</code>.
     */
    public String getUnCountry() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.port.un_locode</code>.
     */
    public PortRecord setUnLocode(String value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.port.un_locode</code>.
     */
    public String getUnLocode() {
        return (String) get(3);
    }

    /**
     * Setter for <code>public.port.un_location</code>.
     */
    public PortRecord setUnLocation(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.port.un_location</code>.
     */
    public String getUnLocation() {
        return (String) get(4);
    }

    /**
     * Setter for <code>public.port.timezone</code>.
     */
    public PortRecord setTimezone(String value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for <code>public.port.timezone</code>.
     */
    public String getTimezone() {
        return (String) get(5);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record6 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row6<Integer, String, String, String, String, String> fieldsRow() {
        return (Row6) super.fieldsRow();
    }

    @Override
    public Row6<Integer, String, String, String, String, String> valuesRow() {
        return (Row6) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return Port.PORT.ID;
    }

    @Override
    public Field<String> field2() {
        return Port.PORT.NAME;
    }

    @Override
    public Field<String> field3() {
        return Port.PORT.UN_COUNTRY;
    }

    @Override
    public Field<String> field4() {
        return Port.PORT.UN_LOCODE;
    }

    @Override
    public Field<String> field5() {
        return Port.PORT.UN_LOCATION;
    }

    @Override
    public Field<String> field6() {
        return Port.PORT.TIMEZONE;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getName();
    }

    @Override
    public String component3() {
        return getUnCountry();
    }

    @Override
    public String component4() {
        return getUnLocode();
    }

    @Override
    public String component5() {
        return getUnLocation();
    }

    @Override
    public String component6() {
        return getTimezone();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getName();
    }

    @Override
    public String value3() {
        return getUnCountry();
    }

    @Override
    public String value4() {
        return getUnLocode();
    }

    @Override
    public String value5() {
        return getUnLocation();
    }

    @Override
    public String value6() {
        return getTimezone();
    }

    @Override
    public PortRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public PortRecord value2(String value) {
        setName(value);
        return this;
    }

    @Override
    public PortRecord value3(String value) {
        setUnCountry(value);
        return this;
    }

    @Override
    public PortRecord value4(String value) {
        setUnLocode(value);
        return this;
    }

    @Override
    public PortRecord value5(String value) {
        setUnLocation(value);
        return this;
    }

    @Override
    public PortRecord value6(String value) {
        setTimezone(value);
        return this;
    }

    @Override
    public PortRecord values(Integer value1, String value2, String value3, String value4, String value5, String value6) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached PortRecord
     */
    public PortRecord() {
        super(Port.PORT);
    }

    /**
     * Create a detached, initialised PortRecord
     */
    public PortRecord(Integer id, String name, String unCountry, String unLocode, String unLocation, String timezone) {
        super(Port.PORT);

        set(0, id);
        set(1, name);
        set(2, unCountry);
        set(3, unLocode);
        set(4, unLocation);
        set(5, timezone);
    }
}
