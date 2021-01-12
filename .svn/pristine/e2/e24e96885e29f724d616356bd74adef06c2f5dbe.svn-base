import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { DatePipe } from '@angular/common';
import { CalendarModalOptions } from 'ion4-calendar';

@Component({
  selector: 'app-calendar-pop-up',
  templateUrl: './calendar-pop-up.page.html',
  styleUrls: ['./calendar-pop-up.page.scss'],
})
export class CalendarPopUpPage implements OnInit {

  calDataFromParent: any;
  historyDate: any;

  date: any;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  currDate: any;

  options: CalendarModalOptions = {
    // disableWeeks: [0, 6],
    from: 1, to: 0,
    pickMode: 'single',
    daysConfig: this.calDataFromParent,
    defaultDate: new Date()
  };

  // tslint:disable-next-line: max-line-length
  constructor(public modalController: ModalController, public navParams: NavParams, private global: GlobalService, public datepipe: DatePipe) {
    this.calDataFromParent = this.navParams.data.dataToPass;

    if ((this.calDataFromParent.from == 'startDateManagerDashboard' || this.calDataFromParent.from == 'endDateManagerDashboard')
      && this.calDataFromParent.daysConfig != undefined) {
      this.options.to = null;
      this.options.daysConfig = this.calDataFromParent.daysConfig;
    }

    this.options.defaultDate = this.datepipe.transform(this.calDataFromParent.selectedDate, 'dd-MMM-yyyy');

    // console.log('this.options.defaultDate', this.options.defaultDate);
    if (this.global.checkIfDataIsValid(this.calDataFromParent.from)) {
      // console.log('this.calDataFromParent.selectedDate', this.calDataFromParent.selectedDate);
      this.historyDate = this.calDataFromParent.selectedDate;
      // this.historyDate = this.getPreviouslySelectedFullDate(this.calDataFromParent.from);
    }
    this.global.showConsoleLog('this.global.getSelectedFullDate()', this.historyDate);
    if (this.global.checkIfDataIsValid(this.historyDate)) {
      let newTimeToBeSet;
      if (this.global.checkIfDataIsValid(this.historyDate.time)) {
        this.options.defaultDate = new Date(this.historyDate.time);
        this.date = new Date(this.historyDate.time);
        console.log('this.date', this.date);
      } else {
        // newTimeToBeSet = new Date(this.historyDate * 1000);
        // this.options.defaultDate = new Date(this.historyDate * 1000);
        // this.date = new Date(this.historyDate * 1000);
        this.date = new Date(this.historyDate);
      }
    }
    this.global.showConsoleLog('this.options' + this.options, 'this.date' + this.date);
  }

  ngOnInit() {
  }

  onDateSelect(event) {
    this.global.showConsoleLog('onDateSelect:', event);
    if (this.calDataFromParent.from == 'startDate') {
      this.global.setSelectedFullDate_StartDate({ from: 'startDate', selectedFullDate: event });
    } else if (this.calDataFromParent.from == 'LeaveBal') {
      this.global.setSelectedFullDate_LeaveBal({ from: 'LeaveBal', selectedFullDate: event });
    } else if (this.calDataFromParent.from == 'workStartDate') {
      this.global.setSelectedFullDate_WorkStartDate({ from: 'workStartDate', selectedFullDate: event });
    } else if (this.calDataFromParent.from == 'workEndDate') {
      this.global.setSelectedFullDate_WorkEndDate({ from: 'workEndDate', selectedFullDate: event });
    } else {
      this.global.setSelectedFullDate_EndDate({ from: 'endDate', selectedFullDate: event });
    }

    this.close(event);
  }

  getPreviouslySelectedFullDate(from) {
    let dateToBeReturned = '';
    switch (from) {
      case 'startDate':
        if (this.global.checkIfDataIsValid(this.global.getSelectedFullDate_StartDate())) {
          dateToBeReturned = this.global.getSelectedFullDate_StartDate().selectedFullDate;
        }
        break;
      case 'LeaveBal':
        if (this.global.checkIfDataIsValid(this.global.getSelectedFullDate_LeaveBal())) {
          dateToBeReturned = this.global.getSelectedFullDate_LeaveBal().selectedFullDate;
        }
        break;
      case 'endDate':
        if (this.global.checkIfDataIsValid(this.global.getSelectedFullDate_EndDate())) {
          dateToBeReturned = this.global.getSelectedFullDate_EndDate().selectedFullDate;
        }
        break;
      case 'workStartDate':
        if (this.global.checkIfDataIsValid(this.global.getSelectedFullDate_WorkStartDate())) {
          dateToBeReturned = this.global.getSelectedFullDate_WorkStartDate().selectedFullDate;
        }
        break;
      case 'workEndDate':
        if (this.global.checkIfDataIsValid(this.global.getSelectedFullDate_WorkEndDate())) {
          dateToBeReturned = this.global.getSelectedFullDate_WorkEndDate().selectedFullDate;
        }
        break;
    }
    return dateToBeReturned;
  }

  onMonthChange(event) {
    this.global.showConsoleLog('onMonthChange:', event);
  }

  onDateChange(value) {
    this.global.showConsoleLog('onDateChange:', value);
    //this.close();
  }

  close(event) {
    this.modalController.dismiss(event.time);
  }

  closeCalendarPopup() {
    this.modalController.dismiss();
  }

}
