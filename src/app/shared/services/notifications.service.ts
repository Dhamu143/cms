import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private httpService: HttpService) { }

  getNotifications = (): Observable<any> => {
    return this.httpService.get(`/notifications`);
  }

  addNotifications = (data: any): Observable<any> => {
    return this.httpService.post(`/notifications`, data);
  }

  updateNotifications = (notificationId: string, data: any): Observable<any> => {
    return this.httpService.put(`/notifications/${notificationId}`, data);
  }

  deleteNotifications = (notificationId: string): Observable<any> => {
    return this.httpService.delete(`/notifications/${notificationId}`);
  }
}
