import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesExplainedComponent } from './rules-explained.component';

describe('RulesExplainedComponent', () => {
  let component: RulesExplainedComponent;
  let fixture: ComponentFixture<RulesExplainedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesExplainedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesExplainedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
