package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.db.tables.records.MessageRecord;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.UpdateSetFirstStep;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.dcsa.portcall.db.tables.Message.MESSAGE;

@Service
public class MessageService extends AbstractPersistenceService {

    public MessageService(DSLContext dsl) {
        super(dsl);
    }

    @Transactional(readOnly = true)
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

    @Transactional
    public Optional<Message> saveMessage(MessageDirection direction, Path file) throws IOException {
        try (InputStream in = Files.newInputStream(file)) {
            return saveMessage(direction, file.toFile().getName(), in);
        }
    }

    @Transactional
    public Optional<Message> saveMessage(MessageDirection direction, String filename, InputStream data) throws IOException {
        byte[] payload = data.readAllBytes();
        Result<MessageRecord> result = dsl.insertInto(MESSAGE)
                .columns(MESSAGE.DIRECTION, MESSAGE.FILENAME, MESSAGE.PAYLOAD)
                .values(direction, filename, payload)
                .returning(MESSAGE.ID)
                .fetch();
        if (result.isNotEmpty()) {
            return Optional.of(new Message()
                    .setId(result.get(0).getId())
                    .setFilename(filename)
                    .setDirection(direction)
                    .setPayload(payload)
            );
        }

        return Optional.empty();
    }

    @Transactional
    public boolean updatePortCallTimestampId(int messageId, int portCallTimestampId) {
        int updatedRows = dsl.update(MESSAGE)
                .set(MESSAGE.TIMESTAMP_ID, portCallTimestampId)
                .where(MESSAGE.ID.eq(messageId)
                        .and(MESSAGE.TIMESTAMP_ID.isNull()))
                .execute();
        return updatedRows == 1;
    }

    @Transactional
    public boolean updateTransferId(int messageId, String transferId) {
        int updatedRows = dsl.update(MESSAGE)
                .set(MESSAGE.TRANSFER_ID, transferId)
                .where(MESSAGE.ID.eq(messageId))
                .execute();
        return updatedRows == 1;
    }

    @Transactional
    public boolean updateStatus(String transferId, String status, String details) {
        UpdateSetFirstStep<MessageRecord> sql = dsl.update(MESSAGE);
        int updatedRows = sql
                .set(MESSAGE.STATUS, status)
                .set(MESSAGE.DETAIL, details)
                .where(MESSAGE.TRANSFER_ID.eq(transferId))
                .execute();
        return updatedRows == 1;
    }

    @Transactional
    public Optional<Message> saveMessage(int portCallTimestampId, MessageDirection direction, Path file) throws IOException {
        try (InputStream in = Files.newInputStream(file)) {
            return saveMessage(portCallTimestampId, direction, file.toFile().getName(), in);
        }
    }

    @Transactional
    public Optional<Message> saveMessage(int portCallTimestampId, MessageDirection direction, String filename, InputStream data) throws IOException {
        byte[] payload = data.readAllBytes();
        Result<MessageRecord> result = dsl.insertInto(MESSAGE)
                .columns(MESSAGE.DIRECTION, MESSAGE.TIMESTAMP_ID, MESSAGE.FILENAME, MESSAGE.PAYLOAD)
                .values(direction, portCallTimestampId, filename, payload)
                .returning(MESSAGE.ID)
                .fetch();
        if (result.isNotEmpty()) {
            return Optional.of(new Message()
                    .setId(result.get(0).getId())
                    .setTimestampId(portCallTimestampId)
                    .setFilename(filename)
                    .setDirection(direction)
                    .setPayload(payload)
            );
        }

        return Optional.empty();
    }
}
