import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradePlayerCard } from './trade-player-card';

describe('TradePlayerCard', () => {
  let component: TradePlayerCard;
  let fixture: ComponentFixture<TradePlayerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradePlayerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradePlayerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
