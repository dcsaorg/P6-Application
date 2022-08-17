import {Injectable} from '@angular/core';
import {TimestampInfoService} from "../jit/timestamp-info.service";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/jit/transport-call";
import {map, mergeMap} from "rxjs/operators";
import {Globals} from "../../../model/portCall/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {Timestamp} from "../../../model/jit/timestamp";
import {TimestampService} from "../jit/timestamps.service";
import {TimestampToStandardizedtTimestampPipe} from '../../pipes/timestamp-to-standardized-timestamp';
import {TimestampDefinitionTO} from "../../../model/jit/timestamp-definition";
import {TimestampDefinitionService} from "../base/timestamp-definition.service";
import {EventLocationRequirement} from 'src/app/model/enums/eventLocationRequirement';
import {FacilityTypeCode} from 'src/app/model/enums/facilityTypeCodeOPR';
import {TimestampInfo} from "../../../model/jit/timestamp-info";

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {
  constructor(
    private timestampInfoService: TimestampInfoService,
    private globals: Globals,
    private operationsEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
    private timestampToStandardizedTimestampPipe: TimestampToStandardizedtTimestampPipe,
    private timestampDefinitionService: TimestampDefinitionService,
    private timestampService: TimestampService,
  ) {
  }

  private readonly locationNamePBP: string = "PBP Location Name";
  private readonly locationNameBerth: string = "Berth Location Name";
  private readonly locationNameAnchorage: string = "Anchorage Location Name";

  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
    this.ensureVoyageNumbers(timestamp);
    return this.timestampService.addTimestamp(this.timestampToStandardizedTimestampPipe.transform(timestamp, this.globals.config))
  }

  /*
  * A function that returns a list of portCall timestamps related to the transport Call .
  */
  getPortCallTimestampsByTransportCall(transportCall: TransportCall, portCallPart?: string): Observable<TimestampInfo[]> {
    return this.timestampInfoService.getTimestampInfoForTransportCall(transportCall?.transportCallID, portCallPart).pipe(
      mergeMap(timestampInfos =>
        this.timestampDefinitionService.getTimestampDefinitionsMap().pipe(
          map(timestampDefinitionsMap => {
            let set = new Set()
            return timestampInfos.map(timestampInfo => {
              // Replace the TD with the one from our service.  We have enriched the latter with "acceptDefinitionEntity"
              // and "rejectDefinitionEntity".
              timestampInfo.timestampDefinitionTO = timestampDefinitionsMap.get(timestampInfo.timestampDefinitionTO.id)
              timestampInfo.operationsEventTO.eventDeliveryStatus = timestampInfo.eventDeliveryStatus;
              const negotiationCycleKey = timestampInfo.timestampDefinitionTO.negotiationCycle.cycleKey;
              timestampInfo.isLatestInCycle = !set.has(negotiationCycleKey)
              set.add(negotiationCycleKey)
              return timestampInfo;
            });
          })
        ))
    )
  }


  // Align voyageNumbers (JIT 1.x) before posting timestamp
  ensureVoyageNumbers(timestamp: Timestamp) {
    if (timestamp.carrierVoyageNumber === undefined || timestamp.carrierVoyageNumber === null) {
      if (timestamp.importVoyageNumber) { timestamp.carrierVoyageNumber = timestamp.importVoyageNumber }
      if (timestamp.exportVoyageNumber) { timestamp.carrierVoyageNumber = timestamp.exportVoyageNumber }       // we overwrite with exportVoyageNumber if exist
    }
    timestamp.importVoyageNumber = !timestamp.importVoyageNumber ? timestamp.carrierVoyageNumber : timestamp.importVoyageNumber;
    timestamp.exportVoyageNumber = !timestamp.exportVoyageNumber ? timestamp.carrierVoyageNumber : timestamp.exportVoyageNumber;
  }


  getLocationNameOptionLabel(timestampType: TimestampDefinitionTO): string {
    if (timestampType?.eventLocationRequirement == EventLocationRequirement.OPTIONAL ||
      timestampType?.eventLocationRequirement == EventLocationRequirement.REQUIRED) {
    if (timestampType?.facilityTypeCode == FacilityTypeCode.BRTH) {
      return this.locationNameBerth;
    }
    if (timestampType?.facilityTypeCode == FacilityTypeCode.PBPL) {
      return this.locationNamePBP;
    }
    if (timestampType?.facilityTypeCode == FacilityTypeCode.ANCH) {
      return this.locationNameAnchorage;
    }
  }
    return undefined;
  }
}



