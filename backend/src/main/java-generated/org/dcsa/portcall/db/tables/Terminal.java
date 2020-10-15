/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables;


import java.util.Arrays;
import java.util.List;

import org.dcsa.portcall.db.Keys;
import org.dcsa.portcall.db.Public;
import org.dcsa.portcall.db.tables.records.TerminalRecord;
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
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Terminal extends TableImpl<TerminalRecord> {

    private static final long serialVersionUID = 1744587816;

    /**
     * The reference instance of <code>public.terminal</code>
     */
    public static final Terminal TERMINAL = new Terminal();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<TerminalRecord> getRecordType() {
        return TerminalRecord.class;
    }

    /**
     * The column <code>public.terminal.id</code>.
     */
    public final TableField<TerminalRecord, Integer> ID = createField(DSL.name("id"), org.jooq.impl.SQLDataType.INTEGER.nullable(false).defaultValue(org.jooq.impl.DSL.field("nextval('terminal_id_seq'::regclass)", org.jooq.impl.SQLDataType.INTEGER)), this, "");

    /**
     * The column <code>public.terminal.port</code>.
     */
    public final TableField<TerminalRecord, Integer> PORT = createField(DSL.name("port"), org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.terminal.smdg_code</code>.
     */
    public final TableField<TerminalRecord, String> SMDG_CODE = createField(DSL.name("smdg_code"), org.jooq.impl.SQLDataType.VARCHAR(10).nullable(false), this, "");

    /**
     * The column <code>public.terminal.terminal_name</code>.
     */
    public final TableField<TerminalRecord, String> TERMINAL_NAME = createField(DSL.name("terminal_name"), org.jooq.impl.SQLDataType.VARCHAR(150), this, "");

    /**
     * The column <code>public.terminal.terminal_operator</code>.
     */
    public final TableField<TerminalRecord, String> TERMINAL_OPERATOR = createField(DSL.name("terminal_operator"), org.jooq.impl.SQLDataType.VARCHAR(200), this, "");

    /**
     * Create a <code>public.terminal</code> table reference
     */
    public Terminal() {
        this(DSL.name("terminal"), null);
    }

    /**
     * Create an aliased <code>public.terminal</code> table reference
     */
    public Terminal(String alias) {
        this(DSL.name(alias), TERMINAL);
    }

    /**
     * Create an aliased <code>public.terminal</code> table reference
     */
    public Terminal(Name alias) {
        this(alias, TERMINAL);
    }

    private Terminal(Name alias, Table<TerminalRecord> aliased) {
        this(alias, aliased, null);
    }

    private Terminal(Name alias, Table<TerminalRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    public <O extends Record> Terminal(Table<O> child, ForeignKey<O, TerminalRecord> key) {
        super(child, key, TERMINAL);
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public Identity<TerminalRecord, Integer> getIdentity() {
        return Keys.IDENTITY_TERMINAL;
    }

    @Override
    public UniqueKey<TerminalRecord> getPrimaryKey() {
        return Keys.TERMINAL_PK;
    }

    @Override
    public List<UniqueKey<TerminalRecord>> getKeys() {
        return Arrays.<UniqueKey<TerminalRecord>>asList(Keys.TERMINAL_PK, Keys.TERMINAL_KEY);
    }

    @Override
    public List<ForeignKey<TerminalRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<TerminalRecord, ?>>asList(Keys.TERMINAL__TERMINAL_FK_PORT_ID);
    }

    public Port port() {
        return new Port(this, Keys.TERMINAL__TERMINAL_FK_PORT_ID);
    }

    @Override
    public Terminal as(String alias) {
        return new Terminal(DSL.name(alias), this);
    }

    @Override
    public Terminal as(Name alias) {
        return new Terminal(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public Terminal rename(String name) {
        return new Terminal(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Terminal rename(Name name) {
        return new Terminal(name, null);
    }

    // -------------------------------------------------------------------------
    // Row5 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row5<Integer, Integer, String, String, String> fieldsRow() {
        return (Row5) super.fieldsRow();
    }
}