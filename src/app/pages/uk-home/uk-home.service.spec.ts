import { TestBed } from '@angular/core/testing';

import { UkHomeService } from './uk-home.service';

describe('UkHomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UkHomeService = TestBed.get(UkHomeService);
    expect(service).toBeTruthy();
  });
});
