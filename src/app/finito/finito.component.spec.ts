import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinitoComponent } from './finito.component';

describe('FinitoComponent', () => {
  let component: FinitoComponent;
  let fixture: ComponentFixture<FinitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
