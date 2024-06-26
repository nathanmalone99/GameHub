import { TestBed } from '@angular/core/testing';

import { XboxService } from './xbox.service';

describe('XboxService', () => {
  let service: XboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
