/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import java.time.OffsetDateTime;

import org.dcsa.portcall.db.enums.Direction;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.PortCallTimestamp;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record13;
import org.jooq.Row13;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class PortCallTimestampRecord extends UpdatableRecordImpl<PortCallTimestampRecord> implements Record13<Integer, Integer, Integer, Integer, Integer, PortCallTimestampType, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Boolean> {

    private static final long serialVersionUID = -152562588;

    /**
     * Setter for <code>public.port_call_timestamp.id</code>.
     */
    public PortCallTimestampRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.port_call_timestamp.vessel</code>.
     */
    public PortCallTimestampRecord setVessel(Integer value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.vessel</code>.
     */
    public Integer getVessel() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_approach</code>.
     */
    public PortCallTimestampRecord setPortApproach(Integer value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_approach</code>.
     */
    public Integer getPortApproach() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_from</code>.
     */
    public PortCallTimestampRecord setPortFrom(Integer value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_from</code>.
     */
    public Integer getPortFrom() {
        return (Integer) get(3);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_next</code>.
     */
    public PortCallTimestampRecord setPortNext(Integer value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_next</code>.
     */
    public Integer getPortNext() {
        return (Integer) get(4);
    }

    /**
     * Setter for <code>public.port_call_timestamp.timestamp_type</code>.
     */
    public PortCallTimestampRecord setTimestampType(PortCallTimestampType value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.timestamp_type</code>.
     */
    public PortCallTimestampType getTimestampType() {
        return (PortCallTimestampType) get(5);
    }

    /**
     * Setter for <code>public.port_call_timestamp.event_timestamp</code>.
     */
    public PortCallTimestampRecord setEventTimestamp(OffsetDateTime value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.event_timestamp</code>.
     */
    public OffsetDateTime getEventTimestamp() {
        return (OffsetDateTime) get(6);
    }

    /**
     * Setter for <code>public.port_call_timestamp.log_of_call</code>.
     */
    public PortCallTimestampRecord setLogOfCall(OffsetDateTime value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.log_of_call</code>.
     */
    public OffsetDateTime getLogOfCall() {
        return (OffsetDateTime) get(7);
    }

    /**
     * Setter for <code>public.port_call_timestamp.direction</code>.
     */
    public PortCallTimestampRecord setDirection(Direction value) {
        set(8, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.direction</code>.
     */
    public Direction getDirection() {
        return (Direction) get(8);
    }

    /**
     * Setter for <code>public.port_call_timestamp.terminal</code>.
     */
    public PortCallTimestampRecord setTerminal(Integer value) {
        set(9, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.terminal</code>.
     */
    public Integer getTerminal() {
        return (Integer) get(9);
    }

    /**
     * Setter for <code>public.port_call_timestamp.location_id</code>.
     */
    public PortCallTimestampRecord setLocationId(String value) {
        set(10, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.location_id</code>.
     */
    public String getLocationId() {
        return (String) get(10);
    }

    /**
     * Setter for <code>public.port_call_timestamp.change_comment</code>.
     */
    public PortCallTimestampRecord setChangeComment(String value) {
        set(11, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.change_comment</code>.
     */
    public String getChangeComment() {
        return (String) get(11);
    }

    /**
     * Setter for <code>public.port_call_timestamp.deleted</code>.
     */
    public PortCallTimestampRecord setDeleted(Boolean value) {
        set(12, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.deleted</code>.
     */
    public Boolean getDeleted() {
        return (Boolean) get(12);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record13 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row13<Integer, Integer, Integer, Integer, Integer, PortCallTimestampType, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Boolean> fieldsRow() {
        return (Row13) super.fieldsRow();
    }

    @Override
    public Row13<Integer, Integer, Integer, Integer, Integer, PortCallTimestampType, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Boolean> valuesRow() {
        return (Row13) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.ID;
    }

    @Override
    public Field<Integer> field2() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.VESSEL;
    }

    @Override
    public Field<Integer> field3() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_APPROACH;
    }

    @Override
    public Field<Integer> field4() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_FROM;
    }

    @Override
    public Field<Integer> field5() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_NEXT;
    }

    @Override
    public Field<PortCallTimestampType> field6() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE;
    }

    @Override
    public Field<OffsetDateTime> field7() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP;
    }

    @Override
    public Field<OffsetDateTime> field8() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.LOG_OF_CALL;
    }

    @Override
    public Field<Direction> field9() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.DIRECTION;
    }

    @Override
    public Field<Integer> field10() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.TERMINAL;
    }

    @Override
    public Field<String> field11() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.LOCATION_ID;
    }

    @Override
    public Field<String> field12() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.CHANGE_COMMENT;
    }

    @Override
    public Field<Boolean> field13() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.DELETED;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public Integer component2() {
        return getVessel();
    }

    @Override
    public Integer component3() {
        return getPortApproach();
    }

    @Override
    public Integer component4() {
        return getPortFrom();
    }

    @Override
    public Integer component5() {
        return getPortNext();
    }

    @Override
    public PortCallTimestampType component6() {
        return getTimestampType();
    }

    @Override
    public OffsetDateTime component7() {
        return getEventTimestamp();
    }

    @Override
    public OffsetDateTime component8() {
        return getLogOfCall();
    }

    @Override
    public Direction component9() {
        return getDirection();
    }

    @Override
    public Integer component10() {
        return getTerminal();
    }

    @Override
    public String component11() {
        return getLocationId();
    }

    @Override
    public String component12() {
        return getChangeComment();
    }

    @Override
    public Boolean component13() {
        return getDeleted();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public Integer value2() {
        return getVessel();
    }

    @Override
    public Integer value3() {
        return getPortApproach();
    }

    @Override
    public Integer value4() {
        return getPortFrom();
    }

    @Override
    public Integer value5() {
        return getPortNext();
    }

    @Override
    public PortCallTimestampType value6() {
        return getTimestampType();
    }

    @Override
    public OffsetDateTime value7() {
        return getEventTimestamp();
    }

    @Override
    public OffsetDateTime value8() {
        return getLogOfCall();
    }

    @Override
    public Direction value9() {
        return getDirection();
    }

    @Override
    public Integer value10() {
        return getTerminal();
    }

    @Override
    public String value11() {
        return getLocationId();
    }

    @Override
    public String value12() {
        return getChangeComment();
    }

    @Override
    public Boolean value13() {
        return getDeleted();
    }

    @Override
    public PortCallTimestampRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value2(Integer value) {
        setVessel(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value3(Integer value) {
        setPortApproach(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value4(Integer value) {
        setPortFrom(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value5(Integer value) {
        setPortNext(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value6(PortCallTimestampType value) {
        setTimestampType(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value7(OffsetDateTime value) {
        setEventTimestamp(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value8(OffsetDateTime value) {
        setLogOfCall(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value9(Direction value) {
        setDirection(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value10(Integer value) {
        setTerminal(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value11(String value) {
        setLocationId(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value12(String value) {
        setChangeComment(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value13(Boolean value) {
        setDeleted(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord values(Integer value1, Integer value2, Integer value3, Integer value4, Integer value5, PortCallTimestampType value6, OffsetDateTime value7, OffsetDateTime value8, Direction value9, Integer value10, String value11, String value12, Boolean value13) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        value7(value7);
        value8(value8);
        value9(value9);
        value10(value10);
        value11(value11);
        value12(value12);
        value13(value13);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached PortCallTimestampRecord
     */
    public PortCallTimestampRecord() {
        super(PortCallTimestamp.PORT_CALL_TIMESTAMP);
    }

    /**
     * Create a detached, initialised PortCallTimestampRecord
     */
    public PortCallTimestampRecord(Integer id, Integer vessel, Integer portApproach, Integer portFrom, Integer portNext, PortCallTimestampType timestampType, OffsetDateTime eventTimestamp, OffsetDateTime logOfCall, Direction direction, Integer terminal, String locationId, String changeComment, Boolean deleted) {
        super(PortCallTimestamp.PORT_CALL_TIMESTAMP);

        set(0, id);
        set(1, vessel);
        set(2, portApproach);
        set(3, portFrom);
        set(4, portNext);
        set(5, timestampType);
        set(6, eventTimestamp);
        set(7, logOfCall);
        set(8, direction);
        set(9, terminal);
        set(10, locationId);
        set(11, changeComment);
        set(12, deleted);
    }
}
