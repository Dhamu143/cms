import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  set(key: string, value: any) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    window.localStorage[key] = value;
  }

  get(key: string) {
    return window.localStorage[key];
  }

  delete(key: string) {
    window.localStorage.removeItem(key);
  }


}
