/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import org.dcsa.portcall.db.tables.Vessel;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class VesselRecord extends UpdatableRecordImpl<VesselRecord> implements Record5<Integer, String, Integer, Short, String> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.vessel.id</code>.
     */
    public VesselRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.vessel.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.vessel.name</code>.
     */
    public VesselRecord setName(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.vessel.name</code>.
     */
    public String getName() {
        return (String) get(1);
    }

    /**
     * Setter for <code>public.vessel.imo</code>.
     */
    public VesselRecord setImo(Integer value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.vessel.imo</code>.
     */
    public Integer getImo() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>public.vessel.teu</code>.
     */
    public VesselRecord setTeu(Short value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.vessel.teu</code>.
     */
    public Short getTeu() {
        return (Short) get(3);
    }

    /**
     * Setter for <code>public.vessel.service_name_code</code>.
     */
    public VesselRecord setServiceNameCode(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.vessel.service_name_code</code>.
     */
    public String getServiceNameCode() {
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
    public Row5<Integer, String, Integer, Short, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Integer, String, Integer, Short, String> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return Vessel.VESSEL.ID;
    }

    @Override
    public Field<String> field2() {
        return Vessel.VESSEL.NAME;
    }

    @Override
    public Field<Integer> field3() {
        return Vessel.VESSEL.IMO;
    }

    @Override
    public Field<Short> field4() {
        return Vessel.VESSEL.TEU;
    }

    @Override
    public Field<String> field5() {
        return Vessel.VESSEL.SERVICE_NAME_CODE;
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
    public Integer component3() {
        return getImo();
    }

    @Override
    public Short component4() {
        return getTeu();
    }

    @Override
    public String component5() {
        return getServiceNameCode();
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
    public Integer value3() {
        return getImo();
    }

    @Override
    public Short value4() {
        return getTeu();
    }

    @Override
    public String value5() {
        return getServiceNameCode();
    }

    @Override
    public VesselRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public VesselRecord value2(String value) {
        setName(value);
        return this;
    }

    @Override
    public VesselRecord value3(Integer value) {
        setImo(value);
        return this;
    }

    @Override
    public VesselRecord value4(Short value) {
        setTeu(value);
        return this;
    }

    @Override
    public VesselRecord value5(String value) {
        setServiceNameCode(value);
        return this;
    }

    @Override
    public VesselRecord values(Integer value1, String value2, Integer value3, Short value4, String value5) {
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
     * Create a detached VesselRecord
     */
    public VesselRecord() {
        super(Vessel.VESSEL);
    }

    /**
     * Create a detached, initialised VesselRecord
     */
    public VesselRecord(Integer id, String name, Integer imo, Short teu, String serviceNameCode) {
        super(Vessel.VESSEL);

        setId(id);
        setName(name);
        setImo(imo);
        setTeu(teu);
        setServiceNameCode(serviceNameCode);
    }
}
