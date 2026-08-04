import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTradePanel } from './team-trade-panel';

describe('TeamTradePanel', () => {
  let component: TeamTradePanel;
  let fixture: ComponentFixture<TeamTradePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamTradePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTradePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
