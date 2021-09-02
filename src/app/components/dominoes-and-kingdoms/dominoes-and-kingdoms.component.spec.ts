import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominoesAndKingdomsComponent } from './dominoes-and-kingdoms.component';

describe('DominoesAndKingdomsComponent', () => {
  let component: DominoesAndKingdomsComponent;
  let fixture: ComponentFixture<DominoesAndKingdomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DominoesAndKingdomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DominoesAndKingdomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
