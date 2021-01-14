package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.LocationType;

public class LocationTypeToStringConverter extends StdConverter<LocationType, String> {
    @Override
    public String convert(LocationType locationType) {
        return locationType.name();
    }
}
