import { IAbilities } from './abilities.interface';
import { IForms } from './forms.interface';
import { IGameIndices } from './game_indices.interface';
import { IHeldItems } from './held_items.interface';
import { IMoves } from './moves.interface';
import { IPaginatedResult } from './paginated-result.interface';
import { IPastTypes } from './past_types.interface';
import { ISpecies } from './species.interface';
import { ISprites } from './sprites.interface';
import { IStats } from './stats.interface';
import { ITypes } from './types.interface';

export interface IPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: IAbilities[];
  forms: IForms[];
  game_indices: IGameIndices[];
  held_items: IHeldItems[];
  location_area_encounters: string;
  moves: IMoves[];
  species: ISpecies;
  sprites: ISprites;
  stats: IStats[];
  types: ITypes[];
  past_types: IPastTypes[];
}
