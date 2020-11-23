/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db.tables.pojos;


import org.dcsa.portcall.db.enums.MessageDirection;

import java.io.Serializable;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer          id;
    private MessageDirection direction;
    private Integer          timestampId;
    private String           filename;
    private byte[]           payload;

    public Message() {}

    public Message(Message value) {
        this.id = value.id;
        this.direction = value.direction;
        this.timestampId = value.timestampId;
        this.filename = value.filename;
        this.payload = value.payload;
    }

    public Message(
        Integer          id,
        MessageDirection direction,
        Integer          timestampId,
        String           filename,
        byte[]           payload
    ) {
        this.id = id;
        this.direction = direction;
        this.timestampId = timestampId;
        this.filename = filename;
        this.payload = payload;
    }

    /**
     * Getter for <code>public.message.id</code>.
     */
    public Integer getId() {
        return this.id;
    }

    /**
     * Setter for <code>public.message.id</code>.
     */
    public Message setId(Integer id) {
        this.id = id;
        return this;
    }

    /**
     * Getter for <code>public.message.direction</code>.
     */
    public MessageDirection getDirection() {
        return this.direction;
    }

    /**
     * Setter for <code>public.message.direction</code>.
     */
    public Message setDirection(MessageDirection direction) {
        this.direction = direction;
        return this;
    }

    /**
     * Getter for <code>public.message.timestamp_id</code>.
     */
    public Integer getTimestampId() {
        return this.timestampId;
    }

    /**
     * Setter for <code>public.message.timestamp_id</code>.
     */
    public Message setTimestampId(Integer timestampId) {
        this.timestampId = timestampId;
        return this;
    }

    /**
     * Getter for <code>public.message.filename</code>.
     */
    public String getFilename() {
        return this.filename;
    }

    /**
     * Setter for <code>public.message.filename</code>.
     */
    public Message setFilename(String filename) {
        this.filename = filename;
        return this;
    }

    /**
     * Getter for <code>public.message.payload</code>.
     */
    public byte[] getPayload() {
        return this.payload;
    }

    /**
     * Setter for <code>public.message.payload</code>.
     */
    public Message setPayload(byte[] payload) {
        this.payload = payload;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Message (");

        sb.append(id);
        sb.append(", ").append(direction);
        sb.append(", ").append(timestampId);
        sb.append(", ").append(filename);
        sb.append(", ").append("[binary...]");

        sb.append(")");
        return sb.toString();
    }
}
