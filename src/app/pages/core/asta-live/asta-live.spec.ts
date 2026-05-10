import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstaLive } from './asta-live';

describe('AstaLive', () => {
  let component: AstaLive;
  let fixture: ComponentFixture<AstaLive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstaLive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstaLive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
