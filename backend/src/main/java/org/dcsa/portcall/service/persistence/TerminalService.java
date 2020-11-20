package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.tables.pojos.Terminal;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.dcsa.portcall.db.tables.Terminal.TERMINAL;

@Service
public class TerminalService extends AbstractPersistenceService {

    public TerminalService(DSLContext dsl) {
        super(dsl);
    }

    public Optional<Terminal> findTerminal(int terminalId) {
        Record terminal = dsl.select()
                .from(TERMINAL)
                .where(TERMINAL.ID.eq(terminalId))
                .fetchOne();

        if (terminal != null) {
            return Optional.of(terminal.into(Terminal.class));
        } else {
            return Optional.empty();
        }
    }
}
