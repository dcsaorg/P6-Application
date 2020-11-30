package org.dcsa.portcall.util;

import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.RoleType;

public class TimestampResponseOptionMapping {

    /**
     *
     * Identifying who can accept a timestamp and which timestamp type would be the response on this timestamp.
     *
     */

    public static PortCallTimestampType getResponseOption(RoleType senderRole, PortCallTimestamp timestamp){
        PortCallTimestampType responseType;
        // If I'm a carrier
        if(senderRole == RoleType.CARRIER){
            if(timestamp.getTimestampType() == PortCallTimestampType.RTA_Berth) {return PortCallTimestampType.PTA_Berth;}
            else if(timestamp.getTimestampType() == PortCallTimestampType.RTA_PBP) {return PortCallTimestampType.PTA_PBP;}
            else if(timestamp.getTimestampType() == PortCallTimestampType.ETC_Cargo_Ops) {return PortCallTimestampType.RTC_Cargo_Ops;}
            else if(timestamp.getTimestampType() == PortCallTimestampType.RTD_Berth) {return PortCallTimestampType.PTD_Berth;}
        }
        // If I'm a terminal
        else if (senderRole == RoleType.TERMINAL){
            if(timestamp.getTimestampType() == PortCallTimestampType.ETA_Berth) {return PortCallTimestampType.RTA_Berth;}
            else if(timestamp.getTimestampType() == PortCallTimestampType.RTC_Cargo_Ops) {return PortCallTimestampType.PTC_Cargo_Ops;}
        }
        // If I'm a Port
        else if(senderRole == RoleType.PORT){
            if(timestamp.getTimestampType() == PortCallTimestampType.ETA_PBP) {return PortCallTimestampType.RTA_PBP;}
            else if(timestamp.getTimestampType() == PortCallTimestampType.ETD_Berth) {return PortCallTimestampType.RTD_Berth;}
        }
        return null;
    }
}
