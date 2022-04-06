import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IPaginated } from '../interfaces/paginated.interface';
import { IPokemon } from '../interfaces/pokemon.interface';
import { ISpeciesModel } from '../interfaces/species.interface';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private _url = environment.apiUrl;
  private _pokemonsList: IPokemon[] = [];

  getPokemonsList(): Observable<IPokemon[]> {
    return of(this._pokemonsList);
  }

  constructor(private http: HttpClient) {}

  getPokemonByName(idOrName: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(`${this._url}pokemon/${idOrName}`).pipe(
      tap((pokemon: IPokemon) => {
        let result = this._pokemonsList.find((x) => x.id === pokemon.id);

        if (!result) {
          this._pokemonsList.push(pokemon);
        }
      })
    );
  }

  getAllPokemons(
    offset: number = 0,
    limit: number = 100
  ): Observable<IPaginated> {
    let params = new HttpParams()
      .append('offset', offset)
      .append('limit', limit);

    return this.http.get<IPaginated>(`${this._url}pokemon/`, {
      params,
    });
  }

  getSpecies(name: string): Observable<ISpeciesModel> {
    return this.http.get<ISpeciesModel>(`${this._url}pokemon-species/${name}`);
  }

  get(url: string): Observable<IPaginated> {
    return this.http.get<IPaginated>(`${url}`);
  }
}
