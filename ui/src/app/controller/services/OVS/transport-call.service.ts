import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Transport} from "../../../model/OVS/transport";
import {FacilityCodeType} from "../../../model/OVS/facilityCodeType";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {

  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/transport-calls"
  }

  getTransportCalls = (): Observable<Transport[]> =>
    this.httpClient.get<Transport[]>(this.TRANSPORT_CALL_URL).pipe(map(transportCalls => this.postProcess(transportCalls)));

  getTransportCallsById = (transportCallId: string): Observable<Transport> => this.httpClient.get<Transport>(this.TRANSPORT_CALL_URL + "/" + transportCallId);

  addTransportCall = (transport: Transport): Observable<Transport> =>
    this.httpClient.post<Transport>(this.TRANSPORT_CALL_URL, transport.dischargeTransportCall)


  /**
   * Function that will process the retrieved transportCalls in order to add som additional information
   */
  private postProcess(transportCalls: Transport[]): Transport[] {
    for (let transportCall of transportCalls) {
      this.extractPortFromFacility(transportCall);
    }
    return transportCalls;
  }


  private extractPortFromFacility(transportCall: Transport) {
    if (transportCall.dischargeTransportCall.facilityTypeCode == FacilityCodeType.POTE) {
      transportCall.dischargeTransportCall.UNLocationCode = transportCall.dischargeTransportCall.facilityCode.substring(0, 5);
    }
  }

}
