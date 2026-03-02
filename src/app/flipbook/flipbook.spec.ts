import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flipbook } from './flipbook';

describe('Flipbook', () => {
  let component: Flipbook;
  let fixture: ComponentFixture<Flipbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flipbook],
    }).compileComponents();

    fixture = TestBed.createComponent(Flipbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
