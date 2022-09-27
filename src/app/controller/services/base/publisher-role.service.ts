import {Observable} from 'rxjs';
import {PublisherRoleDetail} from '../../../model/enums/publisherRole';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Globals} from '../../../model/portCall/globals';
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublisherRoleService {
  private readonly PUBLISHER_ROLE_DETAILS_ENDPOINT: string;

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.PUBLISHER_ROLE_DETAILS_ENDPOINT = globals.config.uiSupportBackendURL + '/unofficial/publisher-roles';
  }

  getPublisherRoleDetails = (): Observable<PublisherRoleDetail[]> =>
    this.httpClient.get<PublisherRoleDetail[]>(this.PUBLISHER_ROLE_DETAILS_ENDPOINT).pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    )

}
