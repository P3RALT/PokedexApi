import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavoritesService {
  private storageKey = 'pokedex_favorites';

  // Obtém a lista de IDs favoritos do localStorage
  getFavorites(): string[] {
    const favs = localStorage.getItem(this.storageKey);
    return favs ? JSON.parse(favs) : [];
  }

  // Verifica se um Pokémon é favorito
  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id.toString());
  }

  // Alterna o estado (adiciona ou remove dos favoritos)
  toggleFavorite(id: string): boolean {
    let favs = this.getFavorites();
    const strId = id.toString();

    if (favs.includes(strId)) {
      favs = favs.filter(favId => favId !== strId);
    } else {
      favs.push(strId);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    return favs.includes(strId);
  }
}