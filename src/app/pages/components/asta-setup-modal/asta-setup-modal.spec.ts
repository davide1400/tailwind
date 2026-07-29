import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstaSetupModal } from './asta-setup-modal';

describe('AstaSetupModal', () => {
  let component: AstaSetupModal;
  let fixture: ComponentFixture<AstaSetupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstaSetupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstaSetupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
