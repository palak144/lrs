import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerDashboardService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private _global: GlobalService) {
    this._global.showConsoleLog('constructor of ManagerDashboardService', '');
  }

  // tslint:disable-next-line: variable-name
  getManageboardDashboardData(_managerDashboardDataJSON) {
    const promise = new Promise((resolve, reject) => {
      this._http.post(this._global.apiBaseURL + 'managerView', _managerDashboardDataJSON, this.httpOptions)
        .toPromise()
        .then(
          res => {
            // tslint:disable-next-line: variable-name
            let _responseAPI;
            _responseAPI = res;
            // console.log("_responseAPI", _responseAPI);
            if (_responseAPI.ErrorCode == 0) {
              resolve(_responseAPI);
            } else {
              reject(_responseAPI);
            }
            this._global.hideProgressBar();
          },
          msg => {
            reject(msg);
            this._global.hideProgressBar();
          }
        );
    });
    return promise;
  }

  // tslint:disable-next-line: variable-name
  getEmployeeDetailsData(_employeeDetailsDataJson) {
    const promise = new Promise((resolve, reject) => {
      this._global.showProgressBar();
      this._http.post(this._global.apiBaseURL + 'managerViewEmployeeDetails', _employeeDetailsDataJson, this.httpOptions)
        .toPromise()
        .then(
          res => {
            // tslint:disable-next-line: variable-name
            let _employeeResponseAPI;
            _employeeResponseAPI = res;

            if (_employeeResponseAPI.ErrorCode == 0) {
              resolve(_employeeResponseAPI);
            } else {
              reject(_employeeResponseAPI);
            }

            this._global.hideProgressBar();
          },
          msg => {
            reject(msg);
            this._global.hideProgressBar();
          }
        );
    });
    return promise;
  }
}
