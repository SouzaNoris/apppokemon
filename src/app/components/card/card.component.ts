import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPokemonPaginated } from 'src/app/shared/interfaces/pokemon-paginated.interface';
import { IPokemon } from 'src/app/shared/interfaces/pokemon.interface';
import { ITypes } from 'src/app/shared/interfaces/types.interface';
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

  type: string[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginated) this.getPokemon();
  }

  ngOnInit(): void {}

  getPokemon(): void {
    this.pokemonService
      .getPokemon(this.paginated?.name as string)
      .subscribe((response: IPokemon) => {
        this.pokemon = response;
        this.type = this.pokemon.types.map((x) => x.type.name);
        this.pokemonService
          .getSpecies(this.pokemon.name)
          .subscribe((response: any) => {
            this.pokemonColor =
              response.color.name === 'yellow'
                ? 'var(--yellow)'
                : response.color.name;
          });
      });
  }
}
