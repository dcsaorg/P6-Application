package org.dcsa.portcall;

import org.dcsa.portcall.message.CodeType;
import org.dcsa.portcall.message.RoleType;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Primary
@Configuration
@ConfigurationProperties(prefix = "dcsa")
    public class PortCallProperties {

    private String company;
    private RoleType senderRole;
    private CodeType senderIdType;
    private String senderId;
    private Messenger messenger;
    private Hotfolder hotfolder;


    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public RoleType getSenderRole() {return senderRole;}
    public void setSenderRole(RoleType senderRole) {this.senderRole = senderRole;}

    public CodeType getSenderIdType() {return senderIdType;}
    public void setSenderIdType(CodeType senderIdType) {this.senderIdType = senderIdType;}

    public String getSenderId() {return senderId;}
    public void setSenderId(String senderId) {this.senderId = senderId;}

    public Hotfolder getHotfolder() {return hotfolder;}
    public void setHotfolder(Hotfolder hotfolder) {this.hotfolder = hotfolder;}


    public Messenger getMessenger() {
        return messenger;
    }
    public void setMessenger(Messenger messenger) {
        this.messenger = messenger;
    }

    public static class Hotfolder{
        private String outbox;
        private String inbox;

        public String getOutbox() {
            return outbox;
        }

        public void setOutbox(String outbox) {
            this.outbox = outbox;
        }

        public String getInbox() {
            return inbox;
        }

        public void setInbox(String inbox) {
            this.inbox = inbox;
        }
    }

    public static class Messenger {
        private String host;
        private int port;
        private Adapter adapter;

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public int getPort() {
            return port;
        }

        public void setPort(int port) {
            this.port = port;
        }

        public Adapter getAdapter() {
            return adapter;
        }

        public void setAdapter(Adapter adapter) {
            this.adapter = adapter;
        }

        public static class Adapter {
            private String id;
            private String version;

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }

            public String getVersion() {
                return version;
            }

            public void setVersion(String version) {
                this.version = version;
            }
        }
    }
}
