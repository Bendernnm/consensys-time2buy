import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialSellerComponent } from './potential-seller.component';

describe('PotentialSellerComponent', () => {
  let component: PotentialSellerComponent;
  let fixture: ComponentFixture<PotentialSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PotentialSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PotentialSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
