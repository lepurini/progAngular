import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutatoreComponent } from './valutatore.component';

describe('ValutatoreComponent', () => {
  let component: ValutatoreComponent;
  let fixture: ComponentFixture<ValutatoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValutatoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutatoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
