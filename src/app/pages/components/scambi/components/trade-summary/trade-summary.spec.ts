import { TradeSummary } from './trade-summary';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('TeamTradeSummary', () => {
  let component: TradeSummary;
  let fixture: ComponentFixture<TradeSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
