import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TimestampTableComponent} from './timestamp-table.component';

describe('TimestampTableComponent', () => {
  let component: TimestampTableComponent;
  let fixture: ComponentFixture<TimestampTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
