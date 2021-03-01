import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Terminal} from "../../../model/base/terminal";


@Injectable({
  providedIn: 'root'
})
export class StaticTerminalsService {
  private readonly TERMINAL_FILE: string;
  constructor(private httpClient: HttpClient) {
    this.TERMINAL_FILE = "/assets/static_data/terminals.json";
  }

  getTerminals = () : Observable<Terminal[]> => {
    return this.httpClient.get<Terminal[]>(this.TERMINAL_FILE);

  }
}

