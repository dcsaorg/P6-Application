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
import org.jooq.Record19;
import org.jooq.Row19;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class PortCallTimestampRecord extends UpdatableRecordImpl<PortCallTimestampRecord> implements Record19<Integer, Integer, String, Integer, Integer, Integer, PortCallTimestampType, Integer, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Integer, Boolean, Boolean, String, Boolean> {

    private static final long serialVersionUID = 1L;

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
     * Setter for <code>public.port_call_timestamp.vessel_service_name</code>.
     */
    public PortCallTimestampRecord setVesselServiceName(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.vessel_service_name</code>.
     */
    public String getVesselServiceName() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_of_call</code>.
     */
    public PortCallTimestampRecord setPortOfCall(Integer value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_of_call</code>.
     */
    public Integer getPortOfCall() {
        return (Integer) get(3);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_previous</code>.
     */
    public PortCallTimestampRecord setPortPrevious(Integer value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_previous</code>.
     */
    public Integer getPortPrevious() {
        return (Integer) get(4);
    }

    /**
     * Setter for <code>public.port_call_timestamp.port_next</code>.
     */
    public PortCallTimestampRecord setPortNext(Integer value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.port_next</code>.
     */
    public Integer getPortNext() {
        return (Integer) get(5);
    }

    /**
     * Setter for <code>public.port_call_timestamp.timestamp_type</code>.
     */
    public PortCallTimestampRecord setTimestampType(PortCallTimestampType value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.timestamp_type</code>.
     */
    public PortCallTimestampType getTimestampType() {
        return (PortCallTimestampType) get(6);
    }

    /**
     * Setter for <code>public.port_call_timestamp.call_sequence</code>.
     */
    public PortCallTimestampRecord setCallSequence(Integer value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.call_sequence</code>.
     */
    public Integer getCallSequence() {
        return (Integer) get(7);
    }

    /**
     * Setter for <code>public.port_call_timestamp.event_timestamp</code>.
     */
    public PortCallTimestampRecord setEventTimestamp(OffsetDateTime value) {
        set(8, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.event_timestamp</code>.
     */
    public OffsetDateTime getEventTimestamp() {
        return (OffsetDateTime) get(8);
    }

    /**
     * Setter for <code>public.port_call_timestamp.log_of_timestamp</code>.
     */
    public PortCallTimestampRecord setLogOfTimestamp(OffsetDateTime value) {
        set(9, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.log_of_timestamp</code>.
     */
    public OffsetDateTime getLogOfTimestamp() {
        return (OffsetDateTime) get(9);
    }

    /**
     * Setter for <code>public.port_call_timestamp.direction</code>.
     */
    public PortCallTimestampRecord setDirection(Direction value) {
        set(10, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.direction</code>.
     */
    public Direction getDirection() {
        return (Direction) get(10);
    }

    /**
     * Setter for <code>public.port_call_timestamp.terminal</code>.
     */
    public PortCallTimestampRecord setTerminal(Integer value) {
        set(11, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.terminal</code>.
     */
    public Integer getTerminal() {
        return (Integer) get(11);
    }

    /**
     * Setter for <code>public.port_call_timestamp.location_id</code>.
     */
    public PortCallTimestampRecord setLocationId(String value) {
        set(12, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.location_id</code>.
     */
    public String getLocationId() {
        return (String) get(12);
    }

    /**
     * Setter for <code>public.port_call_timestamp.change_comment</code>.
     */
    public PortCallTimestampRecord setChangeComment(String value) {
        set(13, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.change_comment</code>.
     */
    public String getChangeComment() {
        return (String) get(13);
    }

    /**
     * Setter for <code>public.port_call_timestamp.delay_code</code>.
     */
    public PortCallTimestampRecord setDelayCode(Integer value) {
        set(14, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.delay_code</code>.
     */
    public Integer getDelayCode() {
        return (Integer) get(14);
    }

    /**
     * Setter for <code>public.port_call_timestamp.modifiable</code>.
     */
    public PortCallTimestampRecord setModifiable(Boolean value) {
        set(15, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.modifiable</code>.
     */
    public Boolean getModifiable() {
        return (Boolean) get(15);
    }

    /**
     * Setter for <code>public.port_call_timestamp.deleted</code>.
     */
    public PortCallTimestampRecord setDeleted(Boolean value) {
        set(16, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.deleted</code>.
     */
    public Boolean getDeleted() {
        return (Boolean) get(16);
    }

    /**
     * Setter for <code>public.port_call_timestamp.process_id</code>.
     */
    public PortCallTimestampRecord setProcessId(String value) {
        set(17, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.process_id</code>.
     */
    public String getProcessId() {
        return (String) get(17);
    }

    /**
     * Setter for <code>public.port_call_timestamp.ui_read_by_user</code>.
     */
    public PortCallTimestampRecord setUiReadByUser(Boolean value) {
        set(18, value);
        return this;
    }

    /**
     * Getter for <code>public.port_call_timestamp.ui_read_by_user</code>.
     */
    public Boolean getUiReadByUser() {
        return (Boolean) get(18);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record19 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row19<Integer, Integer, String, Integer, Integer, Integer, PortCallTimestampType, Integer, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Integer, Boolean, Boolean, String, Boolean> fieldsRow() {
        return (Row19) super.fieldsRow();
    }

    @Override
    public Row19<Integer, Integer, String, Integer, Integer, Integer, PortCallTimestampType, Integer, OffsetDateTime, OffsetDateTime, Direction, Integer, String, String, Integer, Boolean, Boolean, String, Boolean> valuesRow() {
        return (Row19) super.valuesRow();
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
    public Field<String> field3() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.VESSEL_SERVICE_NAME;
    }

    @Override
    public Field<Integer> field4() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_OF_CALL;
    }

    @Override
    public Field<Integer> field5() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_PREVIOUS;
    }

    @Override
    public Field<Integer> field6() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_NEXT;
    }

    @Override
    public Field<PortCallTimestampType> field7() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE;
    }

    @Override
    public Field<Integer> field8() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.CALL_SEQUENCE;
    }

    @Override
    public Field<OffsetDateTime> field9() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP;
    }

    @Override
    public Field<OffsetDateTime> field10() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP;
    }

    @Override
    public Field<Direction> field11() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.DIRECTION;
    }

    @Override
    public Field<Integer> field12() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.TERMINAL;
    }

    @Override
    public Field<String> field13() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.LOCATION_ID;
    }

    @Override
    public Field<String> field14() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.CHANGE_COMMENT;
    }

    @Override
    public Field<Integer> field15() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.DELAY_CODE;
    }

    @Override
    public Field<Boolean> field16() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.MODIFIABLE;
    }

    @Override
    public Field<Boolean> field17() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.DELETED;
    }

    @Override
    public Field<String> field18() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.PROCESS_ID;
    }

    @Override
    public Field<Boolean> field19() {
        return PortCallTimestamp.PORT_CALL_TIMESTAMP.UI_READ_BY_USER;
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
    public String component3() {
        return getVesselServiceName();
    }

    @Override
    public Integer component4() {
        return getPortOfCall();
    }

    @Override
    public Integer component5() {
        return getPortPrevious();
    }

    @Override
    public Integer component6() {
        return getPortNext();
    }

    @Override
    public PortCallTimestampType component7() {
        return getTimestampType();
    }

    @Override
    public Integer component8() {
        return getCallSequence();
    }

    @Override
    public OffsetDateTime component9() {
        return getEventTimestamp();
    }

    @Override
    public OffsetDateTime component10() {
        return getLogOfTimestamp();
    }

    @Override
    public Direction component11() {
        return getDirection();
    }

    @Override
    public Integer component12() {
        return getTerminal();
    }

    @Override
    public String component13() {
        return getLocationId();
    }

    @Override
    public String component14() {
        return getChangeComment();
    }

    @Override
    public Integer component15() {
        return getDelayCode();
    }

    @Override
    public Boolean component16() {
        return getModifiable();
    }

    @Override
    public Boolean component17() {
        return getDeleted();
    }

    @Override
    public String component18() {
        return getProcessId();
    }

    @Override
    public Boolean component19() {
        return getUiReadByUser();
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
    public String value3() {
        return getVesselServiceName();
    }

    @Override
    public Integer value4() {
        return getPortOfCall();
    }

    @Override
    public Integer value5() {
        return getPortPrevious();
    }

    @Override
    public Integer value6() {
        return getPortNext();
    }

    @Override
    public PortCallTimestampType value7() {
        return getTimestampType();
    }

    @Override
    public Integer value8() {
        return getCallSequence();
    }

    @Override
    public OffsetDateTime value9() {
        return getEventTimestamp();
    }

    @Override
    public OffsetDateTime value10() {
        return getLogOfTimestamp();
    }

    @Override
    public Direction value11() {
        return getDirection();
    }

    @Override
    public Integer value12() {
        return getTerminal();
    }

    @Override
    public String value13() {
        return getLocationId();
    }

    @Override
    public String value14() {
        return getChangeComment();
    }

    @Override
    public Integer value15() {
        return getDelayCode();
    }

    @Override
    public Boolean value16() {
        return getModifiable();
    }

    @Override
    public Boolean value17() {
        return getDeleted();
    }

    @Override
    public String value18() {
        return getProcessId();
    }

    @Override
    public Boolean value19() {
        return getUiReadByUser();
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
    public PortCallTimestampRecord value3(String value) {
        setVesselServiceName(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value4(Integer value) {
        setPortOfCall(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value5(Integer value) {
        setPortPrevious(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value6(Integer value) {
        setPortNext(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value7(PortCallTimestampType value) {
        setTimestampType(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value8(Integer value) {
        setCallSequence(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value9(OffsetDateTime value) {
        setEventTimestamp(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value10(OffsetDateTime value) {
        setLogOfTimestamp(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value11(Direction value) {
        setDirection(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value12(Integer value) {
        setTerminal(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value13(String value) {
        setLocationId(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value14(String value) {
        setChangeComment(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value15(Integer value) {
        setDelayCode(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value16(Boolean value) {
        setModifiable(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value17(Boolean value) {
        setDeleted(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value18(String value) {
        setProcessId(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord value19(Boolean value) {
        setUiReadByUser(value);
        return this;
    }

    @Override
    public PortCallTimestampRecord values(Integer value1, Integer value2, String value3, Integer value4, Integer value5, Integer value6, PortCallTimestampType value7, Integer value8, OffsetDateTime value9, OffsetDateTime value10, Direction value11, Integer value12, String value13, String value14, Integer value15, Boolean value16, Boolean value17, String value18, Boolean value19) {
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
        value14(value14);
        value15(value15);
        value16(value16);
        value17(value17);
        value18(value18);
        value19(value19);
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
    public PortCallTimestampRecord(Integer id, Integer vessel, String vesselServiceName, Integer portOfCall, Integer portPrevious, Integer portNext, PortCallTimestampType timestampType, Integer callSequence, OffsetDateTime eventTimestamp, OffsetDateTime logOfTimestamp, Direction direction, Integer terminal, String locationId, String changeComment, Integer delayCode, Boolean modifiable, Boolean deleted, String processId, Boolean uiReadByUser) {
        super(PortCallTimestamp.PORT_CALL_TIMESTAMP);

        setId(id);
        setVessel(vessel);
        setVesselServiceName(vesselServiceName);
        setPortOfCall(portOfCall);
        setPortPrevious(portPrevious);
        setPortNext(portNext);
        setTimestampType(timestampType);
        setCallSequence(callSequence);
        setEventTimestamp(eventTimestamp);
        setLogOfTimestamp(logOfTimestamp);
        setDirection(direction);
        setTerminal(terminal);
        setLocationId(locationId);
        setChangeComment(changeComment);
        setDelayCode(delayCode);
        setModifiable(modifiable);
        setDeleted(deleted);
        setProcessId(processId);
        setUiReadByUser(uiReadByUser);
    }
}
