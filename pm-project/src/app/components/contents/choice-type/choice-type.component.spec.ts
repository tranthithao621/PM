import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceTypeComponent } from './choice-type.component';

describe('ChoiceTypeComponent', () => {
  let component: ChoiceTypeComponent;
  let fixture: ComponentFixture<ChoiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
