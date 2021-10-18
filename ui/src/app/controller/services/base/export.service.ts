import {Injectable} from '@angular/core';
import {Globals} from "../../../model/portCall/globals";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly EXPORT_URL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.EXPORT_URL = globals.config.uiSupportBackendURL + '/unofficial/export-timestamps/';
  }

  getExport = ():Observable<Blob> => {
    return this.httpClient.get(this.EXPORT_URL, {responseType: "blob"})
}
}
