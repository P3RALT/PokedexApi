import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FavoritesService } from '../../services/favorites';

// Componente Angular que exibe uma lista de Pokémon, usando o serviço PokemonService para buscar dados da API.
  // Selector do componente, usado para referenciá-lo no HTML.
  // Strandalone indica que o componente é independente
  // Imports define os módulos que o componente utiliza
  // TemplateUrl define o caminho para o arquivo HTML
  // StyleUrl define o caminho para o arquivo SCSS

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})

// Classe PokemonListComponent implementa a interface OnInit
// Injecta o serviço PokemonService para buscar informações da API de Pokémon.
// Cdr ref é usado para detectar mudanças e atualizar o HTML do componente.
// Propriedade para armazenar a lista de Pokémon.


export class PokemonListComponent implements OnInit {
  pokemonService = inject(PokemonService);
  favoritesService = inject(FavoritesService);
  cdr = inject(ChangeDetectorRef);

  // Propriedades  
  pokemons: any[] = [];
  filteredPokemons: any[] = [];

  // Criação do Campo de Busca; Reativo
  searchControl = new FormControl('');

  // O método ngOnInit  componente de inicializado; Chama getPokemons para buscar a lista de Pokémon. processa os dados recebidos;
  // const id extrai o ID do Pokémon a partir da URL fornecida pela API; Mapeia API, ID e URL da imagem de cada Pokémon.

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe({
      next: (response: any) => {
        this.pokemons = response.results.map((poke: any) => {
          const id = poke.url.split('/').filter(Boolean).pop();
          // Retorna um objeto com o nome, ID e URL da imagem do Pokémon.
          return {
            name: poke.name,
            id: id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });

        // Atualiza a lista filtrada e detecta mudanças para atualizar o HTML do componente.
        this.filteredPokemons = this.pokemons;
        this.cdr.detectChanges(); 
      },

      error: (err) => console.error('Erro na chamada à API:', err)
    });
  }

  // Filtra a lista com base na busca; Converte o termo para minúsculas e remove espaços em branco.
  // Se o termo estiver vazio, exibe a lista completa;

  filterPokemons(term: string): void {
  const cleanTerm = term.toLowerCase().trim();
  
  if (!cleanTerm) {
    this.filteredPokemons = [...this.pokemons];
  } else {
    this.filteredPokemons = this.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(cleanTerm) || 
      pokemon.id.toString().includes(cleanTerm) // Permite encontrar pelo número/ID
    );
  }
  
  this.cdr.detectChanges();
}

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const cleanTerm = value.toLowerCase().trim();

      if (!cleanTerm) {
        this.filteredPokemons = [...this.pokemons];
      } else {
        this.filteredPokemons = this.pokemons.filter(pokemon => 
          pokemon.name.toLowerCase().includes(cleanTerm) || 
          pokemon.id.toString().includes(cleanTerm)
        );
      }

  console.log('3. Pokémons encontrados após filtro:', this.filteredPokemons.length);
  this.cdr.detectChanges();
}

toggleFav(event: Event, id: string): void {
    event.stopPropagation(); // Impede de abrir a página de detalhes ao clicar na estrela
    this.favoritesService.toggleFavorite(id);
    this.cdr.detectChanges();
  }

  isFav(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }
}



