package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.db.tables.records.MessageRecord;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.dcsa.portcall.db.tables.Message.MESSAGE;

@Service
public class MessageService extends AbstractPersistenceService {

    public MessageService(DSLContext dsl) {
        super(dsl);
    }

    public Optional<Message> findMessage(int messageId) {
        Record message = dsl.select()
                .from(MESSAGE)
                .where(MESSAGE.ID.eq(messageId))
                .fetchOne();

        if (message != null) {
            return Optional.of(message.into(Message.class));
        } else {
            return Optional.empty();
        }
    }

    public Optional<Message> saveMessage(int portCallTimestampId, MessageDirection direction, Path file) throws IOException {
        Result<MessageRecord> result = dsl.insertInto(MESSAGE)
                .columns(MESSAGE.DIRECTION, MESSAGE.TIMESTAMP_ID, MESSAGE.FILENAME, MESSAGE.PAYLOAD)
                .values(direction, portCallTimestampId, file.toFile().getName(), Files.readAllBytes(file))
                .returning(MESSAGE.ID)
                .fetch();
        if (result.isNotEmpty()) {
            return Optional.of(new Message()
                    .setId(result.get(0).getId())
                    .setTimestampId(portCallTimestampId)
                    .setFilename(file.toFile().getName())
                    .setDirection(direction)
            );
        }

        return Optional.empty();
    }
}
