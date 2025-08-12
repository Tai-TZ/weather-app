import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWeatherComponent } from './admin-weather.component';

describe('AdminWeatherComponent', () => {
  let component: AdminWeatherComponent;
  let fixture: ComponentFixture<AdminWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWeatherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
