import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpService: HttpService) { }

  getTasks = (): Observable<any> => {
    return this.httpService.get(`/tasks`);
  }

  addTasks = (data: any): Observable<any> => {
    return this.httpService.post(`/tasks`, data);
  }

  updateTasks = (taskId: string, data: any): Observable<any> => {
    return this.httpService.put(`/tasks/${taskId}`, data);
  }

  deleteTasks = (taskId: string): Observable<any> => {
    return this.httpService.delete(`/tasks/${taskId}`);
  }

  getShops = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=shop&enabled=true`);
  }
  getUtilities = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=utility&enabled=true`);
  }
  getCharacters = (): Observable<any> => {
    return this.httpService.get(`/characters`);
  }
}
