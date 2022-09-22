import {Injectable} from '@angular/core';
import {Globals} from "../../../model/portCall/globals";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly EXPORT_URL_EXCEL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.EXPORT_URL_EXCEL = globals.config.uiSupportBackendURL + '/unofficial/export-timestamps/excel';
  }

  getExportAsExcel = ():Observable<Blob> => {
    return this.httpClient.get(this.EXPORT_URL_EXCEL , {responseType: "blob"})
}
}
