// Imports necessários do Angular para criar o componente, injetar serviços e detectar mudanças.
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import commonModule do Angular, que fornece diretivas e pipes comuns.
import { CommonModule } from '@angular/common';
// Importa o módulo RouterLink do Angular, que permite navegação entre rotas.
import { RouterLink } from '@angular/router';
// Import serviço PokemonService, por interagir com a API de Pokémon.
import { PokemonService } from '../../services/pokemon';

// Componente Angular que exibe uma lista de Pokémon, usando o serviço PokemonService para buscar dados da API.
@Component({
  // Selector do componente, usado para referenciá-lo no HTML.
  selector: 'app-pokemon-list',
  // Strandalone indica que o componente é independente
  standalone: true,
  // Imports define os módulos que o componente utiliza
  imports: [CommonModule, RouterLink],
  // TemplateUrl define o caminho para o arquivo HTML
  templateUrl: './pokemon-list.html',
  // StyleUrl define o caminho para o arquivo SCSS
  styleUrl: './pokemon-list.scss'
})

// Classe PokemonListComponent implementa a interface OnInit
export class PokemonListComponent implements OnInit {
  // Injecta o serviço PokemonService para buscar informações da API de Pokémon.
  pokemonService = inject(PokemonService);
  // Cdr ref é usado para detectar mudanças e atualizar o HTML do componente.
  cdr = inject(ChangeDetectorRef);
  // Propriedade para armazenar a lista de Pokémon.
  pokemons: any[] = [];


  // O método ngOnInit  componente de inicializado.
  ngOnInit(): void {
    // Chama o método getPokemons para buscar a lista de Pokémon.
    this.pokemonService.getPokemons().subscribe({
      // Se a chamada for bem-sucedida, processa os dados recebidos.
      next: (response: any) => {
        // log os dados recebidos
        console.log('Dados da PokeAPI recebidos:', response);
        // Mapeia os resultados da API, ID e URL da imagem de cada Pokémon.
        this.pokemons = response.results.map((poke: any) => {
          // const id extrai o ID do Pokémon a partir da URL fornecida pela API.
          const id = poke.url.split('/').filter(Boolean).pop();
          // Retorna um objeto com o nome, ID e URL da imagem do Pokémon.
          return {
            name: poke.name,
            id: id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });
        // Chama detectChanges para atualizar o HTML do componente imediatamente após a atualização da lista
        this.cdr.detectChanges(); 
      },
      // Error caso ocorra um erro na chamada à API, exibe uma mensagem de erro no console.
      error: (err) => console.error('Erro na chamada à API:', err)
    });
  }
}