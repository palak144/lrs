import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveXService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private global: GlobalService) {
    this.global.showConsoleLog('constructor of LiveXService', '');
  }

  handleError(err: HttpErrorResponse) {
    this.global.showConsoleLog('handleError', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }

  calculateDuration(req): Observable<any> {
    return this._http.post<any>(this.global.apiBaseURL + 'calculateDuration', req, this.httpOptions)
      .do((data) => {
        this.global.showConsoleLog('Calculate Duration Data : ', data);
      })
      .catch(this.handleError);
  }

  appyLeave(form): Observable<any> {
    return this._http.post<any>(this.global.apiBaseURL + 'applyForLeavePOST', form)
      .do((data) => {
        this.global.showConsoleLog('submitFile Data : ', data);
      })
      .catch(this.handleError);
  }

  calculateLeaves(req): Observable<any> {
    return this._http.post<any>(this.global.apiBaseURL + 'leaveBalance', req, this.httpOptions)
      .do((data) => {
        this.global.showConsoleLog('Leave Balance Data : ', data);
      })
      .catch(this.handleError);
  }

  getcalenderconfigdates(req): Observable<any> {
    return this._http.post<any>(this.global.apiBaseURL + 'holidaysCalendar', req, this.httpOptions)
      .do((data) => {
        this.global.showConsoleLog('Calender Config Dates :', data);
      })
      .catch(this.handleError);
  }
}

