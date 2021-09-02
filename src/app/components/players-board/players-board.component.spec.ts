import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersBoardComponent } from './players-board.component';

describe('PlayersBoardComponent', () => {
  let component: PlayersBoardComponent;
  let fixture: ComponentFixture<PlayersBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
