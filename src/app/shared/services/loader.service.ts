import { Injectable } from '@angular/core';
import { LoaderState } from '../models/loader.model';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {

  constructor() { }

  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();

  startLoading() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }

  stopLoading() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
}
