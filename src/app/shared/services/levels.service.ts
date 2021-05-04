import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  constructor(private httpService: HttpService) { }

  getLevels = (): Observable<any> => {
    return this.httpService.get(`/levels`);
  }

  addLevels = (data: any): Observable<any> => {
    return this.httpService.post(`/levels`, data);
  }

  updateLevels = (levelId: string, data: any): Observable<any> => {
    return this.httpService.put(`/levels/${levelId}`, data);
  }

  deleteLevels = (levelId: string): Observable<any> => {
    return this.httpService.delete(`/levels/${levelId}`);
  }
}
