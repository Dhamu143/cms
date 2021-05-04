import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpService: HttpService) { }

  getProducts = (): Observable<any> => {
    return this.httpService.get(`/products`);
  }

  addProducts = (data: any): Observable<any> => {
    return this.httpService.post(`/products`, data);
  }

  updateProducts = (productId: string, data: any): Observable<any> => {
    return this.httpService.put(`/products/${productId}`, data);
  }

  deleteProducts = (productId: string): Observable<any> => {
    return this.httpService.delete(`/products/${productId}`);
  }
}
