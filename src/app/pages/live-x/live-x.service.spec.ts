import { TestBed } from '@angular/core/testing';

import { LiveXService } from './live-x.service';

describe('LiveXService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveXService = TestBed.get(LiveXService);
    expect(service).toBeTruthy();
  });
});
