import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveXPage } from './live-x.page';

describe('LiveXPage', () => {
  let component: LiveXPage;
  let fixture: ComponentFixture<LiveXPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveXPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveXPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
