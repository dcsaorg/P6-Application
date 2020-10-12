import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampEditorComponent } from './timestamp-editor.component';

describe('TimestampEditorComponent', () => {
  let component: TimestampEditorComponent;
  let fixture: ComponentFixture<TimestampEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
