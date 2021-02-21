import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DownloadService {

  private DOWNLOAD_URL: string;

  constructor(private httpClient: HttpClient) {
    this.DOWNLOAD_URL = BACKEND_URL + '/download'
  }

  downloadTimestampsAsCsv = ():Observable<Blob> => {
    console.log("Request Download for Timestamps as CSV");
    return this.httpClient.get(this.DOWNLOAD_URL+ "/PortCall_Timestamps_Export.csv", {responseType: "blob"})
}

}
