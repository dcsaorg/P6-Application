/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.dcsa.portcall.db.Keys;
import org.dcsa.portcall.db.Public;
import org.dcsa.portcall.db.tables.records.CarrierRecord;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row5;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Carrier extends TableImpl<CarrierRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.carrier</code>
     */
    public static final Carrier CARRIER = new Carrier();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<CarrierRecord> getRecordType() {
        return CarrierRecord.class;
    }

    /**
     * The column <code>public.carrier.id</code>.
     */
    public final TableField<CarrierRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column <code>public.carrier.smdg_code</code>.
     */
    public final TableField<CarrierRecord, String> SMDG_CODE = createField(DSL.name("smdg_code"), SQLDataType.VARCHAR(4).nullable(false), this, "");

    /**
     * The column <code>public.carrier.line</code>.
     */
    public final TableField<CarrierRecord, String> LINE = createField(DSL.name("line"), SQLDataType.VARCHAR(200).nullable(false), this, "");

    /**
     * The column <code>public.carrier.valid_from</code>.
     */
    public final TableField<CarrierRecord, LocalDate> VALID_FROM = createField(DSL.name("valid_from"), SQLDataType.LOCALDATE.nullable(false), this, "");

    /**
     * The column <code>public.carrier.website</code>.
     */
    public final TableField<CarrierRecord, String> WEBSITE = createField(DSL.name("website"), SQLDataType.VARCHAR(200), this, "");

    private Carrier(Name alias, Table<CarrierRecord> aliased) {
        this(alias, aliased, null);
    }

    private Carrier(Name alias, Table<CarrierRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>public.carrier</code> table reference
     */
    public Carrier(String alias) {
        this(DSL.name(alias), CARRIER);
    }

    /**
     * Create an aliased <code>public.carrier</code> table reference
     */
    public Carrier(Name alias) {
        this(alias, CARRIER);
    }

    /**
     * Create a <code>public.carrier</code> table reference
     */
    public Carrier() {
        this(DSL.name("carrier"), null);
    }

    public <O extends Record> Carrier(Table<O> child, ForeignKey<O, CarrierRecord> key) {
        super(child, key, CARRIER);
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public Identity<CarrierRecord, Integer> getIdentity() {
        return (Identity<CarrierRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<CarrierRecord> getPrimaryKey() {
        return Keys.LINER_CODE_PK;
    }

    @Override
    public List<UniqueKey<CarrierRecord>> getKeys() {
        return Arrays.<UniqueKey<CarrierRecord>>asList(Keys.LINER_CODE_PK, Keys.LINER_CODE_UN);
    }

    @Override
    public Carrier as(String alias) {
        return new Carrier(DSL.name(alias), this);
    }

    @Override
    public Carrier as(Name alias) {
        return new Carrier(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Carrier rename(String name) {
        return new Carrier(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Carrier rename(Name name) {
        return new Carrier(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Integer, String, String, LocalDate, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
