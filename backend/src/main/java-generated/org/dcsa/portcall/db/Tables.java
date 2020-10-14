/*
 * This file is generated by jOOQ.
 */
package org.dcsa.portcall.db;


import org.dcsa.portcall.db.tables.Port;
import org.dcsa.portcall.db.tables.PortCallTimestamp;
import org.dcsa.portcall.db.tables.Terminal;
import org.dcsa.portcall.db.tables.Vessel;


/**
 * Convenience access to all tables in public
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Tables {

    /**
     * The table <code>public.port</code>.
     */
    public static final Port PORT = Port.PORT;

    /**
     * The table <code>public.port_call_timestamp</code>.
     */
    public static final PortCallTimestamp PORT_CALL_TIMESTAMP = PortCallTimestamp.PORT_CALL_TIMESTAMP;

    /**
     * The table <code>public.terminal</code>.
     */
    public static final Terminal TERMINAL = Terminal.TERMINAL;

    /**
     * The table <code>public.vessel</code>.
     */
    public static final Vessel VESSEL = Vessel.VESSEL;
}
