import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PokemonsListComponent } from './pages/pokemons-list/pokemons-list.component';
import { CardModule } from './components/card/card.module';
import { PaginatedModule } from './components/paginated/paginated.module';
import { LoadingModule } from './components/loading/loading.module';
import { InterceptorService } from './shared/services/interceptor.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, PokemonsListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    PaginatedModule,
    LoadingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
