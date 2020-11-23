/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables;


import org.dcsa.portcall.db.Keys;
import org.dcsa.portcall.db.Public;
import org.dcsa.portcall.db.enums.Direction;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.records.PortCallTimestampRecord;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class PortCallTimestamp extends TableImpl<PortCallTimestampRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.port_call_timestamp</code>
     */
    public static final PortCallTimestamp PORT_CALL_TIMESTAMP = new PortCallTimestamp();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<PortCallTimestampRecord> getRecordType() {
        return PortCallTimestampRecord.class;
    }

    /**
     * The column <code>public.port_call_timestamp.id</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column <code>public.port_call_timestamp.vessel</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> VESSEL = createField(DSL.name("vessel"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.vessel_service_name</code>.
     */
    public final TableField<PortCallTimestampRecord, String> VESSEL_SERVICE_NAME = createField(DSL.name("vessel_service_name"), SQLDataType.VARCHAR(255), this, "");

    /**
     * The column <code>public.port_call_timestamp.port_of_call</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> PORT_OF_CALL = createField(DSL.name("port_of_call"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.port_previous</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> PORT_PREVIOUS = createField(DSL.name("port_previous"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.port_next</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> PORT_NEXT = createField(DSL.name("port_next"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.timestamp_type</code>.
     */
    public final TableField<PortCallTimestampRecord, PortCallTimestampType> TIMESTAMP_TYPE = createField(DSL.name("timestamp_type"), SQLDataType.VARCHAR.nullable(false).asEnumDataType(org.dcsa.portcall.db.enums.PortCallTimestampType.class), this, "");

    /**
     * The column <code>public.port_call_timestamp.call_sequence</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> CALL_SEQUENCE = createField(DSL.name("call_sequence"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.event_timestamp</code>.
     */
    public final TableField<PortCallTimestampRecord, OffsetDateTime> EVENT_TIMESTAMP = createField(DSL.name("event_timestamp"), SQLDataType.TIMESTAMPWITHTIMEZONE(6).nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.log_of_timestamp</code>.
     */
    public final TableField<PortCallTimestampRecord, OffsetDateTime> LOG_OF_TIMESTAMP = createField(DSL.name("log_of_timestamp"), SQLDataType.TIMESTAMPWITHTIMEZONE(6).nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.direction</code>.
     */
    public final TableField<PortCallTimestampRecord, Direction> DIRECTION = createField(DSL.name("direction"), SQLDataType.VARCHAR.nullable(false).asEnumDataType(org.dcsa.portcall.db.enums.Direction.class), this, "");

    /**
     * The column <code>public.port_call_timestamp.terminal</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> TERMINAL = createField(DSL.name("terminal"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.port_call_timestamp.location_id</code>.
     */
    public final TableField<PortCallTimestampRecord, String> LOCATION_ID = createField(DSL.name("location_id"), SQLDataType.VARCHAR(255), this, "");

    /**
     * The column <code>public.port_call_timestamp.change_comment</code>.
     */
    public final TableField<PortCallTimestampRecord, String> CHANGE_COMMENT = createField(DSL.name("change_comment"), SQLDataType.VARCHAR(512), this, "");

    /**
     * The column <code>public.port_call_timestamp.delay_code</code>.
     */
    public final TableField<PortCallTimestampRecord, Integer> DELAY_CODE = createField(DSL.name("delay_code"), SQLDataType.INTEGER, this, "");

    /**
     * The column <code>public.port_call_timestamp.deleted</code>.
     */
    public final TableField<PortCallTimestampRecord, Boolean> DELETED = createField(DSL.name("deleted"), SQLDataType.BOOLEAN.nullable(false).defaultValue(DSL.field("false", SQLDataType.BOOLEAN)), this, "");

    private PortCallTimestamp(Name alias, Table<PortCallTimestampRecord> aliased) {
        this(alias, aliased, null);
    }

    private PortCallTimestamp(Name alias, Table<PortCallTimestampRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>public.port_call_timestamp</code> table reference
     */
    public PortCallTimestamp(String alias) {
        this(DSL.name(alias), PORT_CALL_TIMESTAMP);
    }

    /**
     * Create an aliased <code>public.port_call_timestamp</code> table reference
     */
    public PortCallTimestamp(Name alias) {
        this(alias, PORT_CALL_TIMESTAMP);
    }

    /**
     * Create a <code>public.port_call_timestamp</code> table reference
     */
    public PortCallTimestamp() {
        this(DSL.name("port_call_timestamp"), null);
    }

    public <O extends Record> PortCallTimestamp(Table<O> child, ForeignKey<O, PortCallTimestampRecord> key) {
        super(child, key, PORT_CALL_TIMESTAMP);
    }

    @Override
    public Schema getSchema() {
        return Public.PUBLIC;
    }

    @Override
    public Identity<PortCallTimestampRecord, Integer> getIdentity() {
        return (Identity<PortCallTimestampRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<PortCallTimestampRecord> getPrimaryKey() {
        return Keys.PORT_CALL_TIMESTAMP_PK;
    }

    @Override
    public List<UniqueKey<PortCallTimestampRecord>> getKeys() {
        return Arrays.<UniqueKey<PortCallTimestampRecord>>asList(Keys.PORT_CALL_TIMESTAMP_PK);
    }

    @Override
    public List<ForeignKey<PortCallTimestampRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<PortCallTimestampRecord, ?>>asList(Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_VESSEL, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_OF_CALL, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_PREVIOUS, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_NEXT, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_TERMINAL, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_DELAY_CODE);
    }

    public Vessel vessel() {
        return new Vessel(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_VESSEL);
    }

    public Port messageFkPortOfCall() {
        return new Port(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_OF_CALL);
    }

    public Port messageFkPortPrevious() {
        return new Port(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_PREVIOUS);
    }

    public Port messageFkPortNext() {
        return new Port(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_NEXT);
    }

    public Terminal terminal() {
        return new Terminal(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_TERMINAL);
    }

    public DelayCode delayCode() {
        return new DelayCode(this, Keys.PORT_CALL_TIMESTAMP__MESSAGE_FK_DELAY_CODE);
    }

    @Override
    public PortCallTimestamp as(String alias) {
        return new PortCallTimestamp(DSL.name(alias), this);
    }

    @Override
    public PortCallTimestamp as(Name alias) {
        return new PortCallTimestamp(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public PortCallTimestamp rename(String name) {
        return new PortCallTimestamp(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public PortCallTimestamp rename(Name name) {
        return new PortCallTimestamp(name, null);
    }

    // -------------------------------------------------------------------------
    // Row16 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row16<Integer, Integer, String, Integer, Integer, Integer, PortCallTimestampType, Integer, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Integer, Boolean> fieldsRow() {
        return (Row16) super.fieldsRow();
    }
}
