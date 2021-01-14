package org.dcsa.portcall.message;

public class PortCallEventLocation extends AbstractPortCallEventType {
    private LocationType locationType;
    private String locationId;

    public LocationType getLocationType() {
        return locationType;
    }

    public PortCallEventLocation setLocationType(LocationType locationType) {
        this.locationType = locationType;
        return this;
    }

    public String getLocationId() {
        return locationId;
    }

    public PortCallEventLocation setLocationId(String locationId) {
        this.locationId = locationId;
        return this;
    }
}
