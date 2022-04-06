import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loaderBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  get loader() {
    return this._loaderBehaviorSubject.asObservable();
  }

  setLoader(value: boolean): void {
    this._loaderBehaviorSubject.next(value);
  }
}
