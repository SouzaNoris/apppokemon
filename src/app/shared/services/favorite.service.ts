import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPokemon } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoritesBehaviorSubject = new BehaviorSubject<IPokemon[]>([]);

  constructor() {
    this.setValueFavoritesToLocalStorage();
  }

  setValueFavoritesToLocalStorage(): void {
    let favorites = JSON.parse(localStorage.getItem('favorites') as any);

    this.favoritesBehaviorSubject.next(favorites);
  }

  getFavorites(): Observable<IPokemon[]> {
    return this.favoritesBehaviorSubject.asObservable();
  }

  setFavorite(item: IPokemon[]): void {
    localStorage.setItem('favorites', JSON.stringify(item));

    this.favoritesBehaviorSubject.next(item);
  }

  removeFavorite(item: IPokemon): void {
    let favorites = JSON.parse(
      localStorage.getItem('favorites') as any
    ) as IPokemon[];

    let index = favorites.indexOf(favorites.filter((x) => x.id === item.id)[0]);

    favorites.splice(index, 1);

    if (favorites.length)
      localStorage.setItem('favorites', JSON.stringify(favorites));
    else localStorage.removeItem('favorites');

    this.favoritesBehaviorSubject.next(favorites);
  }
}
