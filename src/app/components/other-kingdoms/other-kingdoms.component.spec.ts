import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherKingdomsComponent } from './other-kingdoms.component';

describe('OtherKingdomsComponent', () => {
  let component: OtherKingdomsComponent;
  let fixture: ComponentFixture<OtherKingdomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherKingdomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherKingdomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
