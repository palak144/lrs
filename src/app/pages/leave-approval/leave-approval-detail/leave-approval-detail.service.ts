import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveApprovalDetailService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private _global: GlobalService) {
    this._global.showConsoleLog('constructor of LeaveApprovalDetailService Service', '');
  }

  handleError(err: HttpErrorResponse) {
    this._global.showConsoleLog('handleError ', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }


  // pendingLeavesApprovals(req): Observable<any> {
  //   return this._http.post<any>(this._global.apiBaseURL + 'listOfPendingApprovalLeaves', req, this.httpOptions)
  //     .do((data) => {
  //       this._global.showConsoleLog('LeaveSummery Data : ', data);
  //     })
  //     .catch(this.handleError);
  // }

  approveLeave(req): Observable<any> {
    return this._http.post<any>(this._global.apiBaseURL + 'approveLeave', req, this.httpOptions)
      .do((data) => {
        this._global.showConsoleLog('Approve Leave  : ', data);
      })
      .catch(this.handleError);
  }

  rejectLeave(req): Observable<any> {
    return this._http.post<any>(this._global.apiBaseURL + 'rejectLeave', req, this.httpOptions)
      .do((data) => {
        this._global.showConsoleLog('Reject Leave Data : ', data);
      })
      .catch(this.handleError);
  }

  approveLeaveCancellation(reqJson) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const promise = new Promise((resolve, reject) => {
      this._http.post(this._global.apiBaseURL + 'cancelLeave', reqJson, httpOptions)
        .toPromise()
        .then(
          res => {
            this._global.showConsoleLog('approveLeaveCancellation response', res);
            resolve(res);
          },
          error => {
            this._global.showConsoleLog('approveLeaveCancellation failure', error);
            reject(error);
          }
        );
    });

    return promise;
  }

  // api call to fetch leave info from notification
  getLeaveInfoFromNotification(req): Observable<any> {
    return this._http.post<any>(this._global.apiBaseURL + 'getLeaveDetailsPushNotification', req, this.httpOptions)
      .do((data) => {
        this._global.showConsoleLog('getLeaveDetailsPushNotification data : ', data);
      }).catch(this.handleError);
  }
}
