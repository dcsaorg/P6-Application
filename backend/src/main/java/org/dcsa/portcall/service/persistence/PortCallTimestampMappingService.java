package org.dcsa.portcall.service.persistence;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortcallTimestampMapping;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

import static org.dcsa.portcall.db.tables.PortcallTimestampMapping.PORTCALL_TIMESTAMP_MAPPING;

@Service
public class PortCallTimestampMappingService extends AbstractPersistenceService {

    private final Logger log = LogManager.getLogger(PortCallTimestampService.class);
    private final PortCallProperties config;


    protected PortCallTimestampMappingService(DSLContext dsl, PortCallProperties config) {
        super(dsl);
        this.config = config;
    }

    @Transactional(readOnly = true)
    public List<PortcallTimestampMapping> getTimestampTypeMapping(){
        log.debug("Fetching PortcallTimestampType Mapping from Database Table!");

        Result<Record> mappings = dsl.select()
                .from(PORTCALL_TIMESTAMP_MAPPING)
                .fetch();

        List<PortcallTimestampMapping> timestampTypeMapping = mappings.into(PortcallTimestampMapping.class);
        return timestampTypeMapping;
    }

    /**
     * This fuznction generates a HashMap providing all mapping Entries to easlay access the mapping
     * @return
     */
    public HashMap<PortCallTimestampType, PortcallTimestampMapping> getTimestampTypeMappingTable(){
        HashMap<PortCallTimestampType, PortcallTimestampMapping> mappingTable = new HashMap<>();
        for (PortcallTimestampMapping mappingEntry: this.getTimestampTypeMapping()) {
            mappingTable.put(mappingEntry.getTimestampType(), mappingEntry);
        }

        return mappingTable;
    }



}
