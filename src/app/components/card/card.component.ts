import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { IPokemonPaginated } from 'src/app/shared/interfaces/pokemon-paginated.interface';
import { IPokemon } from 'src/app/shared/interfaces/pokemon.interface';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnChanges {
  @Input('paginated') paginated: IPokemonPaginated | undefined = undefined;
  pokemon: IPokemon | undefined = undefined;
  pokemonColor: string = '';
  imgPokemon: string = '';
  cardFavorite: boolean = false;
  subscription: Subscription = new Subscription();

  type: string[] = [];

  constructor(
    public pokemonService: PokemonService,
    public favoriteService: FavoriteService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginated) {
      this.getPokemon();
    }
  }

  ngOnInit(): void {}

  verifyFavorites(): void {
    this.favoriteService
      .getFavorites()
      .subscribe((favorites) => {
        this.cardFavorite = favorites
          ? favorites.filter((x) => x.id === this.pokemon?.id).length > 0
          : false;
      })
      .unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPokemon(): void {
    this.pokemonService
      .getPokemonsList()
      .pipe(
        switchMap((pokemonList) => {
          let poke = pokemonList.filter((x) => x.name === this.paginated?.name);

          if (!poke.length)
            return this.pokemonService.getPokemonByName(
              this.paginated?.name as string
            );

          return of(poke[0]);
        })
      )
      .subscribe((pokemon: IPokemon) => {
        this.pokemon = pokemon;

        this.setTypes();
        this.setSpecies();
        this.setImg();
        this.verifyFavorites();
      });
  }

  setTypes(): void {
    this.type = (this.pokemon as IPokemon).types.map((x) => x.type.name);
  }

  setSpecies(): void {
    if (this.pokemon?.speciesModel) {
      this.setValueToPokemonColor(this.pokemon.speciesModel.color.name);

      return;
    }

    this.pokemonService
      .getSpecies((this.pokemon as IPokemon).species.name)
      .subscribe((response: any) => {
        this.setValueToPokemonColor(response.color.name);
      });
  }

  setValueToPokemonColor(colorName: string): void {
    this.pokemonColor =
      colorName === 'yellow'
        ? 'var(--yellow)'
        : colorName === 'white'
        ? 'var(--white)'
        : colorName;
  }

  setImg(): void {
    this.imgPokemon =
      this.pokemon?.sprites?.other?.dream_world?.front_default ??
      (this.pokemon?.sprites?.front_default as string);
  }

  setFavorite(): void {
    this.cardFavorite = !this.cardFavorite;

    if (this.cardFavorite) {
      this.favoriteService
        .getFavorites()
        .subscribe((favorites) => {
          if (!favorites) favorites = [];

          if (favorites.filter((x) => x.name === this.pokemon?.name).length)
            return;

          favorites.push(this.pokemon as IPokemon);

          this.favoriteService.setFavorite(favorites);
        })
        .unsubscribe();
    } else {
      this.favoriteService.removeFavorite(this.pokemon as IPokemon);
    }
  }
}
