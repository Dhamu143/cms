import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialsService {

  constructor(private httpService: HttpService) { }

  getTutorials = (): Observable<any> => {
    return this.httpService.get(`/tutorials`);
  }

  addTutorials = (data: any): Observable<any> => {
    return this.httpService.post(`/tutorials`, data);
  }

  updateTutorials = (tutorialId: string, data: any): Observable<any> => {
    return this.httpService.put(`/tutorials/${tutorialId}`, data);
  }

  deleteTutorials = (tutorialId: string): Observable<any> => {
    return this.httpService.delete(`/tutorials/${tutorialId}`);
  }
}
