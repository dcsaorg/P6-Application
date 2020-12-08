package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.service.AbstractDatabaseTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.dcsa.portcall.db.Tables.MESSAGE;

@JooqTest
class MessageServiceTest extends AbstractDatabaseTest {

    public static final String TEST_MESSAGE_CONTENT = "test";

    @Test
    void testSaveMessageWithPortCallTimestampId() throws Exception {
        try {
            Path file = Files.createTempFile(this.getClass().getSimpleName(), ".txt");
            Files.write(file, TEST_MESSAGE_CONTENT.getBytes());
            MessageService service = new MessageService(dsl);
            Optional<Message> messageWritten = service.saveMessage(1, MessageDirection.outbound, file);
            assertThat(messageWritten.isPresent()).isTrue();

            Optional<Message> messageRead = service.findMessage(messageWritten.get().getId());
            assertThat(messageRead.isPresent()).isTrue();
            assertThat(messageRead.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageRead.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageRead.get().getTimestampId()).isEqualTo(messageWritten.get().getTimestampId());
            assertThat(messageRead.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageRead.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());
        } finally {
            dsl.deleteFrom(MESSAGE);
        }
    }

    @Test
    void testSaveMessageWithoutPortCallTimestampId() throws Exception {
        try {
            Path file = Files.createTempFile(this.getClass().getSimpleName(), ".txt");
            Files.write(file, TEST_MESSAGE_CONTENT.getBytes());
            MessageService service = new MessageService(dsl);
            Optional<Message> messageWritten = service.saveMessage(MessageDirection.outbound, file);
            assertThat(messageWritten.isPresent()).isTrue();

            Optional<Message> messageRead = service.findMessage(messageWritten.get().getId());
            assertThat(messageRead.isPresent()).isTrue();
            assertThat(messageRead.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageRead.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageRead.get().getTimestampId()).isNull();
            assertThat(messageRead.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageRead.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());
        } finally {
            dsl.deleteFrom(MESSAGE);
        }
    }

    @Test
    void testSaveMessageSettingOfThePortCallMessageTimestampId() throws Exception {
        try {
            Path file = Files.createTempFile(this.getClass().getSimpleName(), ".txt");
            Files.write(file, TEST_MESSAGE_CONTENT.getBytes());
            MessageService service = new MessageService(dsl);
            Optional<Message> messageWritten = service.saveMessage(MessageDirection.outbound, file);
            assertThat(messageWritten.isPresent()).isTrue();

            Optional<Message> messageRead = service.findMessage(messageWritten.get().getId());
            assertThat(messageRead.isPresent()).isTrue();
            assertThat(messageRead.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageRead.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageRead.get().getTimestampId()).isNull();
            assertThat(messageRead.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageRead.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());

            boolean updateResult = service.updatePortCallTimestampId(messageWritten.get().getId(), 1);
            assertThat(updateResult).isTrue();

            Optional<Message> messageReadAfterUpdate = service.findMessage(messageWritten.get().getId());
            assertThat(messageReadAfterUpdate.isPresent()).isTrue();
            assertThat(messageReadAfterUpdate.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageReadAfterUpdate.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageReadAfterUpdate.get().getTimestampId()).isEqualTo(1);
            assertThat(messageReadAfterUpdate.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageReadAfterUpdate.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());

            boolean updateResultWithExitingTimestampId = service.updatePortCallTimestampId(messageWritten.get().getId(), 2);
            assertThat(updateResultWithExitingTimestampId).isFalse();

            Optional<Message> messageReadAfterSecondUpdate = service.findMessage(messageWritten.get().getId());
            assertThat(messageReadAfterSecondUpdate.isPresent()).isTrue();
            assertThat(messageReadAfterSecondUpdate.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageReadAfterSecondUpdate.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageReadAfterSecondUpdate.get().getTimestampId()).isEqualTo(1);
            assertThat(messageReadAfterSecondUpdate.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageReadAfterSecondUpdate.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());
        } finally {
            dsl.deleteFrom(MESSAGE);
        }
    }
}