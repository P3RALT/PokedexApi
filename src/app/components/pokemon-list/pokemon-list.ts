import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// Imports com caminhos corrigidos de acordo com a tua estrutura de pastas
import { PokemonService, Pokemon } from '../../services/servicesPokemon/pokemon';
import { FavoritesService } from '../../services/servicesPokemon/favorites';
import { ViaCepService, ViaCepResponse } from '../../services/servicesViaCep/viacep.service';
import { AiEcosystemService, EcosystemAnalysis } from '../../services/servicesAI/ai-ecosystem.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})
export class PokemonListComponent implements OnInit {
  // Lista original e lista filtrada para o grid HTML
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];

  // Estados do Mapeamento Ecológico (Ato 1 e Ato 2)
  localidade: ViaCepResponse | null = null;
  analiseEcologica: EcosystemAnalysis | null = null;
  carregandoIA: boolean = false;
  erroIA: string | null = null;

  private pokemonService = inject(PokemonService);
  private favoritesService = inject(FavoritesService);
  private viaCepService = inject(ViaCepService);
  private aiEcosystemService = inject(AiEcosystemService);

  ngOnInit(): void {
    this.carregarPokemons();
  }

  carregarPokemons(): void {
    this.pokemonService.getPokemons().subscribe({
      next: (data) => {
        this.pokemons = data;
        this.filteredPokemons = data;
      },
      error: (err) => console.error('Erro ao carregar Pokémon da PokéAPI:', err)
    });
  }

  // Filtro acionado pelo input (onSearch)
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (!query) {
      this.filteredPokemons = this.pokemons;
      return;
    }

    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.id.toString() === query
    );
  }

  // Lógica de Favoritos (com conversão explícita para o tipo esperado no FavoritesService)
  isFav(pokemonId: number | string): boolean {
    return this.favoritesService.isFavorite(pokemonId as any);
  }

  toggleFav(event: Event, pokemonId: number | string): void {
    event.stopPropagation(); // Evita abrir o routerLink ao clicar no botão de favorito
    this.favoritesService.toggleFavorite(pokemonId as any);
  }

  // Função para testar a IA + ViaCEP diretamente com um Pokémon selecionado
  async analisarHabitatNoBrasil(pokemon: Pokemon, cep: string): Promise<void> {
    try {
      this.carregandoIA = true;
      this.erroIA = null;
      this.analiseEcologica = null;

      // Ato 1: Consulta ViaCEP
      const dadosCep = await firstValueFrom(this.viaCepService.consultarCep(cep));
      this.localidade = dadosCep;

      // Ato 2: Análise biológica com Gemini AI
      this.analiseEcologica = await this.aiEcosystemService.analisarHabitat(pokemon, dadosCep);
    } catch (err: any) {
      console.error('Erro ao mapear habitat:', err);
      this.erroIA = err.message || 'Erro ao processar análise ecológica.';
    } finally {
      this.carregandoIA = false;
    }
  }
}