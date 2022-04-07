import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Deve testar método ${HomeComponent.prototype.ngOnInit.name} e retorna com favorites false`, () => {
    spyOn(component.favoriteService, 'getFavorites').and.returnValue(of([]));

    component.ngOnInit();

    expect(component.pokemonsList.length).toBe(0);
  });

  it(`Deve testar método ${HomeComponent.prototype.ngOnInit.name} e retorna com favorites true
  e retornando list de favorites`, () => {
    spyOn(component.favoriteService, 'getFavorites').and.returnValue(
      of([
        {
          height: 7,
          id: 1,
          name: 'bulbasaur',
          order: 1,
          species: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
          },
          weight: 69,
        } as any,
      ])
    );

    component.ngOnInit();

    expect(component.pokemonsList.length).toBe(1);
    expect(component.pokemonsList.filter((x) => x.name === 'bulbasaur'));
  });

  it(`Deve testar método ${HomeComponent.prototype.ngOnDestroy.name} e chama o unsubscribe`, () => {
    spyOn(component.subscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
