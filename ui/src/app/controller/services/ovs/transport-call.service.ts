import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {FacilityCodeType} from "../../../model/ovs/facilityCodeType";
import {map} from "rxjs/operators";
import { Timestamp } from 'src/app/model/ovs/timestamp';

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {
  timestamps: Timestamp;
  private readonly TRANSPORT_CALL_URL: string;
  private readonly OPERATIONS_EVENT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL=BACKEND_URL+"/unofficial-transport-calls"
    this.OPERATIONS_EVENT_URL=BACKEND_URL + "/events?eventType=OPERATIONS&sort=eventCreatedDateTime:DESC&limit=1"
  }

  getTransportCalls = (): Observable<TransportCall[]> =>
    this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL).pipe(map(transportCalls => this.postProcess(transportCalls)));
  
  getOperationsEventstoTimestamp = (transportCallId: string): Observable<Timestamp[]> =>
  this.httpClient.get<Timestamp[]>(this.OPERATIONS_EVENT_URL+ "&transportCallID=" + transportCallId).pipe(map(transportCalls => (transportCalls)));

  getTransportCallsById = (transportCallId: string): Observable<TransportCall> => this.httpClient.get<TransportCall>(this.TRANSPORT_CALL_URL+"/"+transportCallId);

  addTransportCall = (transportCall: TransportCall): Observable<TransportCall> =>
    this.httpClient.post<TransportCall>(this.TRANSPORT_CALL_URL, transportCall)


  /**
   * Function that will process the retrieved transportCalls in order to add som additional information
   */
  private postProcess(transportCalls: TransportCall[]):TransportCall[]{
    for(let transportCall of transportCalls){

      transportCall = this.extractVesselAttributes(transportCall)
      transportCall = this.extractEstimatedDateofArrival(transportCall); 
      console.log(transportCall)
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
  private extractEstimatedDateofArrival(transportCall: TransportCall){

    this.getOperationsEventstoTimestamp(transportCall.transportCallID).subscribe(timestamps => {
      this.timestamps = timestamps[0]
      console.log(this.timestamps) 
      transportCall.estimatedDateofArrival = this.timestamps['eventDateTime'] ;
    });

 
      return transportCall
 
   }
  

}
