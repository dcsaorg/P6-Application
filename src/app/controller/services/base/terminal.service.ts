import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Terminal } from '../../../model/portCall/terminal';
import { map, Observable } from 'rxjs';
import { Globals } from '../../../model/portCall/globals';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private readonly TERMINAL_URL_BACKEND: string;

  constructor(private httpClient: HttpClient,
              private globals: Globals,
              private translate: TranslateService,
              ) {
    this.TERMINAL_URL_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/terminals?facilitySMDGCode:neq=NULL';
  }

  getTerminalsByUNLocationCode(UNLocationCode?: string, includePortLevelFilter: boolean = false): Observable<Terminal[]> {
    return this.httpClient.get<Terminal[]>(this.TERMINAL_URL_BACKEND + '&UNLocationCode=' + UNLocationCode).
      pipe(
        map(terminals => includePortLevelFilter ? this.addPortLevelFilter(terminals) : terminals)
    );
  }

  private addPortLevelFilter(terminals: Terminal[]): Terminal[] {
    const PORT_LEVEL_FILTER: Terminal = {
      facilityName: this.translate.instant('general.terminal.portLevelFilter'),
      facilityBICCode: 'NULL',
      facilitySMDGCode: 'NULL',
      UNLocationCode: 'N/A',
    };
    terminals.push(PORT_LEVEL_FILTER);
    return terminals;
  }
}
