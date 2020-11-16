package org.dcsa.portcall.message;

public class PortCallEventService extends AbstractPortCallEventType {
    private ServiceType serviceType;
    private String serviceId;

    public ServiceType getServiceType() {
        return serviceType;
    }

    public PortCallEventService setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
        return this;
    }

    public String getServiceId() {
        return serviceId;
    }

    public PortCallEventService setServiceId(String serviceId) {
        this.serviceId = serviceId;
        return this;
    }
}
