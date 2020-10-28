package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.Port;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.dcsa.portcall.db.tables.DelayCode.DELAY_CODE;
import static org.dcsa.portcall.db.tables.Port.PORT;
import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;
import static org.dcsa.portcall.db.tables.Terminal.TERMINAL;
import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

/**
 * <p>&copy; 2020 <a href="http://www.ponton.de" target="_blank">PONTON GmbH</a></p>
 * <p>
 * [description of the class]
 *
 * @author <a href="[hinrichs@ponton.de]">[Holm Hinrichs]</a>
 * @version 26.10.2020
 * [potential @see links]
 */

@RestController
@RequestMapping("/download")
public class DownloadController {

    private static final Logger log = LogManager.getLogger(DownloadController.class);
    private final DSLContext dsl;

    @Value("${dcsa.company}")
    private String company;

    public DownloadController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping("/PortCall_Timestamps_Export.csv")
    @Transactional(readOnly = true)
    public ResponseEntity downloadTimestampCsv(HttpServletResponse response) {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=PortCall_Timestamps_Export.csv");
        try {
            response.getOutputStream().print(this.loadTimestampsFromDbPlainSql());
        } catch (IOException e) {
            e.printStackTrace();
        }


        return null;
    }

    /**
     * Requests report in JOOQ SQL
     */

    private String loadTimestampsFromDb() {
        Port port_of_call = PORT.as("port_of_call");
        Port port_next = PORT.as("port_next");
        Port port_previous = PORT.as("port_previous");
        return this.dsl.select(
                PORT_CALL_TIMESTAMP.ID,
                VESSEL.NAME.as("Vessel Name"),
                VESSEL.IMO,
                VESSEL.TEU.as("Vessel Size (TEU)"),
                VESSEL.SERVICE_NAME_CODE.as("Service Name"),
                port_previous.UN_LOCODE.as("From Port"),
                port_next.UN_LOCODE.as("To Port"),
                PORT_CALL_TIMESTAMP.DIRECTION,
                port_of_call.UN_LOCODE.as("Port of Call"),
                TERMINAL.SMDG_CODE.as("Terminal"),
                TERMINAL.TERMINAL_NAME.as("Terminal Name"),
                TERMINAL.TERMINAL_OPERATOR.as("Terminal Operator"),
                PORT_CALL_TIMESTAMP.LOCATION_ID.as("Berth ID"),
                PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE.as("Event Message"),
                PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP,
                port_of_call.TIMEZONE,
                PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP.as("Log of Timestamp"),
                DELAY_CODE.SMDG_CODE.as("Root Cause (SMDG)"),
                PORT_CALL_TIMESTAMP.CHANGE_COMMENT.as("Change comment")).
                from(PORT_CALL_TIMESTAMP).
                leftJoin(port_of_call).
                on(PORT_CALL_TIMESTAMP.PORT_OF_CALL.eq(port_of_call.ID)).
                leftJoin(port_previous).
                on(PORT_CALL_TIMESTAMP.PORT_PREVIOUS.eq(port_previous.ID)).
                leftJoin(port_next).
                on(PORT_CALL_TIMESTAMP.PORT_NEXT.eq(port_next.ID)).
                leftJoin(TERMINAL).
                on(PORT_CALL_TIMESTAMP.TERMINAL.eq(TERMINAL.ID)).
                leftJoin(VESSEL).
                on(PORT_CALL_TIMESTAMP.VESSEL.eq(VESSEL.ID)).
                leftJoin(DELAY_CODE).
                on(PORT_CALL_TIMESTAMP.DELAY_CODE.eq(DELAY_CODE.ID)).fetch().formatCSV();

    }

    private String loadTimestampsFromDbPlainSql(){
        String sql = "select " +
                "	pct.id 						as \"ID\"," +
                "	v.name 					    as \"Vessel\"," +
                "	v.imo 						as \"IMO\"," +
                "	v.teu						as \"TEU\"," +
                "	v.service_name_code			as \"Service Name\"," +
                "	port_previous.un_locode		as \"Port Privious\"," +
                "	port_next.un_location		as \"Port Next\"," +
                "	pct.direction				as \"Direction\"," +
                "	port_of_call.un_locode		as \"Port of Call\"," +
                "	port_of_call.timezone		as \"Port of Call Timezone\"," +
                "	t.smdg_code					as \"Terminal\"," +
                "	t.terminal_name				as \"Terminal Name\"," +
                "	t.terminal_operator			as \"Terminal Operator\"," +
                "	pct.timestamp_type			as \"Event Message\"," +
                "   pct.call_sequence+1         as \"Event Sequence\","+
                "	pct.event_timestamp	" +
                "		at time zone replace(port_of_call.timezone, '+','-')		" +
                "								as \"Event Timestamp (POC Timezone)\"," +
                "	pct.event_timestamp" +
                "		at time zone 'UTC'" +
                "								as \"Event Timestamp (UTC)\"," +
                "	pct.log_of_timestamp		" +
                "		at time zone replace(port_of_call.timezone, '+','-')" +
                "								as \"Log of Timestamp (POC Timezone)\"," +
                "	pct.log_of_timestamp" +
                "		at time zone 'UTC'	" +
                "								as \"Log of Timestamp (UTC)\"," +
                "	dc.smdg_code				as \"Root cause (SMDG Code)\"," +
                "	pct.change_comment			as \"Change Comment\"" +
                "from port_call_timestamp pct " +
                "join port as port_of_call on pct.port_of_call = port_of_call.id " +
                "join port as port_previous on pct.port_previous = port_previous.id " +
                "join port as port_next on pct.port_next = port_next.id " +
                "join terminal as t on pct.terminal = t.id " +
                "join vessel as v on pct.vessel = v.id " +
                "left join delay_code dc on pct.delay_code = dc.id " +
                "order by event_timestamp";

        return this.dsl.fetch(sql).formatCSV();
    }
}
