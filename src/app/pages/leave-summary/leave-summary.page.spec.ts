import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSummaryPage } from './leave-summary.page';

describe('LeaveSummaryPage', () => {
  let component: LeaveSummaryPage;
  let fixture: ComponentFixture<LeaveSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveSummaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
