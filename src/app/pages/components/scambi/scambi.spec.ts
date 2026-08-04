import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scambi } from './scambi';

describe('Scambi', () => {
  let component: Scambi;
  let fixture: ComponentFixture<Scambi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scambi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scambi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
