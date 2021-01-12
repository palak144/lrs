import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveShowMorePopupPage } from './leave-show-more-popup.page';

describe('LeaveShowMorePopupPage', () => {
  let component: LeaveShowMorePopupPage;
  let fixture: ComponentFixture<LeaveShowMorePopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveShowMorePopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveShowMorePopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
