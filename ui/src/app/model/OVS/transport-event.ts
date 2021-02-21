export interface TransportEvent {
  eventID: string;
  eventType: string;
  eventDateTime: string | Date;
  eventClassifierCode: string;
  eventTypeCode: string;
  creationDateTime: string | Date;
  transportCallID: string;
  locationType: string;
  locationID: string;
  comment: string;
  delayReasonCode: string;
}
