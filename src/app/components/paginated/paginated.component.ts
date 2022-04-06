import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IPaginated } from 'src/app/shared/interfaces/paginated.interface';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

@Component({
  selector: 'app-paginated',
  templateUrl: './paginated.component.html',
  styleUrls: ['./paginated.component.scss'],
})
export class PaginatedComponent implements OnInit, OnChanges {
  @Input('paginated') paginated: IPaginated | undefined;

  @Output('eventReload') eventReload: EventEmitter<any> = new EventEmitter();

  countPaginator: IPaginated[] = [];

  get firstElement() {
    return this.countPaginator.length && this.countPaginator[0].selected;
  }

  get lastElement() {
    return this.countPaginator.length &&
      this.countPaginator[this.countPaginator.length - 1].selected;
  }

  constructor(public pokemonService: PokemonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginated && changes.paginated.currentValue)
      this.setCountPaginator();
  }

  ngOnInit(): void {}

  setCountPaginator(): void {
    let value = !this.paginated?.results.length
      ? 0
      : +(this.paginated as IPaginated).next
          .split('?')[1]
          .split('&')[1]
          .split('=')[1];

    let urlBase = (this.paginated as IPaginated).next.split('?')[0];

    let items = (this.paginated as IPaginated).count / value;
    let limit = value;
    let offset = value;

    for (let index = 1; index <= items; index++) {
      this.countPaginator.push({
        count: index,
        next: `${urlBase}?offset=${offset * index}&limit=${limit}`,
        previous: `${urlBase}?offset=${offset * index - value}&limit=${limit}`,
        results: [],
        selected: index === 1,
      });
    }
  }

  next(): void {
    let index = this.countPaginator.indexOf(
      this.countPaginator.filter((x) => x.selected)[0]
    );
    let next = this.countPaginator[index].next;
    this.countPaginator.forEach((x) => (x.selected = false));
    this.countPaginator[index + 1].selected = true;

    this.pokemonService.get(next).subscribe((response: IPaginated) => {
      this.eventReload.emit(response.results);
    });
  }

  previous(): void {
    let index = this.countPaginator.indexOf(
      this.countPaginator.filter((x) => x.selected)[0]
    );
    let previous = this.countPaginator[index - 1].previous;
    this.countPaginator.forEach((x) => (x.selected = false));
    this.countPaginator[index - 1].selected = true;

    this.pokemonService.get(previous).subscribe((response: IPaginated) => {
      this.eventReload.emit(response.results);
    });
  }

  nextPaginatorIndex(paginated: IPaginated): void {
    this.countPaginator.forEach((x) => (x.selected = false));

    paginated.selected = true;

    this.pokemonService
      .get(paginated.previous)
      .subscribe((response: IPaginated) => {
        this.eventReload.emit(response.results);
      });
  }
}
