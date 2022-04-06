import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPokemonPaginated } from 'src/app/shared/interfaces/pokemon-paginated.interface';
import { FavoriteService } from 'src/app/shared/services/favorite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pokemonsList: IPokemonPaginated[] = [];
  subscription: Subscription = new Subscription();

  constructor(public favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.subscription = this.favoriteService
      .getFavorites()
      .subscribe((favorites) => {
        if (!favorites) return;

        this.pokemonsList = [];
        
        favorites.forEach((favorite) => {
          this.pokemonsList.push({ name: favorite.name, url: '' });
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
