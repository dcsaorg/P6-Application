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
        serviceNameCode: 'NORTH-BOUND'
      },
      {
        id: 1,
        name: 'MV Kooringa (6409715)',
        imo: 6409715,
        teu: 276,
        serviceNameCode: 'SOUTH-BOUND'
      },
      {
        id: 2,
        name: 'MV DCSA (1234567)',
        imo: 1234567,
        teu: 18000,
        serviceNameCode: 'LOOP3'
      },
      {
        id: 3,
        name: 'MV Demonstrator (7654321)',
        imo: 7654321,
        teu: 12000,
        serviceNameCode: 'ASIA_EUR'
      },
    ]
  }
}
