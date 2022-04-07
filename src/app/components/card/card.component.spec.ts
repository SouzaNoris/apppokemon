import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [HttpClientModule],
      providers: [PokemonService, FavoriteService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Deve testar método ${CardComponent.prototype.ngOnChanges.name} passando object 
  SimpleChanges com prop paginated`, () => {
    spyOn(component, 'getPokemon');

    component.ngOnChanges({
      paginated: {
        firstChange: true,
        previousValue: { name: 'teste', url: '' },
        currentValue: { name: 'teste 1', url: '' },
        isFirstChange: () => true,
      },
    });

    expect(component.getPokemon).toHaveBeenCalled();
  });

  it(`Deve testar método ${CardComponent.prototype.ngOnChanges.name} passando object 
  SimpleChanges sem o paginated`, () => {
    spyOn(component, 'getPokemon');

    component.ngOnChanges({});

    expect(component.getPokemon).not.toHaveBeenCalled();
  });

  it(`Deve testar método ${CardComponent.prototype.verifyFavorites.name} recebendo list favorites 
  sem o pokemon listado marcado deixando cardFavorite como false`, () => {
    spyOn(component.favoriteService, 'getFavorites').and.returnValue(
      of([
        {
          id: 1,
        } as any,
      ])
    );
    component.verifyFavorites();

    expect(component.cardFavorite).toBeFalse();
  });

  it(`Deve testar método ${CardComponent.prototype.verifyFavorites.name} recebendo list favorites 
  sem o pokemon listado marcado deixando cardFavorite como true`, () => {
    spyOn(component.favoriteService, 'getFavorites').and.returnValue(
      of([
        {
          id: 1,
        } as any,
      ])
    );

    component.pokemon = { id: 1 } as any;

    component.verifyFavorites();

    expect(component.cardFavorite).toBeTrue();
  });

  it(`Deve testar método ${CardComponent.prototype.ngOnDestroy.name} e chamar o unsubscribe`, () => {
    spyOn(component.subscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it(`Deve testar método ${CardComponent.prototype.getPokemon.name} e verificar se em pokemonService.getPokemonsList
  já não existe o pokemon carregado, neste caso não existe então vai ser chamado o pokemonService.getPokemonByName
  e populando object com value`, fakeAsync(() => {
    spyOn(component.pokemonService, 'getPokemonsList').and.returnValue(
      of([
        {
          name: 'Pikachu',
        } as any,
      ])
    );
    spyOn(component.pokemonService, 'getPokemonByName').and.returnValue(
      of({
        id: 3,
        name: 'bulbasaur',
      } as any)
    );
    spyOn(component, 'setTypes');
    spyOn(component, 'setSpecies');
    spyOn(component, 'setImg');
    spyOn(component, 'verifyFavorites');

    component.paginated = { name: 'bulbasaur', url: '' };

    component.getPokemon();

    tick(300);

    expect(component.pokemon?.name).toBe('bulbasaur');
    expect(component.setTypes).toHaveBeenCalled();
    expect(component.setSpecies).toHaveBeenCalled();
    expect(component.setImg).toHaveBeenCalled();
    expect(component.verifyFavorites).toHaveBeenCalled();
  }));

  it(`Deve testar método ${CardComponent.prototype.getPokemon.name} e verificar se em pokemonService.getPokemonsList
  já não existe o pokemon carregado, neste caso existe então vai ser devolvido
  e populando object com value`, fakeAsync(() => {
    spyOn(component.pokemonService, 'getPokemonsList').and.returnValue(
      of([
        {
          name: 'Pikachu',
        } as any,
      ])
    );

    spyOn(component, 'setTypes');
    spyOn(component, 'setSpecies');
    spyOn(component, 'setImg');
    spyOn(component, 'verifyFavorites');

    component.paginated = { name: 'Pikachu', url: '' };

    component.getPokemon();

    tick(300);

    expect(component.pokemon?.name).toBe('Pikachu');
    expect(component.setTypes).toHaveBeenCalled();
    expect(component.setSpecies).toHaveBeenCalled();
    expect(component.setImg).toHaveBeenCalled();
    expect(component.verifyFavorites).toHaveBeenCalled();
  }));

  it(`Deve testar método ${CardComponent.prototype.setTypes.name} e pegar todos os types.name que existem no array
  do object pokemon.types e setar em type`, () => {
    component.pokemon = {
      name: 'Pikachu',
      types: [
        {
          type: {
            name: 'eletric',
            url: '',
          },
        } as any,
      ],
    } as any;

    component.setTypes();

    expect(component.type).toEqual(['eletric']);
  });

  it(`Deve testar método ${CardComponent.prototype.setSpecies.name} e tendo objeto pokemon.speciesModel preenchido
  chama setValueToPokemonColor`, () => {
    component.pokemon = {
      speciesModel: {
        namePokemon: 'pikachu',
        color: {
          name: 'yellow',
        },
      },
    } as any;

    spyOn(component, 'setValueToPokemonColor');

    component.setSpecies();

    expect(component.setValueToPokemonColor).toHaveBeenCalledWith('yellow');
  });

  it(`Deve testar método ${CardComponent.prototype.setSpecies.name} não tendo objeto pokemon.speciesModel preenchido
  chamando o método getSpecies e setValueToPokemonColor`, fakeAsync(() => {
    spyOn(component.pokemonService, 'getSpecies').and.returnValue(
      of({
        color: {
          name: 'yellow',
        },
      } as any)
    );

    spyOn(component, 'setValueToPokemonColor');

    component.pokemon = {
      species: {
        name: 'eletric',
      },
    } as any;

    component.setSpecies();

    tick(300);

    expect(component.pokemonService.getSpecies).toHaveBeenCalled();
    expect(component.setValueToPokemonColor).toHaveBeenCalledWith('yellow');
  }));

  it(`Deve testar método ${CardComponent.prototype.setValueToPokemonColor.name} passando o colorName como yellow e devolvendo
  valor em pokemonCOlor como var(--yellow)`, () => {
    component.setValueToPokemonColor('yellow');

    expect(component.pokemonColor).toBe('var(--yellow)');
  });

  it(`Deve testar método ${CardComponent.prototype.setValueToPokemonColor.name} passando o colorName como white e devolvendo
  valor em pokemonCOlor como var(--white)`, () => {
    component.setValueToPokemonColor('white');

    expect(component.pokemonColor).toBe('var(--white)');
  });

  it(`Deve testar método ${CardComponent.prototype.setValueToPokemonColor.name} passando o colorName como red 
  e devolvendo valor em pokemonColor como red`, () => {
    component.setValueToPokemonColor('red');

    expect(component.pokemonColor).toBe('red');
  });

  it(`Deve testar método ${CardComponent.prototype.setImg.name} setando em imgPokemon o valor da imagem 
  dream_word front_default que é svg`, () => {
    component.pokemon = {
      sprites: {
        other: {
          dream_world: {
            front_default: 'caminho',
          },
        },
      },
    } as any;

    component.setImg();

    expect(component.imgPokemon).toBe('caminho');
  });

  it(`Deve testar método ${CardComponent.prototype.setImg.name} setando em imgPokemon o valor da imagem 
  front_default que é png`, () => {
    component.pokemon = {
      sprites: {
        other: null,
        front_default: 'caminho',
      },
    } as any;

    component.setImg();

    expect(component.imgPokemon).toBe('caminho');
  });

  it(`Deve testar método ${CardComponent.prototype.setFavorite.name} e setar cardFavorite como true
  e não encontrando o pokemon na lista de favoritos, chama o favoriteService.setFavorite`, fakeAsync(() => {
    component.cardFavorite = false;

    component.pokemon = {
      name: 'Pikachu',
    } as any;

    spyOn(component.favoriteService, 'getFavorites').and.returnValue(of([]));
    spyOn(component.favoriteService, 'setFavorite');

    component.setFavorite();

    tick(300);

    expect(component.favoriteService.setFavorite).toHaveBeenCalled();
  }));

  it(`Deve testar método ${CardComponent.prototype.setFavorite.name} e setar cardFavorite como true
  e encontrando o pokemon na lista de favoritos, assim não chama o favoriteService.setFavorite`, fakeAsync(() => {
    component.cardFavorite = false;

    component.pokemon = {
      name: 'Pikachu',
    } as any;

    spyOn(component.favoriteService, 'getFavorites').and.returnValue(
      of([
        {
          name: 'Pikachu',
        } as any,
      ])
    );
    spyOn(component.favoriteService, 'setFavorite');

    component.setFavorite();

    tick(300);

    expect(component.favoriteService.setFavorite).not.toHaveBeenCalled();
  }));

  it(`Deve testar método ${CardComponent.prototype.setFavorite.name} e setar cardFavorite como false
  e chama o favoriteService.removeFavorite`, fakeAsync(() => {
    component.cardFavorite = true;

    component.pokemon = {
      name: 'Pikachu',
    } as any;

    spyOn(component.favoriteService, 'removeFavorite');

    component.setFavorite();

    tick(300);

    expect(component.favoriteService.removeFavorite).toHaveBeenCalledWith(
      component.pokemon as any
    );
  }));
});
