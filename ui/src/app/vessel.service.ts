import { Injectable } from '@angular/core';
import {Vessel} from "./model/vessel";

@Injectable({
  providedIn: 'root'
})
export class VesselService {

  constructor() { }

  getVessels = (): Vessel[] => {
    return [
      {
        id: 0,
        name: 'MV Cap San Diego (5060794)',
        imo: 5060794,
        teu: 3,
        serviceName: 'NORTH-BOUND'
      },
      {
        id: 1,
        name: 'MV Kooringa (6409715)',
        imo: 6409715,
        teu: 276,
        serviceName: 'SOUTH-BOUND'
      },
      {
        id: 2,
        name: 'MV DCSA (1234567)',
        imo: 1234567,
        teu: 18000,
        serviceName: 'LOOP3'
      },
      {
        id: 3,
        name: 'MV Demonstrator (7654321)',
        imo: 7654321,
        teu: 12000,
        serviceName: 'ASIA_EUR'
      },
    ]
  }
}
