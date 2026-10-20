// Pokemon Detail é um componente Angular que exibe detalhes de um Pokémon específico.
// Ele utiliza o serviço PokemonService para buscar informações da API de Pokémon com base no ID fornecido na rota.

// Importa os módulos e serviços necessários do Angular.
import { Component, OnInit, inject } from '@angular/core';
// Importa o módulo CommonModule do Angular, que fornece diretivas e pipes comuns.
import { CommonModule } from '@angular/common';
// Importa o módulo ActivatedRoute do Angular, que permite acessar informações sobre a rota ativa.
import { ActivatedRoute, RouterLink } from '@angular/router';
// Importa o serviço PokemonService, que é responsável por interagir com a API de Pokémon.
import { PokemonService } from '../../services/pokemon';

// Define o componente Angular com o decorador @Component, especificando o seletor, os estilos e o template.
@Component({
  // Selector do componente, usado para referenciá-lo no HTML.
  selector: 'app-pokemon-detail',
  // Strandalone indica que o componente é independente e não depende de um módulo específico.
  standalone: true,
  // imports define os módulos que o componente utiliza, incluindo CommonModule e RouterLink para navegação.
  imports: [CommonModule, RouterLink],
  // TemplateUrl define o caminho para o arquivo HTML que contém o template do componente.
  templateUrl: './pokemon-detail.html',
  // StyleUrl define o caminho para o arquivo SCSS que contém os estilos do componente.
  styleUrl: './pokemon-detail.scss'
})

// A classe PokemonDetailComponent implementa a interface OnInit
export class PokemonDetailComponent implements OnInit {
  // Injeta o serviço ActivatedRoute para acessar informações sobre a rota ativa.
  private route = inject(ActivatedRoute);
  // Injeta o serviço PokemonService para buscar informações da API de Pokémon.
  private PokemonService = inject(PokemonService);

  // Define uma propriedade para armazenar os detalhes do Pokémon.
  pokemon: any = null; 

  // O método ngOnInit, o componente é inicializado.
  ngOnInit(): void {
    // Const captura o ID do Pokémon a partir dos parâmetros da rota.
    const id = this.route.snapshot.paramMap.get('id');
    // Se o ID estiver presente, chama o método getPokemon do serviço PokemonService para buscar os detalhes do Pokémon.
    if (id) {
      // Chama o método getPokemonDetail, passando o ID do Pokémon.
      this.PokemonService.getPokemonDetail(id).subscribe({
        // Se a chamada for bem-sucedida, armazena os dados do Pokémon na propriedade pokemon.
        next: (data) => this.pokemon = data,
        // Em caso de erro, exibe uma mensagem de erro no console.
        error: (err) => console.error('Erro ao buscar detalhes do Pokémon:', err)   
      });
    }
  } 
}
