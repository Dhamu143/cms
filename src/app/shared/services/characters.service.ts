import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  constructor(private httpService: HttpService) {}

  getCharacters = (): Observable<any> => {
    return this.httpService.get(`/characters`);
  };

  addCharacters = (data: any): Observable<any> => {
    var formData = new FormData();
    var keys = Object.keys(data);
    keys.forEach(function (key, index) {
      if (
        typeof data[key] == 'object' &&
        (key == 'dialogues' || key == 'excludedUtilities')
      ) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key != 'image') {
        formData.append(key, data[key]);
      }
    });
    formData.append('image', data['image']);
    return this.httpService.post(`/characters`, formData);
  };

  updateCharacters = (characterId: string, data: any): Observable<any> => {
    return this.httpService.put(`/characters/${characterId}`, data);
  };

  deleteCharacters = (characterId: string): Observable<any> => {
    return this.httpService.delete(`/characters/${characterId}`);
  };

  getUtilities = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=utility&enabled=true`);
  };
}
