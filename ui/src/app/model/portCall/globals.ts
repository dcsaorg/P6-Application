import {Injectable} from '@angular/core';
import {Port} from "./port";
import {Terminal} from "./terminal";
import {Config} from "../jit/config";

@Injectable()
export class Globals {
  ports: Port[];
  terminals: Terminal[];
  config: Config;

}
