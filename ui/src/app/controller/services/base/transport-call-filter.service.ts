import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Port } from "src/app/model/portCall/port";
import { Terminal } from "src/app/model/portCall/terminal";
import {Vessel} from "../../../model/portCall/vessel";

@Injectable() export class TransportCallFilterService {
    private portDataSource = new ReplaySubject<Port>()
    portObservable = this.portDataSource.asObservable()

    private terminalDataSource = new ReplaySubject<Terminal>()
    terminalObservable = this.terminalDataSource.asObservable()


    private vesselDataSource = new ReplaySubject<Vessel>()
    vesselObservable = this.vesselDataSource.asObservable()

    constructor(){}

    updatePortFilter(port: Port){
        this.portDataSource.next(port)
    }

    updateTerminalFilter(terminal: Terminal){
        this.terminalDataSource.next(terminal)
    }

    updateVesselFilter(vessel: Vessel) {
        this.vesselDataSource.next(vessel);
    }
}
