/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables;


import java.util.Arrays;
import java.util.List;

import org.dcsa.portcall.db.Keys;
import org.dcsa.portcall.db.Public;
import org.dcsa.portcall.db.tables.records.PortRecord;
import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row6;
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
public class Port extends TableImpl<PortRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.port</code>
     */
    public static final Port PORT = new Port();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<PortRecord> getRecordType() {
        return PortRecord.class;
    }

    /**
     * The column <code>public.port.id</code>.
     */
    public final TableField<PortRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column <code>public.port.name</code>.
     */
    public final TableField<PortRecord, String> NAME = createField(DSL.name("name"), SQLDataType.VARCHAR(150).nullable(false), this, "");

    /**
     * The column <code>public.port.un_country</code>.
     */
    public final TableField<PortRecord, String> UN_COUNTRY = createField(DSL.name("un_country"), SQLDataType.VARCHAR(2).nullable(false), this, "");

    /**
     * The column <code>public.port.un_locode</code>.
     */
    public final TableField<PortRecord, String> UN_LOCODE = createField(DSL.name("un_locode"), SQLDataType.VARCHAR(6).nullable(false), this, "");

    /**
     * The column <code>public.port.un_location</code>.
     */
    public final TableField<PortRecord, String> UN_LOCATION = createField(DSL.name("un_location"), SQLDataType.VARCHAR(3).nullable(false), this, "");

    /**
     * The column <code>public.port.timezone</code>.
     */
    public final TableField<PortRecord, String> TIMEZONE = createField(DSL.name("timezone"), SQLDataType.VARCHAR(40), this, "");

    private Port(Name alias, Table<PortRecord> aliased) {
        this(alias, aliased, null);
    }

    private Port(Name alias, Table<PortRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>public.port</code> table reference
     */
    public Port(String alias) {
        this(DSL.name(alias), PORT);
    }

    /**
     * Create an aliased <code>public.port</code> table reference
     */
    public Port(Name alias) {
        this(alias, PORT);
    }

    /**
     * Create a <code>public.port</code> table reference
     */
    public Port() {
        this(DSL.name("port"), null);
    }

    public <O extends Record> Port(Table<O> child, ForeignKey<O, PortRecord> key) {
        super(child, key, PORT);
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public Identity<PortRecord, Integer> getIdentity() {
        return (Identity<PortRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<PortRecord> getPrimaryKey() {
        return Keys.PORT_PK;
    }

    @Override
    public List<UniqueKey<PortRecord>> getKeys() {
        return Arrays.<UniqueKey<PortRecord>>asList(Keys.PORT_PK, Keys.PORT_UQ_UN_LOCODE);
    }

    @Override
    public Port as(String alias) {
        return new Port(DSL.name(alias), this);
    }

    @Override
    public Port as(Name alias) {
        return new Port(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Port rename(String name) {
        return new Port(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Port rename(Name name) {
        return new Port(name, null);
    }

    // -------------------------------------------------------------------------
    // Row6 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row6<Integer, String, String, String, String, String> fieldsRow() {
        return (Row6) super.fieldsRow();
    }
}
