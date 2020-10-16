import {TestBed} from '@angular/core/testing';

import {PortcallTimestampService} from './portcall-timestamp.service';

describe('PortcallTimestampService', () => {
  let service: PortcallTimestampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortcallTimestampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
