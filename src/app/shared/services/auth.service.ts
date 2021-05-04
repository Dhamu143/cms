import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private storageService: StorageService
  ) {}

  adminLogin = (data: any): Observable<any> => {
    return this.httpService.post(`/adminuser/login`, data);
  };

  getForgotPassword = (emailId): Observable<any> => {
    return this.httpService.get(`/adminuser/forgotPassword?email=${emailId}`);
  };

  setNewPassword = (pwd, token): Observable<any> => {
    return this.httpService.get(
      `/adminuser/setNewPassword?password=${pwd}&resetToken=${token}`
    );
  };

  setUser(token) {
    this.storageService.set('token', token);
  }

  deleteUser() {
    this.storageService.delete('token');
  }
}
