import { Injectable } from '@angular/core';
import { TimestampInfoService } from "../jit/timestamp-info.service";
import { Observable } from "rxjs";
import { TransportCall } from "../../../model/jit/transport-call";
import { map, mergeMap } from "rxjs/operators";
import { Globals } from "../../../model/portCall/globals";
import { Timestamp } from "../../../model/jit/timestamp";
import { TimestampService } from "../jit/timestamps.service";
import { TimestampDefinitionTO } from "../../../model/jit/timestamp-definition";
import { TimestampDefinitionService } from "../base/timestamp-definition.service";
import { EventLocationRequirement } from 'src/app/model/enums/eventLocationRequirement';
import { FacilityTypeCode } from 'src/app/model/enums/facilityTypeCodeOPR';
import { TimestampInfo } from "../../../model/jit/timestamp-info";
import { Terminal } from "../../../model/portCall/terminal";
import { PublisherRole } from "../../../model/enums/publisherRole";
import { OperationsEvent } from "../../../model/jit/operations-event";
import { FacilityCodeListProvider } from "../../../model/enums/facilityCodeListProvider";
import { TimestampVessel, Vessel } from "../../../model/portCall/vessel";

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {
  constructor(
    private timestampInfoService: TimestampInfoService,
    private globals: Globals,
    private timestampDefinitionService: TimestampDefinitionService,
    private timestampService: TimestampService,
  ) {
  }

  private readonly locationNamePBP: string = "PBP Location Name";
  private readonly locationNameBerth: string = "Berth Location Name";
  private readonly locationNameAnchorage: string = "Anchorage Location Name";
  private readonly locationNameGeneric: string = "Location Name";

  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
    return this.timestampService.addTimestamp(timestamp)
  }

  overlappingPublisherRoles(timestampDefinition: TimestampDefinitionTO): PublisherRole[] {
    if (timestampDefinition) {
      const userRoles = this.globals.config.publisherRoles
      const rolesForTimestamp = timestampDefinition.publisherPattern.map(p => p.publisherRole)
      return userRoles.filter((val1) => {
        return rolesForTimestamp.find((val2) => val1 === val2);
      }).sort((a, b) => {
        // Sort generally by name, but prefer CA over AG (the roles are presented in order CA, AG, VSL)
        if (a == b) {
          return 0;
        }
        if (a == PublisherRole.CA && b == PublisherRole.AG) {
          return -1
        }
        if (b == PublisherRole.AG && a == PublisherRole.CA) {
          return 1
        }
        return a < b ? -1 : 1;
      });
    }
    return [];
  }

  createTimestampStub(transportCall: TransportCall, timestampDefinition: TimestampDefinitionTO, fullVesselDetails?: Vessel, operationsEvent?: OperationsEvent): Timestamp {
    const facilityCode = timestampDefinition.isTerminalNeeded ? operationsEvent?.eventLocation.facilityCode : null
    const vessel: TimestampVessel = {
      vesselIMONumber: fullVesselDetails.vesselIMONumber,
      name: fullVesselDetails.vesselName,
      callSign: fullVesselDetails.vesselCallSignNumber,
      lengthOverall: fullVesselDetails.length,
      width: fullVesselDetails.width,
      draft: null,
      dimensionUnit: fullVesselDetails.dimensionUnit,
      type: fullVesselDetails.type,
    }
    return {
      publisher: this.globals.config.publisher,
      // we do not pass on the same location by default.
      eventLocation: {
        UNLocationCode: transportCall.location.UNLocationCode,
        facilityCode: facilityCode,
        facilityCodeListProvider: facilityCode ? FacilityCodeListProvider.SMDG : null
      },
      UNLocationCode: transportCall.location.UNLocationCode,
      facilitySMDGCode: facilityCode,
      carrierServiceCode: transportCall.carrierServiceCode,
      carrierVoyageNumber: transportCall.carrierVoyageNumber ?? transportCall.carrierExportVoyageNumber,
      carrierExportVoyageNumber: transportCall.carrierExportVoyageNumber,
      carrierImportVoyageNumber: transportCall.carrierImportVoyageNumber,
      vesselIMONumber: transportCall.vessel.vesselIMONumber,
      vessel: vessel,

      // Echo from the OE in case the port visit and the OE uses a different number.  It is not 100% reliable
      // if the timestamp ends up being for a different terminal, but we can also solve so much with a guess.
      transportCallSequenceNumber: operationsEvent ? operationsEvent.transportCall.transportCallSequenceNumber : transportCall.transportCallSequenceNumber,

      // Timestamp discriminators
      eventClassifierCode: timestampDefinition.eventClassifierCode,
      operationsEventTypeCode: timestampDefinition.operationsEventTypeCode,
      facilityTypeCode: timestampDefinition.facilityTypeCode,
      portCallPhaseTypeCode: timestampDefinition.portCallPhaseTypeCode,
      portCallServiceTypeCode: timestampDefinition.portCallServiceTypeCode,

      // To be filled by the caller
      publisherRole: null,
      delayReasonCode: null,
      milesToDestinationPort: null,
      remark: null,
      eventDateTime: null,
    }

  }

  /*
  * A function that returns a list of portCall timestamps related to the transport Call .
  */
  getPortCallTimestampsByTransportCall(transportCall: TransportCall, terminal: Terminal | null, negotiationCycleKey?: string, portCallPart?: string): Observable<TimestampInfo[]> {
    return this.timestampInfoService.getTimestampInfoForTransportCall(transportCall?.transportCallID, terminal?.facilitySMDGCode, negotiationCycleKey).pipe(
      mergeMap(timestampInfos =>
        this.timestampDefinitionService.getTimestampDefinitionsMap().pipe(
          map(timestampDefinitionsMap => {
            let cycleTracker = new Map<string, Set<string>>();
            return timestampInfos.map(timestampInfo => {
              // Replace the TD with the one from our service.  We have enriched the latter with "acceptDefinitionEntity"
              // and "rejectDefinitionEntity".
              timestampInfo.timestampDefinitionTO = timestampDefinitionsMap.get(timestampInfo.timestampDefinitionTO.id)
              timestampInfo.operationsEventTO.eventDeliveryStatus = timestampInfo.eventDeliveryStatus;
              const facilityCode = timestampInfo.operationsEventTO.eventLocation.facilityCode ?? 'NULL';
              const negotiationCycleKey = timestampInfo.timestampDefinitionTO.negotiationCycle.cycleKey;
              let set = cycleTracker.get(facilityCode)
              if (!set) {
                set = new Set<string>();
                cycleTracker.set(facilityCode, set)
              }
              timestampInfo.isLatestInCycle = !set.has(negotiationCycleKey)
              set.add(negotiationCycleKey)
              return timestampInfo;
            });
          })
        ))
    )
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
      return this.locationNameGeneric
    }
    return undefined;
  }
}



