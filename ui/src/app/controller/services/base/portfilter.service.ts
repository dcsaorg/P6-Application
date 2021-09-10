import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Port } from "src/app/model/portCall/port";
import { Terminal } from "src/app/model/portCall/terminal";

@Injectable() export class PortFilterService {
    private portDataSource = new ReplaySubject<Port>()
    portObservable = this.portDataSource.asObservable()

    private terminalDataSource = new ReplaySubject<Terminal>()
    terminalObservable = this.terminalDataSource.asObservable()

    constructor(){}

    updatePortFilter(port: Port){
        this.portDataSource.next(port)
    }

    updateTerminalFilter(terminal: Terminal){
        this.terminalDataSource.next(terminal)
    }
}