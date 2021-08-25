import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable, map} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {Transport} from "../../../model/OVS/transport";
import {FacilityCodeType} from "../../../model/ovs/facilityCodeType";


@Injectable({
  providedIn: 'root'
})
export class TransportCallService {

  private readonly TRANSPORT_CALL_URL: string;
  private readonly TRANSPORT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL=BACKEND_URL+"/unofficial-transport-calls"
    this.TRANSPORT_URL=BACKEND_URL+"/transports" // api/unofficial/transport
  }

  getTransportCalls = (): Observable<TransportCall[]> =>
    this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL).pipe(map(transportCalls => this.postProcess(transportCalls)));

  getTransportCallsById = (transportCallId: string): Observable<TransportCall> => this.httpClient.get<TransportCall>(this.TRANSPORT_CALL_URL+"/"+transportCallId);

  addTransport = (transport: Transport): Observable<Transport> =>
    this.httpClient.post<Transport>(this.TRANSPORT_URL, transport)

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
