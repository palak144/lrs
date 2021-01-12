import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { FaqQuestionsService } from './faq-questions.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {


  // tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, public global: GlobalService, public http: HttpClient, public faqQuestionsService: FaqQuestionsService) {
    this.global.showConsoleLog('constructor of FAQ component', '');
    this.getFaqQuestions();
    this.global.setPageTitle('FAQ\'s');
  }

  faqsData: any;
  faqsArray: any[];

  ngOnInit() {
  }

  ionViewWillEnter() {

  }

  getFaqQuestions() {
    this.global.showConsoleLog('getFaqQuestions', '');
    this.global.showProgressBar();
    if (localStorage.userCountry == (this.global.usLocation || this.global.usLocationValue2)) {
      this.global.trackView('FAQPage', this.global.faqBaseURLUs);
      this.faqQuestionsService.faqQuestions(this.global.faqBaseURLUs)
        .subscribe(
          res => {
            this.faqQuestionsService = res;
            this.faqsArray = res;
            this.global.showConsoleLog('Faq Questions:', this.faqsArray);
            this.global.hideProgressBar();
          }
        );
    } else if (localStorage.userCountry == this.global.zenUkLocation) {
      this.global.trackView('FAQPage', this.global.faqBaseURLUk);
      this.faqQuestionsService.faqQuestions(this.global.faqBaseURLUk)
        .subscribe(
          res => {
            this.faqQuestionsService = res;
            this.faqsArray = res;
            this.global.showConsoleLog('Faq Questions:', this.faqsArray);
            this.global.hideProgressBar();
          }
        );
    } else if (localStorage.userCountry == this.global.zenLiveX) {
      this.global.trackView('FAQPage', this.global.faqBaseURLLiveX);
      this.faqQuestionsService.faqQuestions(this.global.faqBaseURLLiveX)
        .subscribe(
          res => {
            this.faqQuestionsService = res;
            this.faqsArray = res;
            this.global.showConsoleLog('Faq Questions:', this.faqsArray);
            this.global.hideProgressBar();
          }
        );
    } else {
      this.global.trackView('FAQPage', this.global.faqBaseURL);
      this.faqQuestionsService.faqQuestions(this.global.faqBaseURL)
        .subscribe(
          res => {
            this.faqQuestionsService = res;
            this.faqsArray = res;
            this.global.showConsoleLog('Faq Questions:', this.faqsArray);
            this.global.hideProgressBar();
          }
        );
    }
  }

  toggleCard(countrylistObj) {
    this.faqsArray.map((listItem) => {
      if (countrylistObj == listItem) {
        listItem.expanded = !listItem.expanded;
        /* Added by Ajinkya : 10-01-2020 */
        if (!listItem.expanded) {
          this.global.trackEvent('FAQ', 'queSeen', countrylistObj.id, 0);
        }
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
    this.global.showConsoleLog('prAboutUsObj data -------------------', countrylistObj);
  }
}
