package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.LocationType;

public class StringToLocationTypeConverter extends StdConverter<String, LocationType> {
    @Override
    public LocationType convert(String s) {
        return LocationType.valueOf(s);
    }
}
