package org.dcsa.portcall;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.dcsa.portcall.message.CodeType;
import org.dcsa.portcall.message.RoleType;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;


@JsonIgnoreProperties("$$beanFactory")
@Primary
@Configuration
@ConfigurationProperties(prefix = "dcsa")
    public class PortCallProperties {

    @JsonInclude(NON_NULL)
    private String company;
    @JsonInclude(NON_NULL)
    private RoleType senderRole;
    @JsonInclude(NON_NULL)
    private CodeType senderIdType;
    @JsonInclude(NON_NULL)
    private String senderId;
    @JsonInclude(NON_NULL)
    private Messenger messenger;
    @JsonInclude(NON_NULL)
    private Hotfolder hotfolder;
    @JsonInclude
    private Management management;


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

    public Management getManagement() {return management;}
    public void setManagement(Management management) {this.management = management;}

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

    public static class Management{
        private int carrierVesselPortHistoryThresholdDays;
        private boolean storeUnknownCarrier;

        public int getCarrierVesselPortHistoryThresholdDays() {
            return carrierVesselPortHistoryThresholdDays;
        }

        public void setCarrierVesselPortHistoryThresholdDays(int carrierVesselPortHistoryThresholdDays) {
            this.carrierVesselPortHistoryThresholdDays = carrierVesselPortHistoryThresholdDays;
        }

        public boolean isStoreUnknownCarrier() {return storeUnknownCarrier;}

        public void setStoreUnknownCarrier(boolean storeUnknownCarrier) {
            this.storeUnknownCarrier = storeUnknownCarrier;
        }
    }
}
