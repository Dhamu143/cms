import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token')) {
      request = request.clone({ setHeaders: { 'Authorization': localStorage.getItem('token') || '' } });
      return next.handle(request).pipe(catchError((err, caught) => {
          return throwError(err)
      }));
  }
  return next.handle(request).pipe(catchError((err, caught) => {
      return throwError(err)
  }));

  }
}
