import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqQuestionsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private global: GlobalService) {
    this.global.showConsoleLog('constructor of FAQ Service', '');
  }

  handleError(err: HttpErrorResponse) {
    this.global.showConsoleLog('handleError ', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }


  faqQuestions(faqUrl): Observable<any> {
    return this.http.post<any>(faqUrl, this.httpOptions)
      .do((data) => {
        this.global.showConsoleLog('faqQuestions Data : ', data);
      })
      .catch(this.handleError);
  }
}
