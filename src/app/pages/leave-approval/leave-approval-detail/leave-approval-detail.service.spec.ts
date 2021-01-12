import { TestBed } from '@angular/core/testing';

import { LeaveApprovalDetailService } from './leave-approval-detail.service';

describe('LeaveApprovalDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveApprovalDetailService = TestBed.get(LeaveApprovalDetailService);
    expect(service).toBeTruthy();
  });
});
