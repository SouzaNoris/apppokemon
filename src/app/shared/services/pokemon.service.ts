import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPaginated } from '../interfaces/paginated.interface';
import { IPokemon } from '../interfaces/pokemon.interface';
import { ISpecies } from '../interfaces/species.interface';
import { ITypes } from '../interfaces/types.interface';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private _url = environment.apiUrl;
  private _pokemonsList: IPokemon[] = [];

  constructor(private http: HttpClient) {}

  getPokemon(idOrName: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(`${this._url}pokemon/${idOrName}`);
  }

  getAllPokemons(
    offset: number = 100,
    limit: number = 100
  ): Observable<IPaginated> {
    let params = new HttpParams()
      .append('offset', offset)
      .append('limit', limit);

    return this.http.get<IPaginated>(`${this._url}pokemon/`, {
      params,
    });
  }

  getSpecies(name: string): Observable<{ color: { name: string } }> {
    return this.http.get<{ color: { name: string } }>(
      `${this._url}pokemon-species/${name}`
    );
  }
}
