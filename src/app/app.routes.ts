// Route serve para definir as rotas da aplicação, permitindo a navegação entre componentes.
// @Angular/router é o módulo do Angular responsável pelo roteamento, permitindo a definição de rotas e a navegação.
import { Routes } from '@angular/router';
// Importa o componente PokemonListComponent, que será usado como destino
import { PokemonListComponent } from './components/pokemon-list/pokemon-list';
// Importa o componente PokemonDetailComponent, que será usado como destino
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail';

// Exporta as rotas da aplicação, definindo o caminho e o componente correspondente para cada rota.
export const routes: Routes = [
  // Rota raiz ('') que renderiza o componente PokemonListComponent, exibindo a lista de Pokémon.
  { path: '', component: PokemonListComponent },
  // Rota para detalhes de um Pokémon específico, usando o ID do Pokémon como parâmetro.
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  // Rota curinga ('**') que redireciona para a rota raiz caso nenhuma das rotas anteriores seja correspondida.
  { path: '**', redirectTo: '' }
];