import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingsService {
  constructor(private httpService: HttpService) {}

  getBuildings = (): Observable<any> => {
    return this.httpService.get(`/buildings`);
  };

  addBuildings = (data: any): Observable<any> => {
    const formData = new FormData();
    var keys = Object.keys(data);

    keys.forEach(function (key, index) {
      if (typeof data[key] == 'object' && key == 'imageInfo') {
        var objectKeys = Object.keys(data[key]);
        objectKeys.forEach(function (objectKey, objectKeyIndex) {
          formData.append(key + '.' + objectKey, data[key][objectKey]);
        });
      } else if (typeof data[key] == 'object' && key == 'upgradeInfo') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key != 'image') {
        formData.append(key, data[key]);
      }
    });
    formData.append('image', data['image']);
    return this.httpService.post(`/buildings`, formData);
  };

  updateBuildings = (buildingId: string, data: any): Observable<any> => {
    return this.httpService.put(`/buildings/${buildingId}`, data);
  };

  deleteBuildings = (buildingId: string): Observable<any> => {
    return this.httpService.delete(`/buildings/${buildingId}`);
  };
}
