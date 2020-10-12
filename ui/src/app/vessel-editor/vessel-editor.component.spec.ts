import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselEditorComponent } from './vessel-editor.component';

describe('VesselEditorComponent', () => {
  let component: VesselEditorComponent;
  let fixture: ComponentFixture<VesselEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VesselEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
