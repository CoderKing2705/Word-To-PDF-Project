import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionManagerComponent } from './conversion-manager.component';

describe('ConversionManagerComponent', () => {
  let component: ConversionManagerComponent;
  let fixture: ComponentFixture<ConversionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
