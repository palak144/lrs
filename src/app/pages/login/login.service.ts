import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do'; /*it is an operator*/
import 'rxjs/add/operator/catch'; /*it is an operator*/
import 'rxjs/add/operator/catch'; /*it is an operator*/
import { GlobalService } from 'src/app/services/global.service';

@Injectable()
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private global: GlobalService) {
    this.global.showConsoleLog('constructor of LoginService', '');
  }


  handleError(err: HttpErrorResponse) {
    this.global.showConsoleLog('handleError ', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }

  signIn(req): Observable<any> {
    return this._http.post<any>(this.global.apiBaseURL + 'login', req, this.httpOptions)
      .do((data) => {
        this.global.showConsoleLog('Sign In Data : ', data);
      })
      .catch(this.handleError);
  }
}
