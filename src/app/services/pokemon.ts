// Import { Injectable, inject } from '@angular/core'; Injectable serve para marcar a classe como um serviço injetável,
// e inject é usado para injetar dependências.
// Import { HttpClient } from '@angular/common/http'; Serviço para fazer requisições HTTP.
// Import { Observable } from 'rxjs'; Serviço para lidar com fluxos de dados assíncronos, como respostas de requisições HTTP.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// A classe PokemonService é marcada como injetável e fornecida no nível raiz da aplicação.
@Injectable({
  providedIn: 'root'
})

// A classe PokemonService é responsável por interagir com a API de Pokémon.
export class PokemonService {
  // Injeta o HttpClient para fazer requisições HTTP.
  private http = inject(HttpClient);
  // Define a URL base da API de Pokémon.
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  // Busca uma lista de Pokémon, com parâmetros
  getPokemons(limit: number = 151, offset: number = 0): Observable<any> {
    // Retorna um Observable que emite a resposta da requisição HTTP GET.
    return this.http.get(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }
  // Busca detalhes de um Pokémon, usando o ID do Pokémon.
  getPokemonDetail(id: string): Observable<any> {
    // Retorna um Observable que emite a resposta da requisição HTTP GET, usando o ID fornecido.
    return this.http.get(`${this.apiUrl}/${id}`);
  }


}