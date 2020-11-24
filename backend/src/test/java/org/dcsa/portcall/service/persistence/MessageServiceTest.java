package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.service.AbstractDatabaseTest;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.dcsa.portcall.db.Tables.MESSAGE;

class MessageServiceTest extends AbstractDatabaseTest {

    public static final String TEST_MESSAGE_CONTENT = "test";

    @Test
    void testService() throws Exception {
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
}