import { TestBed } from '@angular/core/testing';

import { SaHomeService } from './sa-home.service';

describe('SaHomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaHomeService = TestBed.get(SaHomeService);
    expect(service).toBeTruthy();
  });
});
