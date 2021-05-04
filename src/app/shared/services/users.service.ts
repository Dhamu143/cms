import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpService: HttpService) {}

  getUsers = (): Observable<any> => {
    return this.httpService.get(`/adminuser/getAllUser`);
  };

  addUsers = (data: any): Observable<any> => {
    return this.httpService.post(`/adminuser/register`, data);
  };

  updateUsers = (userId: string, data: any): Observable<any> => {
    return this.httpService.put(`/adminuser/${userId}`, data);
  };

  deleteUsers = (userId: string): Observable<any> => {
    return this.httpService.delete(`/adminuser/deleteUser?_id=${userId}`);
  };

  defaultProfile = (): Observable<any> => {
    return this.httpService.get(`/default-profile`);
  };

  updateDefaultProfile = (data: any): Observable<any> => {
    return this.httpService.put(`/default-profile/`, data);
  };

  getShops = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=shop&enabled=true`);
  };

  getDecorative = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=decorative&enabled=true`);
  };

  getUtilities = (): Observable<any> => {
    return this.httpService.get(`/buildings?type=utility&enabled=true`);
  };
}
