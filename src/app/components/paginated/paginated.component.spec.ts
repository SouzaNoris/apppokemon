import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

import { PaginatedComponent } from './paginated.component';

describe('PaginatedComponent', () => {
  let component: PaginatedComponent;
  let fixture: ComponentFixture<PaginatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatedComponent],
      imports: [HttpClientModule],
      providers: [PokemonService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Deve testar getter firstElement retornando false`, () => {
    spyOnProperty(component, 'firstElement').and.returnValue(false);

    expect(component.firstElement).toBeFalse();
  });

  it(`Deve testar getter firstElement retornando false`, () => {
    spyOnProperty(component, 'firstElement').and.returnValue(true);

    expect(component.firstElement).toBeTrue();
  });

  it(`Deve testar getter lastElement retornando false`, () => {
    spyOnProperty(component, 'lastElement').and.returnValue(false);

    expect(component.lastElement).toBeFalse();
  });

  it(`Deve testar getter lastElement retornando false`, () => {
    spyOnProperty(component, 'lastElement').and.returnValue(true);

    expect(component.lastElement).toBeTrue();
  });

  it(`Deve testar método ${PaginatedComponent.prototype.ngOnChanges.name} e chamar não chamar método 
  setCountPaginator pois não há alterações`, () => {
    spyOn(component, 'setCountPaginator');

    component.ngOnChanges({});

    expect(component.setCountPaginator).not.toHaveBeenCalled();
  });

  it(`Deve testar método ${PaginatedComponent.prototype.ngOnChanges.name} e chamar não chamar método 
  setCountPaginator pois não há alterações`, () => {
    spyOn(component, 'setCountPaginator');

    component.ngOnChanges({
      paginated: {
        firstChange: true,
        previousValue: { name: 'teste', url: '' },
        currentValue: { name: 'teste 1', url: '' },
        isFirstChange: () => true,
      },
    });

    expect(component.setCountPaginator).toHaveBeenCalled();
  });

  it(`Deve testar método ${PaginatedComponent.prototype.setCountPaginator.name} criando objeto
  countPaginator`, () => {
    component.paginated = {
      count: 1000,
      next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
      results: [
        { name: 'teste 1', url: '' },
        { name: 'teste 2', url: '' },
        { name: 'teste 3', url: '' },
        { name: 'teste 4', url: '' },
        { name: 'teste 5', url: '' },
        { name: 'teste 6', url: '' },
        { name: 'teste 7', url: '' },
        { name: 'teste 8', url: '' },
        { name: 'teste 9', url: '' },
        { name: 'teste 10', url: '' },
      ],
    } as any;

    component.setCountPaginator();

    expect(component.countPaginator.length).toBe(10);
    expect(component.countPaginator[0].next).toBe(
      'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100'
    );
    expect(component.countPaginator[0].previous).toBe(
      'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100'
    );
    expect(component.countPaginator[0].results.length).toBe(0);
    expect(component.countPaginator[0].selected).toBeTrue();

    expect(component.countPaginator[1].next).toBe(
      'https://pokeapi.co/api/v2/pokemon/?offset=200&limit=100'
    );
    expect(component.countPaginator[1].previous).toBe(
      'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100'
    );
    expect(component.countPaginator[1].results.length).toBe(0);
    expect(component.countPaginator[1].selected).toBeFalse();
  });

  it(`Deve testar método ${PaginatedComponent.prototype.setCountPaginator.name} não criando objeto
  countPaginator`, () => {
    component.paginated = {
      count: 1000,
      next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
      results: [],
    } as any;

    component.setCountPaginator();

    expect(component.countPaginator.length).toBe(0);
  });

  it(`Deve testar método ${PaginatedComponent.prototype.next.name} pegando o valor o indice do item selecionado para
  obter a url next, e remove a seleção do item, e setá o próximo do indice + 1 como true`, fakeAsync(() => {
    component.countPaginator = [
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: true,
      },
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=200&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: false,
      },
    ];

    spyOn(component.pokemonService, 'get').and.returnValue(
      of({
        count: 1000,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        results: [
          { name: 'teste 1', url: '' },
          { name: 'teste 2', url: '' },
        ],
      })
    );

    spyOn(component.eventReload, 'emit');

    component.next();

    tick(300);

    expect(component.countPaginator[0].selected).toBeFalse();
    expect(component.countPaginator[1].selected).toBeTrue();
    expect(component.pokemonService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100'
    );
    expect(component.eventReload.emit).toHaveBeenCalledWith([
      { name: 'teste 1', url: '' },
      { name: 'teste 2', url: '' },
    ]);
  }));

  it(`Deve testar método ${PaginatedComponent.prototype.previous.name} e pegar valor previous do indice selecionado
  retornar para o index -1 marcando como selecionado`, fakeAsync(() => {
    component.countPaginator = [
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: false,
      },
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=200&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: true,
      },
    ];

    spyOn(component.pokemonService, 'get').and.returnValue(
      of({
        count: 1000,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        results: [
          { name: 'teste 1', url: '' },
          { name: 'teste 2', url: '' },
        ],
      })
    );

    spyOn(component.eventReload, 'emit');

    component.previous();

    tick(300);

    expect(component.countPaginator[0].selected).toBeTrue();
    expect(component.countPaginator[1].selected).toBeFalse();
    expect(component.pokemonService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100'
    );
    expect(component.eventReload.emit).toHaveBeenCalledWith([
      { name: 'teste 1', url: '' },
      { name: 'teste 2', url: '' },
    ]);
  }));

  it(`Deve testar método ${PaginatedComponent.prototype.nextPaginatorIndex.name} e chamar o previous do item paginado
  selecionado marcar outros items como false e ao final chamar eventReload.emit`, fakeAsync(() => {
    component.countPaginator = [
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: true,
      },
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=200&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100',
        results: [],
        selected: false,
      },
      {
        count: 1,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        results: [],
        selected: false,
      },
    ];

    spyOn(component.pokemonService, 'get').and.returnValue(
      of({
        count: 1000,
        next: 'https://pokeapi.co/api/v2/pokemon/?offset=300&limit=100',
        previous: 'https://pokeapi.co/api/v2/pokemon/?offset=100&limit=100',
        results: [
          { name: 'teste 1', url: '' },
          { name: 'teste 2', url: '' },
        ],
      })
    );

    spyOn(component.eventReload, 'emit');

    component.nextPaginatorIndex(component.countPaginator[1]);

    tick(300);

    expect(component.countPaginator[0].selected).toBeFalse();
    expect(component.countPaginator[1].selected).toBeTrue();
    expect(component.countPaginator[2].selected).toBeFalse();
    expect(component.pokemonService.get).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100'
    );
    expect(component.eventReload.emit).toHaveBeenCalledWith([
      { name: 'teste 1', url: '' },
      { name: 'teste 2', url: '' },
    ]);
  }));
});
