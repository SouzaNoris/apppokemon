import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

import { PokemonsListComponent } from './pokemons-list.component';

describe('PokemonsListComponent', () => {
  let component: PokemonsListComponent;
  let fixture: ComponentFixture<PokemonsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonsListComponent],
      imports: [
        HttpClientModule
      ],
      providers: [
        PokemonService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Deve testar método ${PokemonsListComponent.prototype.ngOnInit.name} e chamar método getAllPokemon`, () => {
    spyOn(component, 'getAllPokemon');

    component.ngOnInit();

    expect(component.getAllPokemon).toHaveBeenCalled();
  });

  it(`Deve testar método ${PokemonsListComponent.prototype.getAllPokemon.name} e carrega objeto pokePaginated e pokemonsList`, () => {
    spyOn(component.pokemonService, 'getAllPokemons').and.returnValue(
      of({
        count: 1,
        next: 'próxima página',
        previous: 'página anterior',
        results: [
          {
            name: 'bulbasaur',
            url: '',
          },
        ],
        selected: false,
      })
    );

    component.getAllPokemon();

    expect(component.pokePaginated).toBeDefined();
    expect(component.pokePaginated.next).toBe('próxima página');
    expect(component.pokePaginated.previous).toBe('página anterior');
    expect(component.pokePaginated.results).toEqual([
      {
        name: 'bulbasaur',
        url: '',
      },
    ]);
    expect(component.pokePaginated.selected).toBe(false);
    expect(component.pokemonsList.length).toBe(1);
  });

  it(`Deve testar método ${PokemonsListComponent.prototype.reload.name} e recebendo array e 
  popluando pokemonsList`, () => {
    component.reload([
      {
        name: 'bulbasaur',
        url: '',
      },
      {
        name: 'pikachu',
        url: '',
      },
    ]);

    expect(component.pokemonsList.length).toBe(2);
  });
});
