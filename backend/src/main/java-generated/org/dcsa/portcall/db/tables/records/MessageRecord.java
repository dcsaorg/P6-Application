/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.records;


import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.Message;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class MessageRecord extends UpdatableRecordImpl<MessageRecord> implements Record5<Integer, MessageDirection, Integer, String, byte[]> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.message.id</code>.
     */
    public MessageRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.message.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.message.direction</code>.
     */
    public MessageRecord setDirection(MessageDirection value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.message.direction</code>.
     */
    public MessageDirection getDirection() {
        return (MessageDirection) get(1);
    }

    /**
     * Setter for <code>public.message.timestamp_id</code>.
     */
    public MessageRecord setTimestampId(Integer value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.message.timestamp_id</code>.
     */
    public Integer getTimestampId() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>public.message.filename</code>.
     */
    public MessageRecord setFilename(String value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.message.filename</code>.
     */
    public String getFilename() {
        return (String) get(3);
    }

    /**
     * Setter for <code>public.message.payload</code>.
     */
    public MessageRecord setPayload(byte[] value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.message.payload</code>.
     */
    public byte[] getPayload() {
        return (byte[]) get(4);
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
    public Row5<Integer, MessageDirection, Integer, String, byte[]> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    @Override
    public Row5<Integer, MessageDirection, Integer, String, byte[]> valuesRow() {
        return (Row5) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return Message.MESSAGE.ID;
    }

    @Override
    public Field<MessageDirection> field2() {
        return Message.MESSAGE.DIRECTION;
    }

    @Override
    public Field<Integer> field3() {
        return Message.MESSAGE.TIMESTAMP_ID;
    }

    @Override
    public Field<String> field4() {
        return Message.MESSAGE.FILENAME;
    }

    @Override
    public Field<byte[]> field5() {
        return Message.MESSAGE.PAYLOAD;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public MessageDirection component2() {
        return getDirection();
    }

    @Override
    public Integer component3() {
        return getTimestampId();
    }

    @Override
    public String component4() {
        return getFilename();
    }

    @Override
    public byte[] component5() {
        return getPayload();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public MessageDirection value2() {
        return getDirection();
    }

    @Override
    public Integer value3() {
        return getTimestampId();
    }

    @Override
    public String value4() {
        return getFilename();
    }

    @Override
    public byte[] value5() {
        return getPayload();
    }

    @Override
    public MessageRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public MessageRecord value2(MessageDirection value) {
        setDirection(value);
        return this;
    }

    @Override
    public MessageRecord value3(Integer value) {
        setTimestampId(value);
        return this;
    }

    @Override
    public MessageRecord value4(String value) {
        setFilename(value);
        return this;
    }

    @Override
    public MessageRecord value5(byte[] value) {
        setPayload(value);
        return this;
    }

    @Override
    public MessageRecord values(Integer value1, MessageDirection value2, Integer value3, String value4, byte[] value5) {
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
     * Create a detached MessageRecord
     */
    public MessageRecord() {
        super(Message.MESSAGE);
    }

    /**
     * Create a detached, initialised MessageRecord
     */
    public MessageRecord(Integer id, MessageDirection direction, Integer timestampId, String filename, byte[] payload) {
        super(Message.MESSAGE);

        setId(id);
        setDirection(direction);
        setTimestampId(timestampId);
        setFilename(filename);
        setPayload(payload);
    }
}