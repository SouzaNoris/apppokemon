import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PokemonsListComponent } from './pages/pokemons-list/pokemons-list.component';
import { CardModule } from './components/card/card.module';

@NgModule({
  declarations: [AppComponent, HomeComponent, PokemonsListComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, CardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
