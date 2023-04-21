import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionJobcodesComponent } from './discussion-jobcodes.component';

describe('DiscussionJobcodesComponent', () => {
  let component: DiscussionJobcodesComponent;
  let fixture: ComponentFixture<DiscussionJobcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionJobcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionJobcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
