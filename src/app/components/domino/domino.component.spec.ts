import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominoComponent } from './domino.component';

describe('DominoComponent', () => {
  let component: DominoComponent;
  let fixture: ComponentFixture<DominoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DominoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DominoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
