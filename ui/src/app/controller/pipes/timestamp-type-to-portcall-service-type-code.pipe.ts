import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";

@Pipe({
  name: 'timestampTypeToPortcallServiceTypeCode'
})
export class TimestampTypeToPortcallServiceTypeCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): PortCallServiceTypeCode {
    let ret: PortCallServiceTypeCode = null;
    if(
      [PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ATS_Cargo_Ops,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.ATC_Cargo_Ops
      ].includes(timestampType)){
      ret = PortCallServiceTypeCode.CRGO
    } else if (
      [PortcallTimestampType.ATS_Pilotage].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.PILO
    }
    return ret;
  }

}
