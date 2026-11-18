import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ViaCepResponse } from '../servicesViaCep/viacep.service';
import { environment } from '../../../environments/environment';

export interface EcosystemAnalysis {
  compatibility_score: number;
  encounter_rate: string;
  micro_habitat: string;
  justification: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiEcosystemService {
  private http = inject(HttpClient);

  async analisarHabitat(pokemon: any, localidade: ViaCepResponse): Promise<EcosystemAnalysis> {
    const apiKey = environment.geminiApiKey;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    });

    const prompt = `
      Você é um biólogo especialista no universo Pokémon e na geografia do Brasil.
      Analise a viabilidade ecológica de encontrar o Pokémon abaixo na localidade brasileira informada.

      DADOS DO POKÉMON:
      - Nome: ${pokemon.name}
      - Tipos: ${pokemon.types.map((t: any) => t.type?.name || t).join(', ')}

      DADOS DA LOCALIDADE (ViaCEP):
      - Cidade: ${localidade.localidade}
      - Estado (UF): ${localidade.uf}
      - Bairro: ${localidade.bairro || 'Zona Urbana/Rural'}

      Responda EXCLUSIVAMENTE em formato JSON estrito (sem marcadores de código markdown):
      {
        "compatibility_score": 0.95,
        "encounter_rate": "Muito Comum",
        "micro_habitat": "Descrição do local",
        "justification": "Explicação ecológica curta"
      }
    `;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    try {
      const response: any = await firstValueFrom(this.http.post(url, body, { headers }));
      const responseText = response.candidates[0].content.parts[0].text;
      
      return JSON.parse(responseText) as EcosystemAnalysis;
    } catch (error: any) {
      console.error('❌ Erro no AiEcosystemService:', error);
      throw error;
    }
  }
}