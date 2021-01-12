import { TestBed } from '@angular/core/testing';

import { LeaveApprovalService } from './leave-approval.service';

describe('LeaveApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveApprovalService = TestBed.get(LeaveApprovalService);
    expect(service).toBeTruthy();
  });
});
