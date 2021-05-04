import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GameUsersService {
  constructor(private httpService: HttpService) {}

  getGameUsers = (data: any): Observable<any> => {
    return this.httpService.get(
      `/getUsers?deviceFilter=${data.deviceFilter}&userFilter=${data.userFilter}&searchOn=${data.searchOn}&search=${data.search}`
    );
  };

  // addGameUsers = (data: any): Observable<any> => {
  //   return this.httpService.post(`/adminuser/register`, data);
  // }

  updateGameUsers = (userId: string, data: any): Observable<any> => {
    return this.httpService.put(`/updateUser/${userId}`, data);
  };

  deleteGameUsers = (userId: string): Observable<any> => {
    return this.httpService.delete(`/deleteUserProfile?_id=${userId}`);
  };
}
