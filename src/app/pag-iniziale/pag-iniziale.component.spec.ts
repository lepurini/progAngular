import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagInizialeComponent } from './pag-iniziale.component';

describe('PagInizialeComponent', () => {
  let component: PagInizialeComponent;
  let fixture: ComponentFixture<PagInizialeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagInizialeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagInizialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
