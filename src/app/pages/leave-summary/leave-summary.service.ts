import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveSummaryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private _global: GlobalService) {
    this._global.showConsoleLog('constructor of Leave Summary Service', '');
  }

  handleError(err: HttpErrorResponse) {
    this._global.showConsoleLog('handleError ', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }


  leaveSummery(req): Observable<any> {
    return this._http.post<any>(this._global.apiBaseURL + 'getLeaveHistory', req, this.httpOptions)
      .do((data) => {
        this._global.showConsoleLog('LeaveSummery Data : ', data);
      })
      .catch(this.handleError);
  }

  canceLeave(req): Observable<any> {

    return this._http.post<any>(this._global.apiBaseURL + 'cancelLeave', req, this.httpOptions)
      .do((data) => {
        this._global.showConsoleLog('CancelLeave Data : ', data);
      })
      .catch(this.handleError);
  }


  getPager(totalItems: number, currentPage: number = 1, pageSize: number) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        //   endPage = 10;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  }
}
