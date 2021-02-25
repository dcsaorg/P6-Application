import { Injectable } from '@angular/core';
import {Port} from "../model/base/port";
import {Terminal} from "../model/base/terminal";

@Injectable()
export class Globals {
 ports: Port[];
 terminals: Terminal[];

}
