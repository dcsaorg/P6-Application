/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables;


import java.util.Arrays;
import java.util.List;

import org.dcsa.portcall.db.Keys;
import org.dcsa.portcall.db.Public;
import org.dcsa.portcall.db.enums.DelayType;
import org.dcsa.portcall.db.tables.records.DelayCodeRecord;
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
public class DelayCode extends TableImpl<DelayCodeRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.delay_code</code>
     */
    public static final DelayCode DELAY_CODE = new DelayCode();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<DelayCodeRecord> getRecordType() {
        return DelayCodeRecord.class;
    }

    /**
     * The column <code>public.delay_code.id</code>.
     */
    public final TableField<DelayCodeRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column <code>public.delay_code.smdg_code</code>.
     */
    public final TableField<DelayCodeRecord, String> SMDG_CODE = createField(DSL.name("smdg_code"), SQLDataType.VARCHAR(4).nullable(false), this, "");

    /**
     * The column <code>public.delay_code.name</code>.
     */
    public final TableField<DelayCodeRecord, String> NAME = createField(DSL.name("name"), SQLDataType.VARCHAR(150), this, "");

    /**
     * The column <code>public.delay_code.delay_type</code>.
     */
    public final TableField<DelayCodeRecord, DelayType> DELAY_TYPE = createField(DSL.name("delay_type"), SQLDataType.VARCHAR.nullable(false).asEnumDataType(org.dcsa.portcall.db.enums.DelayType.class), this, "");

    /**
     * The column <code>public.delay_code.description</code>.
     */
    public final TableField<DelayCodeRecord, String> DESCRIPTION = createField(DSL.name("description"), SQLDataType.VARCHAR(200), this, "");

    private DelayCode(Name alias, Table<DelayCodeRecord> aliased) {
        this(alias, aliased, null);
    }

    private DelayCode(Name alias, Table<DelayCodeRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>public.delay_code</code> table reference
     */
    public DelayCode(String alias) {
        this(DSL.name(alias), DELAY_CODE);
    }

    /**
     * Create an aliased <code>public.delay_code</code> table reference
     */
    public DelayCode(Name alias) {
        this(alias, DELAY_CODE);
    }

    /**
     * Create a <code>public.delay_code</code> table reference
     */
    public DelayCode() {
        this(DSL.name("delay_code"), null);
    }

    public <O extends Record> DelayCode(Table<O> child, ForeignKey<O, DelayCodeRecord> key) {
        super(child, key, DELAY_CODE);
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public Identity<DelayCodeRecord, Integer> getIdentity() {
        return (Identity<DelayCodeRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<DelayCodeRecord> getPrimaryKey() {
        return Keys.DELAY_CODE_PK;
    }

    @Override
    public List<UniqueKey<DelayCodeRecord>> getKeys() {
        return Arrays.<UniqueKey<DelayCodeRecord>>asList(Keys.DELAY_CODE_PK, Keys.DELAY_CODE_KEY);
    }

    @Override
    public DelayCode as(String alias) {
        return new DelayCode(DSL.name(alias), this);
    }

    @Override
    public DelayCode as(Name alias) {
        return new DelayCode(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public DelayCode rename(String name) {
        return new DelayCode(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public DelayCode rename(Name name) {
        return new DelayCode(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Integer, String, String, DelayType, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}
