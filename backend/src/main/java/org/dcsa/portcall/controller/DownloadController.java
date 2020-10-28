package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.dcsa.portcall.db.tables.Port;
import org.jooq.DSLContext;
import org.jooq.Result;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;
import static org.dcsa.portcall.db.tables.Port.PORT;
import static org.dcsa.portcall.db.tables.Terminal.TERMINAL;
import static org.dcsa.portcall.db.tables.Vessel.VESSEL;
import static org.dcsa.portcall.db.tables.DelayCode.DELAY_CODE;

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
     * @return
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
        String sql = "select \n" +
                "\tpct.id \t\t\t\t\t\tas \"ID\",\n" +
                "\tv.\"name\" \t\t\t\t\tas \"Vessel\",\n" +
                "\tv.imo \t\t\t\t\t\tas \"IMO\",\n" +
                "\tv.teu\t\t\t\t\t\tas \"TEU\",\n" +
                "\tv.service_name_code\t\t\tas \"Service Name\",\n" +
                "\tport_previous.un_locode\t\tas \"Port Privious\",\n" +
                "\tport_next.un_location\t\tas \"Port Next\",\n" +
                "\tpct.direction\t\t\t\tas \"Direction\",\n" +
                "\tport_of_call.un_locode\t\tas \"Port of Call\",\n" +
                "\tport_of_call.timezone\t\tas \"Port of Call Timezone\",\n" +
                "\tt.smdg_code\t\t\t\t\tas \"Terminal\",\n" +
                "\tt.terminal_name\t\t\t\tas \"Terminal Name\",\n" +
                "\tt.terminal_operator\t\t\tas \"Terminal Operator\",\n" +
                "\tpct.timestamp_type\t\t\tas \"Event Message\",\n" +
                "\tpct.event_timestamp\t\n" +
                "\t\tat time zone replace(port_of_call.timezone, '+','-')\t\t\n" +
                "\t\t\t\t\t\t\t\tas \"Event Timestamp (POC Timezone)\",\n" +
                "\tpct.event_timestamp\n" +
                "\t\tat time zone 'UTC'\n" +
                "\t\t\t\t\t\t\t\tas \"Event Timestamp (UTC)\",\n" +
                "\tpct.log_of_timestamp\t\t\n" +
                "\t\tat time zone replace(port_of_call.timezone, '+','-')\n" +
                "\t\t\t\t\t\t\t\tas \"Log of Timestamp (POC Timezone)\",\n" +
                "\tpct.log_of_timestamp\n" +
                "\t\tat time zone 'UTC'\t\n" +
                "\t\t\t\t\t\t\t\tas \"Log of Timestamp (UTC)\",\n" +
                "\tdc.smdg_code\t\t\t\tas \"Root cause (SMDG Code)\",\n" +
                "\tpct.change_comment\t\t\tas \"Change Comment\"\n" +
                "\tfrom port_call_timestamp pct\n" +
                "join port as port_of_call on pct.port_of_call = port_of_call.id\n" +
                "join port as port_previous on pct.port_previous = port_previous.id\n" +
                "join port as port_next on pct.port_next = port_next.id\n" +
                "join terminal as t on pct.terminal = t.id\n" +
                "join vessel as v on pct.vessel = v.id\n" +
                "left join delay_code dc on pct.delay_code = pct.id\n" +
                "order by event_timestamp";

        return this.dsl.fetch(sql).formatCSV();
    }
}
