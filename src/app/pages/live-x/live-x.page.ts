import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CalendarComponentOptions } from 'ion4-calendar';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { LiveXService } from './live-x.service';
import * as moment from 'moment';
import { LoginPage } from '../login/login.page';
import { CalendarPopUpPage } from 'src/app/controls/calendar-pop-up/calendar-pop-up.page';

@Component({
  selector: 'app-live-x',
  templateUrl: './live-x.page.html',
  styleUrls: ['./live-x.page.scss'],
})
export class LiveXPage implements OnInit {

  currDate: any;
  leaveInfo: any;
  startDate: string;
  date: string;
  type: 'string';
  isEditable = false;
  annualLeaveBal: any;

  managerInfo = {
    managerId: '',
    managerName: '',
    managerMailID: ''
  };

  twoUpManagerInfo = {
    manager2UpID: '',
    manager2UpName: '',
    manager2UpMail: ''
  }; /*Added by Bhushan 13-03-2019*/

  // tslint:disable-next-line: variable-name
  historyDate_startDate: any;
  tempDateFromHolidayList;
  flagsForButtonsVisibility: any;
  editleaveInfoObject: any;
  // tslint:disable-next-line: variable-name
  historyDate_LeaveBal: any;
  monthChangeDate: any;


  options: CalendarComponentOptions;
  leaveOnlyCancellable = false;
  leaveCancellableEditable = false;
  leaveOnlyEditable = false;
  leaveObjectFromSummary = false;
  leaveTypeInCurrentUse: any;
  fileToUpload: File = null;
  configArray: any;
  calendarCurrentMonth: any;
  dateInputForHolidayList: any;
  currDateToDisplay: string;
  isEdgeBrowser: any;
  isFirefoxBrowser: any;
  monthData: any;
  newMonthDate: any;
  homeMessage: any;
  // flag = true;


  // tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public datepipe: DatePipe, public global: GlobalService, public livexservice: LiveXService, public modalController: ModalController, private changeRef: ChangeDetectorRef, public zone: NgZone) {
    this.resetForm();
    this.global.setNavData('');
    this.getHomePageNoticeMessage();
  }

  resetForm() {
    this.isEdgeBrowser = /Edge\/\d./i.test(navigator.userAgent);
    this.isFirefoxBrowser = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.flagsForButtonsVisibility = 'clearPreview';

    this.leaveInfo = {
      startDate: '',
      endDate: '',
      leaveType: '',
      employee_Comments: '',
      absence_days: '',
      idToEditLeave: '',
      editLeaveRequest: '',
      isFutureApproved: '',
      attachedFileLink: '',
      attachment_file_name: '',
      edgeFormatDate: ''
    };

    this.global.setPageTitle('Leave Management System');

    this.currDate = moment(new Date(), 'DD-MMM-YYYY');
    this.monthChangeDate = moment(new Date(), 'DD-MMM-YYYY');
    this.dateInputForHolidayList = moment(new Date(), 'DD-MMM-YYYY');


    this.isEditable = true;
    this.date = this.currDate;
    this.currDateToDisplay = this.datepipe.transform(this.date, 'd MMM');

    // this.editleaveInfoObject = navParams.get('navParamsFromPreviousPage');
    this.editleaveInfoObject = this.global.getNavData();
    this.initializeData('');
    this.historyDate_LeaveBal = '';
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.resetForm();
    this.editleaveInfoObject = this.global.getNavData();
    this.initializeData(this.editleaveInfoObject);
    this.leaveBalance();
    this.getCalenderConfigDates(this.currDate);
    this.global.setNavData(null);
  }

  openFile(someURL) {
    window.open(someURL);
  }

  getPreview() {

    if ((this.validateLeave() == true) && (!this.leaveObjectFromSummary)) {
      if (this.leaveInfo.leaveType == 'Sick Leave (LiveEx)') {
        if (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'Since its sick leave(livex), attachment of certificate is necessary.');
        }
      } else {
        this.validLeaveContinue();
      }
    } else if ((this.validateLeave() == true) && (this.leaveObjectFromSummary == true)) {
      if (this.leaveInfo.leaveType == 'Sick Leave (LiveEx)') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'Since its sick leave(livex), attachment of certificate is necessary.');
        }
      } else {
        this.validLeaveContinue();
      }
    }
  }

  validLeaveContinue() {
    this.isEditable = false;
    if (this.flagsForButtonsVisibility == 'deletePreview') {
      this.flagsForButtonsVisibility = 'editApply';
    } else {
      this.flagsForButtonsVisibility = 'cancelApply';
    }
  }

  cancel() {
    this.isEditable = true;
    this.flagsForButtonsVisibility = 'clearPreview';
  }

  editLeave() {
    this.isEditable = true;
    this.flagsForButtonsVisibility = 'deletePreview';
  }

  configureCalendar() {
    // tslint:disable-next-line: prefer-for-of
    for (let v = 0; v < this.configArray.length; v++) {
      this.global.showConsoleLog('Dates:', this.configArray[v]);
      this.configArray[v].date = new Date(this.configArray[v].date);
    }

    const date = new Date(this.monthChangeDate), y = date.getFullYear(), m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    this.global.showConsoleLog('FirstDayyyyy:', firstDay);
    this.global.showConsoleLog('LastDayyyyy:', lastDay);

    this.options = {
      disableWeeks: [0, 6],
      pickMode: 'single',
      from: firstDay, to: lastDay,
      showToggleButtons: true,
      showMonthPicker: true,
      daysConfig: this.configArray
    };

    // tslint:disable-next-line: only-arrow-functions
    window.setTimeout(function () {
      const arr: HTMLCollection = document.getElementsByClassName('back disable-hover button button-clear');

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    }, 100);

    // tslint:disable-next-line: only-arrow-functions
    window.setTimeout(function () {
      const arr: HTMLCollection = document.getElementsByClassName('back md button button-clear ion-activatable ion-focusable hydrated');

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    }, 100);

    // tslint:disable-next-line: only-arrow-functions
    window.setTimeout(function () {
      // tslint:disable-next-line: max-line-length
      const arr: HTMLCollection = document.getElementsByClassName('back ios button button-clear button-disabled ion-activatable ion-focusable hydrated');

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        arr[i].removeAttribute('disabled');
      }
    }, 100);

    // ;
    if (this.isEdgeBrowser || this.isFirefoxBrowser) {
      this.configMonthStartAndEndDates(firstDay.toString().split(' ')[2], lastDay.toString().split(' ')[2]);
    }
  }

  configMonthStartAndEndDates(firstDay: string, lastDay: string) {
    const startingDays = [];
    const endingDays = [];
    const monthDays = [];
    let leaveValues = [];
    const applyStyle = [];

    // for month start dates
    for (let t = 0; t < document.getElementsByClassName('days-btn').length; t++) {
      let dayValue = document.getElementsByClassName('days-btn')[t].firstChild.textContent;

      if (dayValue.length === 1) {
        dayValue = '0' + dayValue;
      }

      if (dayValue == firstDay) {
        break;
      }

      startingDays.push(t);
    }

    // for month end dates
    for (let t = document.getElementsByClassName('days-btn').length - 1; t > 0; t--) {
      let dayValue = document.getElementsByClassName('days-btn')[t].firstChild.textContent;

      if (dayValue.length == 1) {
        dayValue = '0' + dayValue;
      }

      if (dayValue == lastDay) {
        break;
      }
      endingDays.push(t);
    }

    for (let n = startingDays.length; n < document.getElementsByClassName('days-btn').length; n++) {
      let dayValue = document.getElementsByClassName('days-btn')[n].firstChild.textContent;

      if (dayValue.length == 1) {
        dayValue = '0' + dayValue;
      }

      if (dayValue == lastDay) {
        monthDays.push(n++);
        break;
      }

      monthDays.push(n);
    }

    for (let i = 0; i < this.configArray.length; i++) {
      const leaves = this.calculateLeaveDates(i);

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < leaves.length; j++) {
        leaveValues.push(leaves[j]);
      }
    }

    // tslint:disable-next-line: only-arrow-functions
    leaveValues = leaveValues.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });

    // tslint:disable-next-line: prefer-for-of
    for (let r = 0; r < monthDays.length; r++) {
      document.getElementsByClassName('days-btn')[monthDays[r]].className = 'days-btn';
    }

    // tslint:disable-next-line: prefer-for-of
    for (let n = 0; n < monthDays.length; n++) {
      // tslint:disable-next-line: prefer-for-of
      for (let y = 0; y < leaveValues.length; y++) {
        if (document.getElementsByClassName('days-btn')[monthDays[n]].firstChild.textContent == leaveValues[y]) {
          applyStyle.push(monthDays[n]);
        }
      }
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.options.daysConfig.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < applyStyle.length; j++) {
        let day = document.getElementsByClassName('days-btn')[applyStyle[j]].firstChild.textContent;

        if (day.length == 1) {
          day = '0' + day;
        }

        if (day == this.configArray[i].EdgeFormatDate.split('-')[0]) {
          switch (this.options.daysConfig[i].cssClass) {
            case 'Swipe_Miss': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Swipe_Miss marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'Flexi_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Flexi_Leave marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'Privilege_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Privilege_Leave marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'Sick_Leave_LiveEx': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Sick_Leave_LiveEx marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'Annual_Leave_LiveEx': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Annual_Leave_LiveEx marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'Optional_Holidays': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Optional_Holidays marked';
              document.getElementsByClassName('days-btn')[applyStyle[j]].setAttribute('style', 'pointer-events: none;');
              break;
            }
            case 'PendingForApproval': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn PendingForApproval marked';
              break;
            }
          }
        }
      }
    }

    // tslint:disable-next-line: prefer-for-of
    for (let l = 0; l < startingDays.length; l++) {
      document.getElementsByClassName('days-btn')[startingDays[l]].className = 'days-btn last-month-day';
      document.getElementsByClassName('days-btn')[startingDays[l]].setAttribute('disabled', '');
    }

    // tslint:disable-next-line: prefer-for-of
    for (let l = 0; l < endingDays.length; l++) {
      document.getElementsByClassName('days-btn')[endingDays[l]].className = 'days-btn next-month-day';
      document.getElementsByClassName('days-btn')[endingDays[l]].setAttribute('disabled', '');
    }

    window.setTimeout(() => {
      // tslint:disable-next-line: prefer-for-of
      for (let t = 0; t < document.getElementsByClassName('days-btn').length; t++) {
        if (document.getElementsByClassName('days-btn')[t].hasAttribute('disabled')) {
          document.getElementsByClassName('days-btn')[t].className = 'days-btn next-month-day';
        }
      }
    }, 100);
  }

  // Calculate leave dates
  private calculateLeaveDates(i: number) {
    const startDate = this.configArray[i].START_DATE.split('-')[0];
    const endDate = this.configArray[i].END_DATE.split('-')[0];
    const leaveDates = [];
    let value = parseInt(startDate, 10);
    leaveDates.push(value);

    while (value != endDate) {
      value++;

      if (value.toString().length == 1) {
        value = parseInt('0' + value.toString(), 10);
      }

      leaveDates.push(value);
    }

    return leaveDates;
  }

  monthChange(changeValue) {
    this.global.showConsoleLog('New Month', changeValue);
    this.newMonthDate = changeValue.newMonth.string;
    this.monthChangeDate = this.newMonthDate;
    this.dateInputForHolidayList = changeValue.newMonth.string;
    this.global.showConsoleLog('New Month Date Formatted', this.newMonthDate);
    this.configureCalendar();
    this.getCalenderConfigDates(this.newMonthDate);
  }

  async clearDialogue(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.global.ALART_TITLE,
      message: 'Are you sure you want to clear form ?',
      backdropDismiss: true,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          this.global.showConsoleLog('Clear Leave Form Dialog ', 'Clear');
          this.clearLeaveForm();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.global.showConsoleLog('logoutDialog ', 'Cancel');
        }
      }], cssClass: 'alertCustomCss'
    });
    await alert.present();
  }

  openUploader(event: any) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.click();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  getCalenderConfigDates(cDate) {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        checkBalanceDate: cDate,
        userLocation: localStorage.userCountry
      };

      this.global.showConsoleLog('getCalenderConfigDates Request', req);
      if (req) {
        this.global.showProgressBar();
        this.livexservice.getcalenderconfigdates(req)
          .subscribe(
            configDatesData => {
              this.successCallbackConfigDates(configDatesData);
              this.monthData = configDatesData;
              this.global.hideProgressBar();
              this.global.showConsoleLog('Config Dates', configDatesData);
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successCallbackConfigDates(dataFromApi) {
    this.global.showConsoleLog('Config Dates API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog('Success:', dataFromApi.ErrorMessage);
      this.configArray = dataFromApi.daysConfig;
      this.calendarCurrentMonth = dataFromApi.currentMonth;

      this.getCalConfigData();
      this.global.showConsoleLog('Get Config Array 1', this.configArray);
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  getCalConfigData() {
    this.configureCalendar();
  }

  getHomePageNoticeMessage() {
    this.global.getHomePageMessage()
      .subscribe(
        res => {
          this.homeMessage = res.LiveX;
          this.global.showConsoleLog('homeMessage', this.homeMessage.LiveX);
        }
      );
  }

  initializeData(data) {

    this.global.showConsoleLog('initializeData : data', data);
    if (this.global.checkIfDataIsValid(data)) {
      this.leaveObjectFromSummary = true;

      this.leaveInfo.startDate = data.START_DATE;
      this.leaveInfo.endDate = data.END_DATE;
      this.leaveInfo.absence_days = data.DURATION;
      this.leaveInfo.employee_Comments = data.employee_leave_comments;
      this.leaveInfo.leaveType = data.LEAVE_TYPE;
      this.leaveInfo.idToEditLeave = data.id;
      this.leaveInfo.isFutureApproved = data.isFutureApprovedLeave;
      this.leaveInfo.attachedFileLink = data.attachment_file_name;

      if (this.global.checkIfDataIsValid(data.attachment_file_name)) {
        const index = data.attachment_file_name.indexOf('s/');
        this.leaveInfo.attachment_file_name = data.attachment_file_name.substring(index + 2);
      }

      if (data.canBeEditedByUser == true && data.canBeCancelledByUser == false) {
        this.isEditable = true;
        this.leaveOnlyEditable = true;
      } else if (data.canBeCancelledByUser == true && data.canBeEditedByUser == false) {
        this.isEditable = false;
        this.leaveOnlyCancellable = true;
      } else if (data.canBeCancelledByUser == true && data.canBeEditedByUser == true) {
        this.isEditable = true;
        this.leaveCancellableEditable = true;
      }

      this.flagsForButtonsVisibility = this.getFlagValueForButtonsVisibility(data.canBeEditedByUser, data.canBeCancelledByUser);
      if (this.leaveTypeInCurrentUse == data.LEAVE_TYPE) {
        this.global.showConsoleLog('leaveInfo', this.leaveInfo);
        this.global.showConsoleLog('flagsForButtonsVisibility', this.flagsForButtonsVisibility);
        if (this.global.checkIfDataIsValid(this.leaveTypeInCurrentUse) && this.global.checkIfDataIsValid(data.LEAVE_TYPE)) {
          this.calculateDuration('');
        }
      }
    }

    if (this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.leaveObjectFromSummary = true;

      // tslint:disable-next-line: variable-name
      let startDate_ExpectedFormat, endDate_ExpectedFormat;
      startDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.startDateTimeStamp * 1000, 'dd-MMM-yyyy');
      endDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.endDateTimeStamp * 1000, 'dd-MMM-yyyy');
      this.editleaveInfoObject.START_DATE = startDate_ExpectedFormat;
      this.editleaveInfoObject.END_DATE = endDate_ExpectedFormat;
      this.global.showConsoleLog('this.editleaveInfoObject', this.editleaveInfoObject);
      this.leaveInfo.startDate = this.editleaveInfoObject.START_DATE;
      this.leaveInfo.endDate = this.editleaveInfoObject.END_DATE;
      this.leaveInfo.absence_days = this.editleaveInfoObject.DURATION;

      if (this.editleaveInfoObject.employee_Comments != null || this.editleaveInfoObject.employee_Comments != undefined) {
        this.leaveInfo.employee_Comments = this.editleaveInfoObject.employee_Comments.employee_leave_comments;
      } else {
        this.leaveInfo.employee_Comments = '';
      }

      this.leaveInfo.leaveType = this.editleaveInfoObject.LEAVE_TYPE;
      this.leaveInfo.isFutureApproved = this.editleaveInfoObject.isFutureApprovedLeave;
      this.leaveInfo.idToEditLeave = this.editleaveInfoObject.id;
      this.leaveInfo.editLeaveRequest = true;
      this.leaveInfo.attachedFileLink = this.editleaveInfoObject.attachment_file_name;

      if (this.global.checkIfDataIsValid(this.editleaveInfoObject.attachment_file_name)) {
        const index = this.editleaveInfoObject.attachment_file_name.indexOf('s/');
        this.leaveInfo.attachment_file_name = this.editleaveInfoObject.attachment_file_name.substring(index + 2);
      }

      if (this.editleaveInfoObject.canBeEditedByUser == true && this.editleaveInfoObject.canBeCancelledByUser == false) {
        this.isEditable = true;
        this.leaveOnlyEditable = true;
      } else if (this.editleaveInfoObject.canBeCancelledByUser == true && this.editleaveInfoObject.canBeEditedByUser == false) {
        this.isEditable = false;
        this.leaveOnlyCancellable = true;
      } else if (this.editleaveInfoObject.canBeCancelledByUser == true && this.editleaveInfoObject.canBeEditedByUser == true) {
        this.isEditable = true;
        this.leaveCancellableEditable = true;
      } else if (this.editleaveInfoObject.canBeCancelledByUser == false && this.editleaveInfoObject.canBeEditedByUser == false) {
        this.isEditable = false;
      }

      this.flagsForButtonsVisibility = this.getFlagValueForButtonsVisibility(this.editleaveInfoObject.canBeEditedByUser,
        this.editleaveInfoObject.canBeCancelledByUser);
    }
  }

  getFlagValueForButtonsVisibility(canBeEditedByUser, canBeCancelledByUser) {
    if (canBeEditedByUser == true && canBeCancelledByUser == true) {
      return 'deletePreview';
    } else if (canBeEditedByUser == true && canBeCancelledByUser == false) {
      return '';
    } else if (canBeEditedByUser == false && canBeCancelledByUser == true) {
      return 'deleteLeave';
    } else if (canBeEditedByUser == false && canBeCancelledByUser == false) {
      return '';
    }
  }

  // Check Selected Leave Type
  selectedLeaveType(leaveType) {
    this.leaveTypeInCurrentUse = this.leaveInfo.leaveType;
    delete this.fileToUpload;

    if (this.global.checkIfDataIsValid(leaveType) &&
      this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
      this.calculateDuration('');
    }
  }

  leaveBalance() {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        userLocation: localStorage.userCountry,
        checkBalanceDate: this.currDate
      };
      if (req) {
        this.global.showConsoleLog('req', JSON.stringify(req));
        this.livexservice.calculateLeaves(req)
          .subscribe(
            calculateserviceData => {
              this.successCallbackLeaveBalance(calculateserviceData);
            },
            (error) => {
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successCallbackLeaveBalance(dataFromApi) {
    this.global.showConsoleLog('Verify API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {

      this.annualLeaveBal = dataFromApi.AnnualLeave;
      this.managerInfo.managerId = dataFromApi.managerID;
      localStorage.managerID = this.managerInfo.managerId;
      this.managerInfo.managerName = dataFromApi.managerName;
      this.managerInfo.managerMailID = dataFromApi.managerMail;

      this.twoUpManagerInfo.manager2UpID = dataFromApi.manager2UpID;
      localStorage.manager2UpID = dataFromApi.manager2UpID;
      this.twoUpManagerInfo.manager2UpName = dataFromApi.manager2UpName;
      this.twoUpManagerInfo.manager2UpMail = dataFromApi.manager2UpMail;

      this.global.encryptMessage(dataFromApi.locationName, this.global.publicKey).then(cipherTextLocation => {
        localStorage.locationName = cipherTextLocation;

        this.global.decryptMessage(this.global.ciphertext, this.global.privateKey).then(plainTextLocation => {
          this.global.showConsoleLog('Location ', plainTextLocation);
          this.global.setUserLocation(plainTextLocation);
        });
      });

      this.global.showConsoleLog('Manager Name', this.managerInfo.managerName);
      this.global.showConsoleLog('Manager ID', this.managerInfo.managerId);
      this.global.showConsoleLog('Gender:', dataFromApi.Gender);

    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  onChange(value) {
    this.global.showConsoleLog('Basic Calender', value);
  }

  validateLeave() {
    if (this.checkNameContactDescription(this.leaveInfo.startDate) == true) {
      if (this.checkNameContactDescription(this.leaveInfo.endDate) == true) {
        return true;
      } else {
        this.global.showDialogs(false, 'Please Select a valid End Date');
        return false;
      }
      // @ts-ignore
      return true;
    } else {
      this.global.showDialogs(false, 'Please select a valid Start Date');
      return false;
    }
    // @ts-ignore
    return true;
  }

  checkNameContactDescription(str) {
    if (str != undefined && str != null && str != '' && str != '' && str != 'null') {
      return true;
    } else {
      return false;
    }
  }

  calculateDuration(onApply) {
    if (this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
      if (this.validateLeave() == true) {
        this.global.showConsoleLog('compareDate: ', this.compareDate(new Date(this.leaveInfo.startDate), new Date(this.leaveInfo.endDate)));
        if (this.compareDate(new Date(this.leaveInfo.startDate), new Date(this.leaveInfo.endDate)) == 1) {
          this.global.showDialogs(false, 'Leave end date must be greater than start date.');
          this.leaveInfo.absence_days = '';
        } else {
          const req = {
            user_id: this.global.getUserId(),
            authToken: this.global.getAuthToken(),
            userLocation: localStorage.userCountry,
            leave_start_date: this.leaveInfo.startDate,
            leave_end_date: this.leaveInfo.endDate,
            leave_type: this.leaveInfo.leaveType,
            idToEditLeave: this.leaveInfo.idToEditLeave,
            leave_sub_type: '',
            start_day_half_day: '',
            end_day_half_day: ''
          };

          this.global.showConsoleLog('Request', req);
          if (req) {
            this.global.showProgressBar();
            this.livexservice.calculateDuration(req)
              .subscribe(
                leavedurationdata => {
                  this.successCallbackLeaveDuration(leavedurationdata);
                  this.global.hideProgressBar();
                },
                (error) => {
                  this.global.hideProgressBar();
                  this.global.showConsoleLog('error', error);
                  this.global.showDialogs(false, error.ErrorMessage);
                });
          }
        }
      }
    } else {
      this.global.showConsoleLog(false, 'Please select start and end date of your leave.');
    }
  }

  successCallbackLeaveDuration(leavedurationdata) {
    if (leavedurationdata.ErrorCode == 0) {
      this.global.showConsoleLog('Absense Count', this.leaveInfo.absence_days);
      this.leaveInfo.absence_days = leavedurationdata.DurationCount;
      this.flagsForButtonsVisibility = this.global.checkIfDataIsValid(this.editleaveInfoObject) ? 'deletePreview' : 'clearPreview';
    } else if (leavedurationdata.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, leavedurationdata.ErrorMessage);
      localStorage.clear();
    } else {
      this.leaveInfo.absence_days = '';
      this.global.showDialogs(false, leavedurationdata.ErrorMessage);
    }
  }


  applyLeave() {
    if (this.validateLeave() == true) {

      let formData = new FormData();

      formData.append('userLocation', localStorage.userCountry);
      formData.append('leave_status', 'Confirmed');
      formData.append('absence_days', this.leaveInfo.absence_days);
      formData.append('approver_id', this.managerInfo.managerId);
      formData.append('approver_mail', this.managerInfo.managerMailID);
      formData.append('approver_name', this.managerInfo.managerName);
      formData.append('authToken', this.global.getAuthToken());
      formData.append('editLeaveRequest', this.global.checkIfDataIsValid(this.editleaveInfoObject) ? 'true' : 'false');
      formData.append('employee_leave_comments', this.leaveInfo.employee_Comments);
      formData.append('employee_mail', this.global.getMailId());
      formData.append('employee_name', this.global.getFullName());
      formData.append('start_day_half_day', '');
      formData.append('end_day_half_day', '');
      formData.append('leave_start_date', this.leaveInfo.startDate);
      formData.append('leave_end_date', this.leaveInfo.endDate);
      formData.append('idToEditLeave', ((this.global.checkIfDataIsValid(this.editleaveInfoObject)) &&
        (this.global.checkIfDataIsValid(this.editleaveInfoObject.id))) ? this.leaveInfo.idToEditLeave : '');
      formData.append('leave_type', this.leaveInfo.leaveType);
      formData.append('leave_sub_type', '');
      formData.append('manager2UpID', this.twoUpManagerInfo.manager2UpID);
      formData.append('manager2UpMail', this.twoUpManagerInfo.manager2UpMail);
      formData.append('manager2UpName', this.twoUpManagerInfo.manager2UpName);
      formData.append('user_id', this.global.getUserId());
      formData.append('attachment_file', this.global.checkIfDataIsValid(this.fileToUpload) ? this.fileToUpload : '');

      if (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
        this.global.checkIfDataIsValid(this.tempDateFromHolidayList.APPROVAL_STATUS) &&
        (this.tempDateFromHolidayList.APPROVAL_STATUS.toLowerCase().indexOf('pending') != -1)) {
        formData.append('idToEditLeave', this.tempDateFromHolidayList.id);
        formData.append('editLeaveRequest', 'true');
      }

      this.global.showProgressBar();
      this.livexservice.appyLeave(formData)
        .subscribe(
          applyLeaveData => {
            this.successCallbackToApplyLeaves(applyLeaveData);
            this.global.hideProgressBar();
          },
          (error) => {
            this.global.hideProgressBar();
            this.global.showConsoleLog('error', error);
            this.global.showDialogs('', error.ErrorMessage);
          });
    }
  }

  async successCallbackToApplyLeaves(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.isEditable = true;
      this.global.showConsoleLog(' Apply Leave Response : ', dataFromApi);
      if (!this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
        this.global.trackEvent('leaveApplied', 'LiveX', this.global.getUserId(), 0);
        const alert = await this.alertCtrl.create({
          header: this.global.getAlertTitle(),
          message: dataFromApi.ErrorMessage,
          backdropDismiss: false,
          buttons: [{
            text: 'Ok',
            role: 'Ok',
            handler: () => {
              this.flagsForButtonsVisibility = '';
              this.clearLeaveForm();
              this.getCalenderConfigDatesAfterNewLeave(this.dateInputForHolidayList);
            }
          }]
        });
        await alert.present();
      } else {
        this.global.trackEvent('leaveEdited', 'LiveX', this.global.getUserId(), 0);
        const alert = await this.alertCtrl.create({
          header: this.global.getAlertTitle(),
          message: dataFromApi.ErrorMessage,
          backdropDismiss: false,
          buttons: [{
            text: 'Ok',
            role: 'Ok',
            handler: () => {
              this.clearLeaveForm();
              this.global.setMenuBackVisibility(true, false);
              this.global.popPageFromStack();
            }
          }]
        });
        await alert.present();
      }
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      const alert = await this.alertCtrl.create({
        header: this.global.getAlertTitle(),
        message: dataFromApi.ErrorMessage,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.isEditable = true;
            this.flagsForButtonsVisibility = 'clearPreview';
          }
        }]
      });

      alert.onDidDismiss().then(() => {
        this.changeRef.detectChanges();
      });

      await alert.present();
    }
    this.global.setSelectedFullDate_EndDate(null);
    this.global.setSelectedFullDate_LeaveBal(null);
    this.global.setSelectedFullDate_StartDate(null);
  }

  getCalenderConfigDatesAfterNewLeave(cDate) {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        checkBalanceDate: cDate,
        userLocation: localStorage.userCountry
      };

      this.global.showConsoleLog('getCalenderConfigDatesAfterNewLeave Request', req);
      if (req) {
        this.livexservice.getcalenderconfigdates(req)
          .subscribe(
            configDatesData => {
              this.successCallbackConfigDates(configDatesData);
              this.monthData = configDatesData;
              this.global.showConsoleLog('Config Dates', configDatesData);
            },
            (error) => {
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  clearLeaveForm() {
    this.leaveInfo.absence_days = '';
    this.leaveInfo.employee_Comments = '';
    this.leaveInfo.endDate = '';
    this.leaveInfo.leaveDuration = '';
    this.leaveInfo.leaveType = '';
    this.leaveInfo.startDate = '';
    this.leaveInfo.idToEditLeave = '';
    delete this.fileToUpload;
    this.editleaveInfoObject = null;
    
    this.zone.run(() => this.global.router.navigate(['/live-x'], { skipLocationChange: true }));
  }

  compareDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1); const d2 = new Date(date2);

    // Check if the dates are equal
    const same = d1.getTime() === d2.getTime();
    if (same) { return 0; }

    // Check if the first is greater than second
    if (d1 > d2) { return 1; }

    // Check if the first is less than second
    if (d1 < d2) { return -1; }
  }


  openStartDateCalendar() {
    this.openCalendarModal('startDate');
  }

  calCulateBalanceLeaves() {
    this.openCalendarModal('LeaveBal');
  }

  openEndDateCalendar() {
    this.openCalendarModal('endDate');
  }

  async openCalendarModal(from) {
    this.global.showConsoleLog('openCalendarModal : from : ', from);

    const dataToPass = {
      selectedDate: new Date(),
      from: ''
    };

    if (from == 'startDate') {
      if (this.leaveInfo.startDate != '' && this.leaveInfo.startDate != undefined) {
        const startDate = this.leaveInfo.startDate.split('-');
        const startDateMonthNum = this.getMonthNumber(startDate[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(startDate[2]), startDateMonthNum, parseInt(startDate[0]));
      }
    }

    if (from == 'endDate') {
      if (this.leaveInfo.endDate != '' && this.leaveInfo.endDate != undefined) {
        // console.log('ED : ' + this.leaveInfo.endDate);
        const endDate = this.leaveInfo.endDate.split('-');
        const endDateMonthNum = this.getMonthNumber(endDate[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(endDate[2]), endDateMonthNum, parseInt(endDate[0]));
      }
    }

    if (this.leaveInfo.startDate != '' && this.leaveInfo.endDate == '') {
      const date = this.leaveInfo.startDate.split('-');
      const dateMonthNum = this.getMonthNumber(date[1]);
      // tslint:disable-next-line: radix
      dataToPass.selectedDate = new Date(parseInt(date[2]), dateMonthNum, parseInt(date[0]));
    }

    if (from == 'LeaveBal') {
      if (this.historyDate_LeaveBal != '' && this.historyDate_LeaveBal != undefined) {
        const date = this.historyDate_LeaveBal.split('-');

        const dateMonthNum = this.getMonthNumber(date[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(date[2]), dateMonthNum, parseInt(date[0]));
      }
    }

    dataToPass.from = from;

    this.global.showConsoleLog('dataToPass', dataToPass);

    const modalPage = await this.modalController.create({
      component: CalendarPopUpPage,
      componentProps: { dataToPass },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: ''
    });

    modalPage.onDidDismiss().then(data => {
      if (this.global.checkIfDataIsValid(data.data)) {
        if (from == 'startDate') {
          data.data = new Date(data.data);
          if (!isNaN(data.data.getTime())) { this.leaveInfo.startDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy'); }

          if (this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
            this.calculateDuration('');
          }

        } else if (from == 'LeaveBal') {
          if (data.data != null) {
            this.historyDate_LeaveBal = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
            data.data = this.historyDate_LeaveBal;
            this.currDate = data.data;
            const date = data.data.split('-');
            this.currDateToDisplay = date[0] + ' ' + date[1];
            this.leaveBalance();
          }
        } else {
          data.data = new Date(data.data);
          if (!isNaN(data.data.getTime())) { this.leaveInfo.endDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy'); }
          if (this.global.checkIfDataIsValid(this.leaveInfo.startDate)) {
            this.calculateDuration('');
          }
        }
      }
    });
    await modalPage.present();
  }

  private getMonthNumber(date: string) {
    date = date.toLowerCase();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthNum = months.indexOf(date);
    return monthNum;
  }
}
