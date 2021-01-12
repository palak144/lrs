import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class HomeService {
  flexiLeave: any;
  privilegeLeave: any;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      // tslint:disable-next-line: variable-name
      constructor(private _http: HttpClient, private _global: GlobalService) {
        this._global.showConsoleLog('constructor of LoginService', '');
      }

      handleError(err: HttpErrorResponse) {
        this._global.showConsoleLog('handleError ', err.message);
        // tslint:disable-next-line: deprecation
        return Observable.throw(err.message);
      }

      calculateDuration(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'calculateDuration', req, this.httpOptions)
          .do((data) => {
            this._global.showConsoleLog('Calculate Duration Data : ', data);
          })
          .catch(this.handleError);
      }

      calculateLeaves(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'leaveBalance', req, this.httpOptions)
          .do((data) => {
            this._global.showConsoleLog('Leave Balance Data : ', data);
          })
          .catch(this.handleError);
      }

      appyLeave(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'applyForLeave', req, this.httpOptions)
          .do((data) => {
            this._global.showConsoleLog('Calculate Duration Data : ', data);
          })
          .catch(this.handleError);
      }

      submitFile(form): Observable<any> {
        
        return this._http.post<any>(this._global.apiBaseURL + 'applyForLeavePOST', form)
          .do((data) => {
            this._global.showConsoleLog('submitFile Data : ', data);
          })
          .catch(this.handleError);
      }

      isPasswordChangedCheck(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'isPasswordChanged', req , this.httpOptions)
        .do((data) => {
            this._global.showConsoleLog('User Authentication Data :', data);
        })
        .catch(this.handleError);
    }

      registerDeviceToken(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'registerDeviceToken' , req , this.httpOptions)
        .do((data) => {
          this._global.showConsoleLog('User Device Token :', data);
        })
        .catch(this.handleError);
      }

      getcalenderconfigdates(req): Observable<any> {
        return this._http.post<any>(this._global.apiBaseURL + 'holidaysCalendar' , req , this.httpOptions)
        .do((data) => {
          this._global.showConsoleLog('Calender Config Dates :', data);
        })
        .catch(this.handleError);
      }

}
