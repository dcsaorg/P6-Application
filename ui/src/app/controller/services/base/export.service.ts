import {Injectable} from '@angular/core';
import {Config} from "../../../model/ovs/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly EXPORT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.EXPORT_URL = BACKEND_URL + '/unofficial/export-timestamps/';
  }

  getExport = ():Observable<Blob> => {
    console.log("Request Download for Timestamps as CSV");
    return this.httpClient.get(this.EXPORT_URL, {responseType: "blob"})
}
}