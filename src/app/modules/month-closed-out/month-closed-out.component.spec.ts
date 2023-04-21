import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthClosedOutComponent } from './month-closed-out.component';

describe('MonthClosedOutComponent', () => {
  let component: MonthClosedOutComponent;
  let fixture: ComponentFixture<MonthClosedOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthClosedOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthClosedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
