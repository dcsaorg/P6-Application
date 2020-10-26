package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

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

    @GetMapping("/Timestamp_Export.csv")
    @Transactional(readOnly = true)
    public ResponseEntity downloadTimestampCsv(HttpServletResponse response) {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=PortCall_Timestamps_Export.csv");
        try {
            response.getOutputStream().print(this.loadTimestampsFromDb());
        } catch (IOException e) {
            e.printStackTrace();
        }


        return null;
    }



    private String loadTimestampsFromDb() {

        return this.dsl.select().
                from(PORT_CALL_TIMESTAMP).fetch().formatCSV();


    }
}
