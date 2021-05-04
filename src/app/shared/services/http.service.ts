import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
const API_URL: string = environment.apiurl;

@Injectable()
export class HttpService {
  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {}

  post(url: string, body?: any, headers?: HttpHeaders): Observable<any> {
    return this.http
      .post(API_URL + url, body, { headers: headers })
      .map((resp: any) => this.handleSuccess(resp))
      .catch((err) => this.handleErrors(err));
  }

  get(
    url: string,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<any> {
    return this.http
      .get(API_URL + url, { headers: headers, params })
      .map((resp: any) => this.handleSuccess(resp))
      .catch((err) => this.handleErrors(err));
  }

  put(
    url: string,
    body?: object,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<any> {
    return this.http
      .put(API_URL + url, body, { headers: headers, params })
      .map((resp: any) => this.handleSuccess(resp))
      .catch((err) => this.handleErrors(err));
  }

  delete(url: string, body?: object): Observable<any> {
    return this.http
      .delete(API_URL + url)
      .map((resp: any) => this.handleSuccess(resp))
      .catch((err) => this.handleErrors(err));
  }

  private handleSuccess(resp: any) {
    if (!resp.status) {
      // this.notification.create(
      //   'error',
      //   'Error',
      //   'errorMessage'
      // );
    }
    return resp;
  }

  private handleErrors(err: Response): any {
    switch (err.status) {
      case 400:
        break;
      case 401:
        // Token Expired OR Unauthorized Access
        break;
      case 403:
        // Forbidden
        break;
      case 404:
        // Resource Not Found
        break;
      case 422:
        // Resource Not Found
        break;
      case 429:
        // Too Many Requests
        break;
      case 440:
        // this.router.navigate(['/logout']);
        break;
      case 500:
        // Internal Server Error
        if (
          err &&
          err['error'] &&
          err['error']['meta'] &&
          err['error']['meta']['errorMessage']
        )
          this.notification.create(
            'error',
            'Error',
            err['error']['meta']['errorMessage']
          );
        break;
      default:
        break;
    }

    // return Observable.of(err['error']);
  }
}
