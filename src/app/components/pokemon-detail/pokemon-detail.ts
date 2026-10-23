// Importa os módulos e serviços necessários do Angular.
// Importa o módulo CommonModule do Angular, que fornece diretivas e pipes comuns.
// Importa o módulo ActivatedRoute do Angular, que permite acessar informações sobre a rota ativa.
// Importa o serviço PokemonService, que é responsável por interagir com a API de Pokémon.

import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon';

// Define o componente Angular com o decorador @Component, especificando o seletor, os estilos e o template.
  // - Selector do componente, usado para referenciá-lo no HTML.
  // - Strandalone indica que o componente é independente e não depende de um módulo específico.
  // - imports define os módulos que o componente utiliza, incluindo CommonModule e RouterLink para navegação.
  // - TemplateUrl define o caminho para o arquivo HTML que contém o template do componente.
  // - StyleUrl define o caminho para o arquivo SCSS que contém os estilos do componente.

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss'
})

export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private PokemonService = inject(PokemonService);
  private cdr = inject(ChangeDetectorRef);

  // Define uma propriedade para armazenar os detalhes do Pokémon.
  pokemon: any = null; 

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Chama o método getPokemonDetail, passando o ID do Pokémon.
      this.PokemonService.getPokemonDetail(id).subscribe({
        next: (data) => {
          console.log('Detalhes Recebidos', data);
          this.pokemon = data;
          this.cdr.detectChanges(); 
        },
        // Em caso de erro, exibe uma mensagem de erro no console.
        error: (err) => console.error('Erro ao buscar detalhes do Pokémon:', err)   
      });
    }
  }
}

