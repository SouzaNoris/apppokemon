import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingComponent ],
      providers: [LoaderService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Deve testar método ${LoadingComponent.prototype.ngOnInit.name} e assinar subscrible do loader recebendo true`, () => {
    spyOnProperty(component.loaderService, 'loader').and.returnValue(of(true));

    component.ngOnInit();

    expect(component.hideLoader).toBeTrue();
  });

  it(`Deve testar método ${LoadingComponent.prototype.ngOnInit.name} e assinar subscrible do loader recebendo false`, () => {
    spyOnProperty(component.loaderService, 'loader').and.returnValue(of(false));

    component.ngOnInit();

    expect(component.hideLoader).toBeFalse();
  });
});
