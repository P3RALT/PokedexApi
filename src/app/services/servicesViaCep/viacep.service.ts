import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);
  private baseUrl = 'https://viacep.com.br/ws';

  consultarCep(cep: string): Observable<ViaCepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return throwError(() => new Error('Formato de CEP inválido. Deve conter 8 dígitos.'));
    }

    return this.http.get<ViaCepResponse>(`${this.baseUrl}/${cepLimpo}/json/`).pipe(
      map((res) => {
        if (res.erro) {
          throw new Error('CEP não encontrado na base do ViaCEP.');
        }
        return res;
      }),
      catchError((error) => {
        console.error('❌ Erro no ViaCepService:', error);
        return throwError(() => error);
      })
    );
  }
}