import { TestBed } from '@angular/core/testing';

import { LeaveSummaryService } from './leave-summary.service';

describe('LeaveSummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveSummaryService = TestBed.get(LeaveSummaryService);
    expect(service).toBeTruthy();
  });
});
