import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface exportada para tipar os componentes
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  url?: string;
  types?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  // Busca a lista de Pokémon e já formata id e image
  getPokemons(limit: number = 151, offset: number = 0): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`).pipe(
      map(response => {
        return response.results.map((item: any) => {
          // Extrai o ID numérico da URL (ex: "https://pokeapi.co/api/v2/pokemon/25/")
          const urlParts = item.url.split('/').filter(Boolean);
          const id = parseInt(urlParts[urlParts.length - 1], 10);

          return {
            id,
            name: item.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            url: item.url
          };
        });
      })
    );
  }

  // Busca detalhes individuais de um Pokémon
  getPokemonDetail(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}