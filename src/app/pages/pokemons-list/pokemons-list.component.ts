import { Component, OnInit } from '@angular/core';
import { IPaginated } from 'src/app/shared/interfaces/paginated.interface';
import { IPokemonPaginated } from 'src/app/shared/interfaces/pokemon-paginated.interface';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

@Component({
  selector: 'app-pokemons-list',
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],
})
export class PokemonsListComponent implements OnInit {
  pokemonsList: IPokemonPaginated[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getAllPokemon();
  }

  getAllPokemon(): void {
    this.pokemonService.getAllPokemons().subscribe((response: IPaginated) => {
      this.pokemonsList = [...response.results];
    });
  }
}
