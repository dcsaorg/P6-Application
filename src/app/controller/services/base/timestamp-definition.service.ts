import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Globals} from "../../../model/portCall/globals";
import {timestampDefinitionTO} from "../../../model/jit/timestamp-definition";
import {map} from 'rxjs/operators';

function asMap(timestampDefinitions: timestampDefinitionTO[]): Map<string, timestampDefinitionTO> {
  let map = new Map<string, timestampDefinitionTO>()
  for (let timestampDefinitionTO of timestampDefinitions) {
    map.set(timestampDefinitionTO.id, timestampDefinitionTO);
  }
  return map;
}

@Injectable({
  providedIn: 'root'
})
export class TimestampDefinitionService {
  private readonly TIMESTAMP_DEFINITION_BACKEND: string;
  // the timestamps are not likely to change during a work session.
  private definitionCache: timestampDefinitionTO[] = [];

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TIMESTAMP_DEFINITION_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/timestamp-definitions';
  }

  getTimestampDefinitions(): Observable<timestampDefinitionTO[]> {
    if (this.definitionCache.length == 0) {
      let httpParams = new HttpParams();
      httpParams = httpParams.set("canonicalTimestampDefinition", "NULL").set("limit", "250");
      return this.httpClient.get<timestampDefinitionTO[]>(this.TIMESTAMP_DEFINITION_BACKEND, {params: httpParams})
        .pipe(
          map(definitions => {
            let table = asMap(definitions);
            // Set up links between "timestampDefinitionTO"s.
            for (let timestampDefinitionTO of definitions) {
              if (timestampDefinitionTO.acceptTimestampDefinition) {
                timestampDefinitionTO.acceptTimestampDefinitionEntity = table.get(timestampDefinitionTO.acceptTimestampDefinition)
              }
              if (timestampDefinitionTO.rejectTimestampDefinition) {
                timestampDefinitionTO.rejectTimestampDefinitionEntity = table.get(timestampDefinitionTO.rejectTimestampDefinition)
              }
            }
            return definitions;
          }),
          map(definitions => this.definitionCache = definitions)
        );
    }
    return of(this.definitionCache);
  }



  getTimestampDefinitionsMap(): Observable<Map<string, timestampDefinitionTO>> {
    return this.getTimestampDefinitions().pipe(
      map(timestampDefinitions => {
        return asMap(timestampDefinitions);
      })
    )
  }
}
