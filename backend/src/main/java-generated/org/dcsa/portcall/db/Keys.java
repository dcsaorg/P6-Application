/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db;


import org.dcsa.portcall.db.tables.DelayCode;
import org.dcsa.portcall.db.tables.Port;
import org.dcsa.portcall.db.tables.PortCallTimestamp;
import org.dcsa.portcall.db.tables.Terminal;
import org.dcsa.portcall.db.tables.Vessel;
import org.dcsa.portcall.db.tables.records.DelayCodeRecord;
import org.dcsa.portcall.db.tables.records.PortCallTimestampRecord;
import org.dcsa.portcall.db.tables.records.PortRecord;
import org.dcsa.portcall.db.tables.records.TerminalRecord;
import org.dcsa.portcall.db.tables.records.VesselRecord;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.Internal;


/**
 * A class modelling foreign key relationships and constraints of tables of 
 * the <code>public</code> schema.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Keys {

    // -------------------------------------------------------------------------
    // IDENTITY definitions
    // -------------------------------------------------------------------------

    public static final Identity<DelayCodeRecord, Integer> IDENTITY_DELAY_CODE = Identities0.IDENTITY_DELAY_CODE;
    public static final Identity<PortRecord, Integer> IDENTITY_PORT = Identities0.IDENTITY_PORT;
    public static final Identity<PortCallTimestampRecord, Integer> IDENTITY_PORT_CALL_TIMESTAMP = Identities0.IDENTITY_PORT_CALL_TIMESTAMP;
    public static final Identity<TerminalRecord, Integer> IDENTITY_TERMINAL = Identities0.IDENTITY_TERMINAL;
    public static final Identity<VesselRecord, Integer> IDENTITY_VESSEL = Identities0.IDENTITY_VESSEL;

    // -------------------------------------------------------------------------
    // UNIQUE and PRIMARY KEY definitions
    // -------------------------------------------------------------------------

    public static final UniqueKey<DelayCodeRecord> DELAY_CODE_PK = UniqueKeys0.DELAY_CODE_PK;
    public static final UniqueKey<DelayCodeRecord> DELAY_CODE_KEY = UniqueKeys0.DELAY_CODE_KEY;
    public static final UniqueKey<PortRecord> PORT_PK = UniqueKeys0.PORT_PK;
    public static final UniqueKey<PortRecord> PORT_UQ_UN_LOCODE = UniqueKeys0.PORT_UQ_UN_LOCODE;
    public static final UniqueKey<PortCallTimestampRecord> MESSAGE_PK = UniqueKeys0.MESSAGE_PK;
    public static final UniqueKey<TerminalRecord> TERMINAL_PK = UniqueKeys0.TERMINAL_PK;
    public static final UniqueKey<TerminalRecord> TERMINAL_KEY = UniqueKeys0.TERMINAL_KEY;
    public static final UniqueKey<VesselRecord> VESSEL_PK = UniqueKeys0.VESSEL_PK;
    public static final UniqueKey<VesselRecord> VESSEL_UQ_IMO = UniqueKeys0.VESSEL_UQ_IMO;

    // -------------------------------------------------------------------------
    // FOREIGN KEY definitions
    // -------------------------------------------------------------------------

    public static final ForeignKey<PortCallTimestampRecord, VesselRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_VESSEL = ForeignKeys0.PORT_CALL_TIMESTAMP__MESSAGE_FK_VESSEL;
    public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_OF_CALL = ForeignKeys0.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_OF_CALL;
    public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_PREVIOUS = ForeignKeys0.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_PREVIOUS;
    public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_NEXT = ForeignKeys0.PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_NEXT;
    public static final ForeignKey<PortCallTimestampRecord, TerminalRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_TERMINAL = ForeignKeys0.PORT_CALL_TIMESTAMP__MESSAGE_FK_TERMINAL;
    public static final ForeignKey<TerminalRecord, PortRecord> TERMINAL__TERMINAL_FK_PORT_ID = ForeignKeys0.TERMINAL__TERMINAL_FK_PORT_ID;

    // -------------------------------------------------------------------------
    // [#1459] distribute members to avoid static initialisers > 64kb
    // -------------------------------------------------------------------------

    private static class Identities0 {
        public static Identity<DelayCodeRecord, Integer> IDENTITY_DELAY_CODE = Internal.createIdentity(DelayCode.DELAY_CODE, DelayCode.DELAY_CODE.ID);
        public static Identity<PortRecord, Integer> IDENTITY_PORT = Internal.createIdentity(Port.PORT, Port.PORT.ID);
        public static Identity<PortCallTimestampRecord, Integer> IDENTITY_PORT_CALL_TIMESTAMP = Internal.createIdentity(PortCallTimestamp.PORT_CALL_TIMESTAMP, PortCallTimestamp.PORT_CALL_TIMESTAMP.ID);
        public static Identity<TerminalRecord, Integer> IDENTITY_TERMINAL = Internal.createIdentity(Terminal.TERMINAL, Terminal.TERMINAL.ID);
        public static Identity<VesselRecord, Integer> IDENTITY_VESSEL = Internal.createIdentity(Vessel.VESSEL, Vessel.VESSEL.ID);
    }

    private static class UniqueKeys0 {
        public static final UniqueKey<DelayCodeRecord> DELAY_CODE_PK = Internal.createUniqueKey(DelayCode.DELAY_CODE, "delay_code_pk", new TableField[] { DelayCode.DELAY_CODE.ID }, true);
        public static final UniqueKey<DelayCodeRecord> DELAY_CODE_KEY = Internal.createUniqueKey(DelayCode.DELAY_CODE, "delay_code_key", new TableField[] { DelayCode.DELAY_CODE.SMDG_CODE }, true);
        public static final UniqueKey<PortRecord> PORT_PK = Internal.createUniqueKey(Port.PORT, "port_pk", new TableField[] { Port.PORT.ID }, true);
        public static final UniqueKey<PortRecord> PORT_UQ_UN_LOCODE = Internal.createUniqueKey(Port.PORT, "port_uq_un_locode", new TableField[] { Port.PORT.UN_LOCODE }, true);
        public static final UniqueKey<PortCallTimestampRecord> MESSAGE_PK = Internal.createUniqueKey(PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_pk", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.ID }, true);
        public static final UniqueKey<TerminalRecord> TERMINAL_PK = Internal.createUniqueKey(Terminal.TERMINAL, "terminal_pk", new TableField[] { Terminal.TERMINAL.ID }, true);
        public static final UniqueKey<TerminalRecord> TERMINAL_KEY = Internal.createUniqueKey(Terminal.TERMINAL, "terminal_key", new TableField[] { Terminal.TERMINAL.PORT, Terminal.TERMINAL.SMDG_CODE }, true);
        public static final UniqueKey<VesselRecord> VESSEL_PK = Internal.createUniqueKey(Vessel.VESSEL, "vessel_pk", new TableField[] { Vessel.VESSEL.ID }, true);
        public static final UniqueKey<VesselRecord> VESSEL_UQ_IMO = Internal.createUniqueKey(Vessel.VESSEL, "vessel_uq_imo", new TableField[] { Vessel.VESSEL.IMO }, true);
    }

    private static class ForeignKeys0 {
        public static final ForeignKey<PortCallTimestampRecord, VesselRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_VESSEL = Internal.createForeignKey(Keys.VESSEL_PK, PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_fk_vessel", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.VESSEL }, true);
        public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_OF_CALL = Internal.createForeignKey(Keys.PORT_PK, PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_fk_port_of_call", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_OF_CALL }, true);
        public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_PREVIOUS = Internal.createForeignKey(Keys.PORT_PK, PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_fk_port_previous", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_PREVIOUS }, true);
        public static final ForeignKey<PortCallTimestampRecord, PortRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_PORT_NEXT = Internal.createForeignKey(Keys.PORT_PK, PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_fk_port_next", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.PORT_NEXT }, true);
        public static final ForeignKey<PortCallTimestampRecord, TerminalRecord> PORT_CALL_TIMESTAMP__MESSAGE_FK_TERMINAL = Internal.createForeignKey(Keys.TERMINAL_PK, PortCallTimestamp.PORT_CALL_TIMESTAMP, "message_fk_terminal", new TableField[] { PortCallTimestamp.PORT_CALL_TIMESTAMP.TERMINAL }, true);
        public static final ForeignKey<TerminalRecord, PortRecord> TERMINAL__TERMINAL_FK_PORT_ID = Internal.createForeignKey(Keys.PORT_PK, Terminal.TERMINAL, "terminal_fk_port_id", new TableField[] { Terminal.TERMINAL.PORT }, true);
    }
}
