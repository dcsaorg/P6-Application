import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/OVS/transport-call";
import {FacilityCodeType} from "../../../model/OVS/facilityCodeType";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {

  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL=BACKEND_URL+"/unofficial-transport-calls"
  }

  getTransportCalls = (): Observable<TransportCall[]> =>
    this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL).pipe(map(transportCalls => this.postProcess(transportCalls)));

  getTransportCallsById = (transportCallId: string): Observable<TransportCall> => this.httpClient.get<TransportCall>(this.TRANSPORT_CALL_URL+"/"+transportCallId);

  addTransportCall = (transportCall: TransportCall): Observable<TransportCall> =>
    this.httpClient.post<TransportCall>(this.TRANSPORT_CALL_URL, transportCall)


  /**
   * Function that will process the retrieved transportCalls in order to add som additional information
   */
  private postProcess(transportCalls: TransportCall[]):TransportCall[]{
    for(let transportCall of transportCalls){
      transportCall = this.extractVesselAttributes(transportCall)
    }
    return transportCalls;
  }


  private extractPortFromFacility(transportCall: TransportCall){
    if(transportCall.facilityTypeCode == FacilityCodeType.POTE){
      transportCall.UNLocationCode = transportCall.facilityCode.substring(0,5);
    }
  }

  private extractVesselAttributes(transportCall: TransportCall){
   if (transportCall['vessel'] === null){
    transportCall.vesselName = null;
    transportCall.vesselIMONumber = null;  
   }
   else{
   transportCall.vesselName = transportCall['vessel']['vesselName'];
   transportCall.vesselIMONumber = transportCall['vessel']['vesselIMONumber'];
    }
      return transportCall

  }

}
