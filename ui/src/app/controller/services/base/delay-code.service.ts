import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {DelayCode} from "../../../model/base/delayCode";
import {StaticDelaycodeService} from "../static/static-delaycode.service";

@Injectable({
  providedIn: 'root'
})
export class DelayCodeService {
  private readonly DELAY_CODE_URL: string;

  constructor(private httpClient: HttpClient, private staticDelayCodeService: StaticDelaycodeService) {
    this.DELAY_CODE_URL = BACKEND_URL + '/delaycodes';
  }


  getDelayCodes = (): Observable<DelayCode[]> => this.staticDelayCodeService.getDelayCodes();
}
