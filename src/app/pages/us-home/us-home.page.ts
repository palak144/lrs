import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonContent, NavController, AlertController, ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion4-calendar';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { LeaveSummaryService } from '../leave-summary/leave-summary.service';
import { HomeService } from '../home/home.service';
import * as moment from 'moment';
import { LoginPage } from '../login/login.page';
import { CalendarPopUpPage } from 'src/app/controls/calendar-pop-up/calendar-pop-up.page';

@Component({
  selector: 'app-us-home',
  templateUrl: './us-home.page.html',
  styleUrls: ['./us-home.page.scss'],
})
export class UsHomePage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  currDate: any;
  configArray: any;
  monthChangeDate: any;
  calendarCurrentMonth: any;
  fileName: string;
  type: 'string';
  options: CalendarComponentOptions;

  // tslint:disable-next-line: variable-name
  historyDate_LeaveBal: any;
  // tslint:disable-next-line: variable-name
  historyDate_startDate: any;
  // tslint:disable-next-line: variable-name
  historyDate_endDate: any;
  // tslint:disable-next-line: variable-name
  historyDate_childBirthDate: any;
  editleaveInfoObject: any;
  leaveObjectFromSummary = false;
  fileToUpload: File = null;
  isMale = true;
  leaveInfo: any;
  dateInputForHolidayList: any;
  date: string;

  managerInfo = {
    managerId: '',
    managerName: '',
    managerMailID: ''
  };

  twoUpManagerInfo = {
    manager2UpID: '',
    manager2UpName: '',
    manager2UpMail: ''
  };

  leaveBal = {
    vacationLeave: '',
    sickLeave: '',
    specialPriviledgeLeave: '',
    floatingLeave: ''
  };

  isSelectedDateIsClickable = false;
  tempDateFromHolidayList;

  leaveTypeInCurrentUse: any;
  isEditable = false;
  flagsForButtonsVisibility: any;
  showEditIcon = false;
  currDateToDisplay: string;
  isEdgeBrowser: any;
  isFirefoxBrowser: any;
  monthData: any;
  flag = true;
  newMonthDate: any;
  homeMessage: any;


  ngOnInit() {
    
  }

  // tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public datepipe: DatePipe, public modalController: ModalController, public global: GlobalService, public leavesummary: LeaveSummaryService, public homeservice: HomeService, private changeRef: ChangeDetectorRef, public zone: NgZone) {
   
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
      absence_hours: '',
      startTime: '',
      endTime: '',
      employee_Comments: '',
      idToEditLeave: '',
      editLeaveRequest: '',
      attachment_file_name: '',
      childBirthDate: '',
      edgeFormatDate: ''
    };

    this.global.setPageTitle('Leave Management System');
    this.currDate = moment(new Date(), 'DD-MMM-YYYY');
    this.monthChangeDate = moment(new Date(), 'DD-MMM-YYYY');
    this.dateInputForHolidayList = moment(new Date(), 'DD-MMM-YYYY');


    this.date = this.currDate;
    this.currDateToDisplay = this.datepipe.transform(this.date, 'd MMM');
    this.isEditable = true;

    this.editleaveInfoObject = this.global.getNavData();
    this.initializeData('');

    if (this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.global.trackView('LeaveSummaryPageDetail', this.editleaveInfoObject.id);
    } else {
      this.global.trackView('UsHomePage', 'page-us-home');
    }
    this.global.showConsoleLog('Current Date', this.currDate);
    this.historyDate_LeaveBal = '';
  }

  ionViewWillEnter() {
    
    this.resetForm();
    this.editleaveInfoObject = this.global.getNavData();
    this.initializeData(this.editleaveInfoObject);
    this.leaveBalance();
    this.getCalenderConfigDates(this.currDate);
    this.global.setNavData(null);
  }

  getPreview() {
    if ((this.validateLeave() == true) && (!this.leaveObjectFromSummary)) {
      if (this.leaveInfo.leaveType == 'Bereavement' || this.leaveInfo.leaveType == 'Floating Leave' ||
        this.leaveInfo.leaveType == 'Maternity Leave' || this.leaveInfo.leaveType == 'Paternity Leave' ||
        this.leaveInfo.leaveType == 'Sick Leave' || this.leaveInfo.leaveType == 'Unpaid Leave' ||
        this.leaveInfo.leaveType == 'Vacation' || this.leaveInfo.leaveType == 'Voting') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'Comment is mandatory.');
        }
      } else if ((this.leaveInfo.leaveType == 'Jury Duty')) {
        if (!this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.global.showDialogs(false, 'Comment is mandatory.');
        } else if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) &&
          this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Jury Duty, attachment is mandatory.');
        }
      } else if ((this.leaveInfo.leaveType == 'Philanthropic Work')) {
        if (!this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.global.showDialogs(false, 'Comment is mandatory.');
        } else if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) &&
          this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Philanthropic Work, attachment is mandatory.');
        }
      } else {
        this.validLeaveContinue();
      }
    } else if ((this.validateLeave() == true) && (this.leaveObjectFromSummary == true)) {
      if (this.leaveInfo.leaveType == 'Bereavement' || this.leaveInfo.leaveType == 'Floating Leave' ||
        this.leaveInfo.leaveType == 'Maternity Leave' || this.leaveInfo.leaveType == 'Paternity Leave' ||
        this.leaveInfo.leaveType == 'Sick Leave' || this.leaveInfo.leaveType == 'Unpaid Leave' ||
        this.leaveInfo.leaveType == 'Vacation' || this.leaveInfo.leaveType == 'Voting') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'Comment is mandatory.');
        }
      } else if ((this.leaveInfo.leaveType == 'Jury Duty')) {
        if (!this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.global.showDialogs(false, 'Comment is mandatory.');
        } else if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) &&
          this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Jury Duty, attachment is mandatory.');
        }
      } else if ((this.leaveInfo.leaveType == 'Philanthropic Work')) {
        if (!this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.global.showDialogs(false, 'Comment is mandatory.');
        } else if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) &&
          this.global.checkIfDataIsValid(this.leaveInfo.employee_Comments)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Philanthropic Work, attachment is mandatory.');
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

  initializeData(data) {
    if (this.global.checkIfDataIsValid(data)) {
      this.leaveObjectFromSummary = true;

      this.leaveInfo.startDate = data.START_DATE;
      this.leaveInfo.endDate = data.END_DATE;
      this.leaveInfo.absence_hours = data.DURATION;
      this.leaveInfo.employee_Comments = data.employee_leave_comments;
      this.leaveInfo.leaveType = data.LEAVE_TYPE;
      this.leaveInfo.idToEditLeave = data.id;
      this.leaveInfo.attachedFileLink = data.attachment_file_name;

      if (this.global.checkIfDataIsValid(data.attachment_file_name)) {
        const index = data.attachment_file_name.indexOf('s/');
        this.leaveInfo.attachment_file_name = data.attachment_file_name.substring(index + 2);
      }

      this.leaveInfo.childBirthDate = data.start_day_half_day;
      if (this.global.checkIfDataIsValid(data.END_TIME)) {
        this.leaveInfo.endTime = data.END_TIME;
      }
      if (this.global.checkIfDataIsValid(data.START_TIME)) {
        this.leaveInfo.startTime = data.START_TIME;
      }

      if (data.canBeEditedByUser == true && data.canBeCancelledByUser == false) {
        this.isEditable = true;
      } else if (data.canBeCancelledByUser == true && data.canBeEditedByUser == false) {
        this.isEditable = false;
      } else if (data.canBeCancelledByUser == true && data.canBeEditedByUser == true) {
        this.showEditIcon = true;
        this.isEditable = true;
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
      this.global.showConsoleLog('editleaveInfoObject', this.editleaveInfoObject);

      this.leaveObjectFromSummary = true;


      // tslint:disable-next-line: variable-name
      let startDate_ExpectedFormat, endDate_ExpectedFormat, childBirthDate_ExpectedFormat;

      startDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.startDateTimeStamp * 1000, 'dd-MMM-yyyy');
      endDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.endDateTimeStamp * 1000, 'dd-MMM-yyyy');
      childBirthDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.start_day_half_dayTimestamp * 1000, 'dd-MMM-yyyy');

      this.editleaveInfoObject.START_DATE = startDate_ExpectedFormat;
      this.editleaveInfoObject.END_DATE = endDate_ExpectedFormat;

      if (this.leaveInfo.leaveType == 'Maternity Leave' || this.leaveInfo.leaveType == 'Paternity Leave') {
        this.leaveInfo.childBirthDate = childBirthDate_ExpectedFormat;
      }

      this.leaveInfo.startDate = this.editleaveInfoObject.START_DATE;
      this.leaveInfo.endDate = this.editleaveInfoObject.END_DATE;
      this.leaveInfo.childBirthDate = this.editleaveInfoObject.start_day_half_day;
      this.leaveInfo.absence_hours = this.editleaveInfoObject.DURATION;

      if (this.editleaveInfoObject.employee_leave_comments != null || this.editleaveInfoObject.employee_leave_comments != undefined) {
        this.leaveInfo.employee_Comments = this.editleaveInfoObject.employee_leave_comments;
      } else {
        this.leaveInfo.employee_Comments = '';
      }

      this.leaveInfo.leaveType = this.editleaveInfoObject.LEAVE_TYPE;

      if (this.global.checkIfDataIsValid(this.editleaveInfoObject.start_day_half_day)) {
        this.leaveInfo.childBirthDate = this.editleaveInfoObject.start_day_half_day;
      }
      if (this.leaveInfo.leaveType != 'Floating Leave' && this.leaveInfo.leaveType != 'Philanthropic Work') {
        this.leaveInfo.startTime = this.editleaveInfoObject.START_TIME;
        this.leaveInfo.endTime = this.editleaveInfoObject.END_TIME;
      }

      this.leaveInfo.idToEditLeave = this.editleaveInfoObject.id;
      this.leaveInfo.editLeaveRequest = true;
      this.leaveInfo.attachedFileLink = this.editleaveInfoObject.attachment_file_name;
      if (this.global.checkIfDataIsValid(this.editleaveInfoObject.attachment_file_name)) {
        const index = this.editleaveInfoObject.attachment_file_name.indexOf('s/');
        this.leaveInfo.attachment_file_name = this.editleaveInfoObject.attachment_file_name.substring(index + 2);
      }


      if (this.editleaveInfoObject.canBeEditedByUser == true && this.editleaveInfoObject.canBeCancelledByUser == false) {
        this.isEditable = true;
      } else if (this.editleaveInfoObject.canBeCancelledByUser == true && this.editleaveInfoObject.canBeEditedByUser == false) {
        this.isEditable = false;
      } else if (this.editleaveInfoObject.canBeCancelledByUser == true && this.editleaveInfoObject.canBeEditedByUser == true) {
        this.showEditIcon = true;
        this.isEditable = true;

      } else if (this.editleaveInfoObject.canBeCancelledByUser == false && this.editleaveInfoObject.canBeEditedByUser == false) {
        this.isEditable = false;
      }

      // tslint:disable-next-line: max-line-length
      this.flagsForButtonsVisibility = this.getFlagValueForButtonsVisibility(this.editleaveInfoObject.canBeEditedByUser, this.editleaveInfoObject.canBeCancelledByUser);
    }
  }

  leaveBalance() {
    if (this.global.checkIfDataIsValid(localStorage.UserId) &&
      this.global.checkIfDataIsValid(localStorage.AuthToken) &&
      this.global.checkIfDataIsValid(localStorage.userCountry)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        userLocation: localStorage.userCountry,
        checkBalanceDate: this.currDate
      };
      if (req) {
        this.global.showConsoleLog('req', JSON.stringify(req));
        this.homeservice.calculateLeaves(req)
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
    
    if (dataFromApi.ErrorCode == 0) {
      this.leaveBal.vacationLeave = dataFromApi.VacationLeave;
      this.leaveBal.sickLeave = dataFromApi.SickLeave;
      this.leaveBal.specialPriviledgeLeave = dataFromApi.SpecialPrivilegeLeave;
      this.leaveBal.floatingLeave = dataFromApi.FloatingLeave;
      this.managerInfo.managerId = dataFromApi.managerID;
      localStorage.managerID = this.managerInfo.managerId;
      this.managerInfo.managerName = dataFromApi.managerName;
      this.managerInfo.managerMailID = dataFromApi.managerMail;
      this.twoUpManagerInfo.manager2UpID = dataFromApi.manager2UpID;
      localStorage.manager2UpID = dataFromApi.manager2UpID;
      this.twoUpManagerInfo.manager2UpName = dataFromApi.manager2UpName;
      this.twoUpManagerInfo.manager2UpMail = dataFromApi.manager2UpMail;

      if (this.global.checkIfDataIsValid(dataFromApi.Gender)) {
        if (dataFromApi.Gender == 'M') {
          this.isMale = true;
        } else {
          this.isMale = false;
        }
      }

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

  getCalenderConfigDates(cDate) {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        userLocation: localStorage.userCountry,
        checkBalanceDate: cDate
      };

      this.global.showConsoleLog('getCalenderConfigDates Request', req);
      if (req) {
        this.global.showProgressBar();
        this.homeservice.getcalenderconfigdates(req)
          .subscribe(
            configDatesData => {
              this.global.hideProgressBar();
              this.successCallbackConfigDates(configDatesData);
              this.monthData = configDatesData;
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
      this.global.setCalendarCurrentMonth(dataFromApi.currentMonth);

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
            case 'Bereavement_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Bereavement_Leave marked';
              break;
            }
            case 'Jury_Duty': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Jury_Duty marked';
              break;
            }
            case 'Sick_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Sick_Leave marked';
              break;
            }
            case 'Unpaid_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Unpaid_Leave marked';
              break;
            }
            case 'Vacation': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Vacation marked';
              break;
            }
            case 'Floating_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Floating_Leave marked';
              break;
            }
            case 'Fixed_Holiday': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Fixed_Holiday marked';
              break;
            }
            case 'Leaving_Zensar_Inc': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Leaving_Zensar_Inc marked';
              break;
            }
            case 'Maternity_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Maternity_Leave marked';
              break;
            }
            case 'Philanthropic_Work': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Philanthropic_Work marked';
              break;
            }
            case 'Paternity_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Paternity_Leave marked';
              break;
            }
            case 'Shut_Down': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Shut_Down marked';
              break;
            }
            case 'Unpaid_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Unpaid_Leave marked';
              break;
            }
            case 'Voting': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Voting marked';
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

  selectedLeaveType(leaveType) {
    this.leaveInfo.leaveType = leaveType;
    this.leaveInfo.absence_hours = '';

    this.fileName = '';
    delete this.fileToUpload;

    this.global.showConsoleLog('Selected Leave Type.....', leaveType);

    if (this.leaveInfo.leaveType == 'Floating Leave' || this.leaveInfo.leaveType == 'Philanthropic Work') {
      if (this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
        this.calculateDuration('');
      }
    }

    if (this.leaveInfo.leaveType != 'Maternity Leave' && this.leaveInfo.leaveType != 'Paternity Leave') {
      // tslint:disable-next-line: max-line-length
      if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) && this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.startTime) && this.global.checkIfDataIsValid(this.leaveInfo.endTime)) {
        if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
          if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
            this.leaveInfo.absence_hours = '';
            this.global.showDialogs(false, 'Leave end time must be greater than start time.');
          } else {
            this.calculateDuration('');
          }
        } else {
          this.calculateDuration('');
        }
      }
    } else if (this.leaveInfo.leaveType == 'Maternity Leave' || this.leaveInfo.leaveType == 'Paternity Leave') {
      // tslint:disable-next-line: max-line-length
      if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) && this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.startTime) && this.global.checkIfDataIsValid(this.leaveInfo.endTime) && this.global.checkIfDataIsValid(this.leaveInfo.childBirthDate)) {
        if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
          if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
            this.leaveInfo.absence_hours = '';
            this.global.showDialogs(false, 'Leave end time must be greater than start time.');
          } else {
            this.calculateDuration('');
          }
        } else {
          this.calculateDuration('');

        }
      }
    }
  }

  openFile(fileURL) {
    window.open(fileURL);
  }


  calCulateBalanceLeaves() {
    this.openCalendarModal('LeaveBal');
  }

  openStartDateCalendar() {
    this.openCalendarModal('startDate');
  }

  openEndDateCalendar() {
    this.openCalendarModal('endDate');
  }

  openchildBirthDueDateCalendar() {
    this.openCalendarModal('childBirthDate');
  }

  async openCalendarModal(from) {
    this.global.showConsoleLog('openCalendarModal : from : ', from);

    const dataToPass = {
      configArray: this.configArray,
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
        const endDate = this.leaveInfo.endDate.split('-');
        const endDateMonthNum = this.getMonthNumber(endDate[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(endDate[2]), endDateMonthNum, parseInt(endDate[0]));
      }
    }

    if (from == 'childBirthDate') {
      if (this.leaveInfo.start_day_half_day != '' && this.leaveInfo.start_day_half_day != undefined) {
        const startDayHalfDay = this.leaveInfo.start_day_half_day.split('-');
        const startDayHalfMonthNum = this.getMonthNumber(startDayHalfDay[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(startDayHalfDay[2]), startDayHalfMonthNum, parseInt(startDayHalfDay[0]));
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

    const modalPage = await this.modalController.create(
      {
        component: CalendarPopUpPage,
        componentProps: { dataToPass },
        showBackdrop: true,
        backdropDismiss: true,
        cssClass: 'calendarModal'
      }
    );

    modalPage.onDidDismiss().then(data => {
      if (this.global.checkIfDataIsValid(data.data)) {
        if (from == 'LeaveBal') {
          if (data.data) {
            this.historyDate_LeaveBal = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
            data.data = this.historyDate_LeaveBal;
            this.currDate = data.data;
            const date = data.data.split('-');
            this.currDateToDisplay = date[0] + ' ' + date[1];
            this.leaveBalance();
          }
        } else if (from == 'childBirthDate') {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.childBirthDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          if (this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startTime) &&
            this.global.checkIfDataIsValid(this.leaveInfo.endTime)) {
            this.calculateDuration('');
          }
        } else if (from == 'startDate') {
          data.data = new Date(data.data);
          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.startDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.leaveInfo.startDate != this.leaveInfo.startDate) {
            this.calculateDuration('');
          }

          if (this.leaveInfo.leaveType == 'Floating Leave' ||
            this.leaveInfo.leaveType == 'Philanthropic Work') {
            if (this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
              this.calculateDuration('');
            }
          }

          if (this.leaveInfo.leaveType != 'Floating Leave' &&
            this.leaveInfo.leaveType != 'Philanthropic Work') {
            if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
              this.global.checkIfDataIsValid(this.leaveInfo.startTime) &&
              this.global.checkIfDataIsValid(this.leaveInfo.endTime)) {

              if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
                if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
                  this.leaveInfo.absence_hours = '';
                  this.global.showDialogs(false, 'Leave end time must be greater than start time.');
                } else {
                  this.calculateDuration('');
                }
              } else {
                this.calculateDuration('');
              }
            }
          }
        } else {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.endDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          const startDate = this.leaveInfo.startDate.split('-');
          const startDateMonthNum = this.getMonthNumber(startDate[1]);

          // tslint:disable-next-line: radix
          if (this.compareDate(new Date(parseInt(startDate[2]), startDateMonthNum, parseInt(startDate[0])), new Date(data.data)) == 1) {
            this.global.showDialogs(false, 'Leave end date must be greater than start date.');
            this.leaveInfo.endDate = '';
            this.leaveInfo.absence_hours = '';
          } else {
            if (!isNaN(data.data.getTime())) {
              this.leaveInfo.endDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
            }
          }
          if (this.leaveInfo.leaveType == 'Floating Leave' || this.leaveInfo.leaveType == 'Philanthropic Work') {
            this.calculateDuration('');
          }

          if (this.leaveInfo.leaveType != 'Floating Leave' && this.leaveInfo.leaveType != 'Philanthropic Work') {

            if (this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
              this.global.checkIfDataIsValid(this.leaveInfo.startTime) &&
              this.global.checkIfDataIsValid(this.leaveInfo.endTime)) {
              if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
                if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
                  this.leaveInfo.absence_hours = '';
                  this.global.showDialogs(false, 'Leave end time must be greater than start time.');
                } else {
                  this.calculateDuration('');
                }
              } else {
                this.calculateDuration('');
              }
            }
          }

        }
      }
    });
    modalPage.present();
  }

  private getMonthNumber(monthName: string) {
    monthName = monthName.toLowerCase();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthNum = months.indexOf(monthName);
    return monthNum;
  }

  getFlagValueForButtonsVisibility(canBeEditedByUser, canBeCancelledByUser) {/*Combinations verified by Jyoti : 12-04-2019*/
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

  async deleteLeave() {
    const alert = await this.alertCtrl.create({
      header: this.global.getAlertTitle(),
      message: 'Are you sure you want to delete this leave?',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          const req = {
            user_id: this.global.getUserId(),
            authToken: this.global.getAuthToken(),
            leave_type: this.editleaveInfoObject.LEAVE_TYPE,
            leave_start_date: this.editleaveInfoObject.START_DATE,
            leave_end_date: this.editleaveInfoObject.END_DATE,
            employee_number: this.editleaveInfoObject.EMPLOYEE_NUMBER,
            start_time: this.editleaveInfoObject.START_TIME,
            end_time: this.editleaveInfoObject.END_TIME,
            absence_hours: this.editleaveInfoObject.DURATION,
            userLocation: localStorage.userCountry,
            idToEditLeave: this.editleaveInfoObject.id,
            isFutureApproved: this.editleaveInfoObject.APPROVAL_STATUS == 'Approved' ? 'Y' : 'N'
          };

          if (req) {
            this.global.showProgressBar();
            this.global.showConsoleLog('deleteLeave - req', JSON.stringify(req));
            this.leavesummary.canceLeave(req)
              .subscribe(
                leavearejectdata => {
                  this.global.hideProgressBar();
                  this.successDeleteLeaveCallback(leavearejectdata);
                },
                (error) => {
                  this.global.hideProgressBar();
                  this.global.showConsoleLog('Leave Reject Data - error', error);
                  this.global.showDialogs(false, error.ErrorMessage);
                });
          }
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.global.showConsoleLog('Cancel', '');
        }
      }]
    });
    await alert.present();
  }

  async successDeleteLeaveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.trackEvent(this.editleaveInfoObject.APPROVAL_STATUS == 'Approved' ? 'approvedLeaveCancelled' : 'pendingLeaveCancelled', 'US', this.editleaveInfoObject.id, 0);

      const alert = await this.alertCtrl.create({
        header: this.global.getAlertTitle(),
        message: dataFromApi.ErrorMessage,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.global.popPageFromStack();
            this.global.setMenuBackVisibility(true, false);
          }
        }]
      });
      alert.present();
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showConsoleLog('Delete Leave Error : ', dataFromApi.ErrorMessage);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }


  getHomePageNoticeMessage() {
    this.global.getHomePageMessage()
      .subscribe(
        res => {
          this.homeMessage = res.US;
          this.global.showConsoleLog('homeMessage', this.homeMessage.US);
        }
      );
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

  openUploader(event: any) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('file') as HTMLElement;
    element.click();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name;
  }

  clearLeaveForm() {
    this.leaveInfo.startDate = '';
    this.leaveInfo.endDate = '';
    this.leaveInfo.leaveType = '';
    this.leaveInfo.absence_hours = '';
    this.leaveInfo.startTime = '';
    this.leaveInfo.endTime = '';
    this.leaveInfo.employee_Comments = '';
    this.leaveInfo.idToEditLeave = '';
    this.leaveInfo.editLeaveRequest = '';
    this.leaveInfo.childBirthDate = '';
    this.editleaveInfoObject = null;
    this.tempDateFromHolidayList = null;
    delete this.fileToUpload;
    this.fileName = '';
    
    this.zone.run(() => this.global.router.navigate(['/us-home'], { skipLocationChange: true }));
  }


  onDateSelect(value) {
    if (!this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.clearLeaveForm();
      this.isEditable = false;
      this.isSelectedDateIsClickable = true;

      const calendarDate = moment(new Date(value.time)).format('DD-MMM-YYYY');

      if (this.configArray.length > 0) {
        this.configArray.forEach(element => {
          if (calendarDate == element.EdgeFormatDate) {
            if (element.canBeEditedByUser == true) {
              this.tempDateFromHolidayList = element;
              this.isSelectedDateIsClickable = true;
            } else {
              this.global.showConsoleLog('NOT clickable => ', moment(new Date(element.date)).format('DD-MMM-YYYY'));
              this.isSelectedDateIsClickable = false;
            }
          }
        });
      } else {
        this.isSelectedDateIsClickable = true;
      }

      let leaveObj = this.configArray.find(x => (x.date) === calendarDate);
      if (!this.global.checkIfDataIsValid(leaveObj)) {
        if (this.global.checkIfDataIsValid(calendarDate) && this.isSelectedDateIsClickable == true) {
          leaveObj = {
            // tslint:disable-next-line: max-line-length
            START_DATE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ? this.tempDateFromHolidayList.START_DATE : calendarDate,
            END_DATE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ? this.tempDateFromHolidayList.END_DATE : calendarDate,
            LEAVE_TYPE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ? this.tempDateFromHolidayList.LEAVE_TYPE : '',
            // tslint:disable-next-line: max-line-length
            start_day_half_day: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.start_day_half_day))) ? this.tempDateFromHolidayList.start_day_half_day : '',
            // tslint:disable-next-line: max-line-length
            employee_leave_comments: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.employee_leave_comments))) ? this.tempDateFromHolidayList.employee_leave_comments : '',
            // tslint:disable-next-line: max-line-length
            DURATION: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.DURATION))) ? this.tempDateFromHolidayList.DURATION : '',
            // tslint:disable-next-line: max-line-length
            START_TIME: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.START_TIME))) ? this.tempDateFromHolidayList.START_TIME : '',
            // tslint:disable-next-line: max-line-length
            END_TIME: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.END_TIME))) ? this.tempDateFromHolidayList.END_TIME : '',
            // tslint:disable-next-line: max-line-length
            id: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.id))) ? this.tempDateFromHolidayList.id : '',
            // tslint:disable-next-line: max-line-length
            attachment_file_name: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.attachment_file_name))) ? this.tempDateFromHolidayList.attachment_file_name : ''

          };

          this.isEditable = true;
          this.global.showConsoleLog('Leave Obj:::', leaveObj);
          this.initializeData(leaveObj);
        }
      }

      if (this.isSelectedDateIsClickable == true) {
        if (window.screen.width < 700) {
          this.content.scrollToPoint(0, 850, 600);
        }
      } else {
        this.date = '';
        this.global.showConsoleLog('ELSE : this.date : ', this.date);
        this.leaveInfo.startDate = '';
        this.leaveInfo.endDate = '';
      }
    }
  }

  checkNameContactDescription(str) {
    if (str != undefined && str != null && str != '' && str != '' && str != 'null') {
      return true;
    } else {
      return false;
    }
  }

  selectedStartTime(sTime) {
    this.leaveInfo.startTime = sTime;
    if (this.global.checkIfDataIsValid(this.leaveInfo.endTime) && this.global.checkIfDataIsValid(this.leaveInfo.startTime)) {
      if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
        if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
          this.global.showDialogs(false, 'Leave end time must be greater than start time.');
          this.leaveInfo.absence_hours = '';
        } else {
          this.calculateDuration('');
        }
      } else {
        this.calculateDuration('');
      }
    }
  }

  selectedEndTime(eTime) {
    this.leaveInfo.endTime = eTime;

    if (this.leaveInfo.leaveType != 'Maternity Leave' && this.leaveInfo.leaveType != 'Paternity Leave') {
      // tslint:disable-next-line: max-line-length
      if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) && this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.startTime) && this.global.checkIfDataIsValid(this.leaveInfo.endTime)) {
        if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
          if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
            this.leaveInfo.absence_hours = '';
            this.global.showDialogs(false, 'Leave end time must be greater than start time.');
          } else {
            this.calculateDuration('');
          }
        } else {
          this.calculateDuration('');
        }
      }
    } else if (this.leaveInfo.leaveType == 'Maternity Leave' || this.leaveInfo.leaveType == 'Paternity Leave') {
      // tslint:disable-next-line: max-line-length
      if (this.global.checkIfDataIsValid(this.leaveInfo.endDate) && this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.startTime) && this.global.checkIfDataIsValid(this.leaveInfo.endTime) && this.global.checkIfDataIsValid(this.leaveInfo.childBirthDate)) {
        if (this.leaveInfo.startDate == this.leaveInfo.endDate) {
          if (this.compareTime(this.leaveInfo.startTime, this.leaveInfo.endTime) == 1) {
            this.leaveInfo.absence_hours = '';
            this.global.showDialogs(false, 'Leave end time must be greater than start time.');
          } else {
            this.calculateDuration('');
          }
        } else {
          this.calculateDuration('');

        }
      }
    }
  }



  calculateDuration(onApply) {
    if (this.global.checkIfDataIsValid(this.leaveInfo.startDate) && this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
      if (this.validateLeave() == true) {
        this.global.showConsoleLog('compareDate: ', this.compareDate(new Date(this.leaveInfo.startDate), new Date(this.leaveInfo.endDate)));
        if (this.compareDate(new Date(this.leaveInfo.startDate), new Date(this.leaveInfo.endDate)) == 1) {
          this.global.showDialogs(false, 'Leave end date must be greater than start date.');
          this.leaveInfo.absence_hours = '';
        } else {
          const req = {
            user_id: this.global.getUserId(),
            authToken: this.global.getAuthToken(),
            userLocation: localStorage.userCountry,
            leave_start_date: this.leaveInfo.startDate,
            leave_end_date: this.leaveInfo.endDate,
            leave_type: this.leaveInfo.leaveType,
            start_time: this.leaveInfo.startTime,
            end_time: this.leaveInfo.endTime,
            start_day_half_day: this.leaveInfo.childBirthDate,
            idToEditLeave: this.leaveInfo.idToEditLeave
          };

          this.global.showConsoleLog('Request', req);
          if (req) {
            this.global.showProgressBar();
            this.homeservice.calculateDuration(req)
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
      this.global.showConsoleLog('Absense Count', this.leaveInfo.absence_hours);
      this.leaveInfo.absence_hours = leavedurationdata.DurationCount;
      this.flagsForButtonsVisibility = this.global.checkIfDataIsValid(this.editleaveInfoObject) ? 'deletePreview' : 'clearPreview';
    } else if (leavedurationdata.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, leavedurationdata.ErrorMessage);
      localStorage.clear();
    } else {
      this.leaveInfo.absence_hours = '';
      this.global.showDialogs(false, leavedurationdata.ErrorMessage);
    }
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
    alert.present();
  }

  compareDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1); const d2 = new Date(date2);

    // Check if the dates are equal
    const same = d1.getTime() == d2.getTime();
    if (same) { return 0; }

    // Check if the first is greater than second
    if (d1 > d2) { return 1; }

    // Check if the first is less than second
    if (d1 < d2) { return -1; }
  }


  //// Compare Time
  compareTime(startTime, endTime): number {
    // Check if the startTime is greater than endtime
    if (startTime > endTime) { return 1; }

    // Check if the startime is lesser then endTime
    if (startTime < endTime) { return -1; }

  }

  cancel() {
    this.isEditable = true;

    this.flagsForButtonsVisibility = this.global.checkIfDataIsValid(this.editleaveInfoObject) ? 'deletePreview' : 'clearPreview';
  }

  editLeave() {
    this.isEditable = true;
    this.flagsForButtonsVisibility = 'deletePreview';
  }

  applyLeave() {
    const formData = new FormData();

    formData.append('userLocation', this.global.getLocalStorageUserCountry());
    formData.append('approver_id', this.managerInfo.managerId);
    formData.append('approver_mail', this.managerInfo.managerMailID);
    formData.append('approver_name', this.managerInfo.managerName);
    formData.append('authToken', this.global.getAuthToken());
    formData.append('editLeaveRequest', this.global.checkIfDataIsValid(this.editleaveInfoObject) ? 'true' : 'false');
    formData.append('employee_leave_comments', this.leaveInfo.employee_Comments);
    formData.append('employee_mail', this.global.getMailId());
    formData.append('employee_name', this.global.getFullName());
    
    // tslint:disable-next-line: max-line-length
    formData.append('start_day_half_day', this.global.checkIfDataIsValid(this.leaveInfo.childBirthDate) ? this.leaveInfo.childBirthDate : '');
    formData.append('start_time', this.leaveInfo.startTime);
    formData.append('end_time', this.leaveInfo.endTime);
    formData.append('leave_start_date', this.leaveInfo.startDate);
    formData.append('leave_end_date', this.leaveInfo.endDate);
    formData.append('absence_hours', this.leaveInfo.absence_hours);
    // tslint:disable-next-line: max-line-length A
    formData.append('idToEditLeave', ((this.global.checkIfDataIsValid(this.editleaveInfoObject)) && (this.global.checkIfDataIsValid(this.editleaveInfoObject.id))) ? this.leaveInfo.idToEditLeave : '');
    formData.append('leave_type', this.leaveInfo.leaveType);
    formData.append('leave_status', 'Confirmed');
    formData.append('user_id', this.global.getUserId());
    formData.append('attachment_file', this.global.checkIfDataIsValid(this.fileToUpload) ? this.fileToUpload : '');

    // tslint:disable-next-line: max-line-length
    if (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) && this.global.checkIfDataIsValid(this.tempDateFromHolidayList.APPROVAL_STATUS) && (this.tempDateFromHolidayList.APPROVAL_STATUS.toLowerCase().indexOf('pending') != -1)) {
      formData.append('idToEditLeave', this.tempDateFromHolidayList.id);
    }

    this.global.showConsoleLog('Apply Leave Obj', formData);
    this.global.showProgressBar();
    this.homeservice.submitFile(formData)
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
    // }
  }

  async successCallbackToApplyLeaves(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.isEditable = true;
      this.global.showConsoleLog(' Apply Leave Response : ', dataFromApi);
      if (!this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
        this.global.trackEvent('leaveApplied', 'US', this.global.getUserId(), 0);
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
        this.global.trackEvent('leaveEdited', 'US', this.global.getUserId(), 0);
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

      alert.present();
    }
    this.global.setSelectedFullDate_EndDate(null);
    this.global.setSelectedFullDate_LeaveBal(null);
    this.global.setSelectedFullDate_StartDate(null);
    this.global.setSelectedFullDate_WorkEndDate(null);
    this.global.setSelectedFullDate_WorkStartDate(null);
  }

  getCalenderConfigDatesAfterNewLeave(cDate) {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        checkBalanceDate: cDate,
        userLocation: localStorage.userCountry,

      };

      this.global.showConsoleLog('getCalenderConfigDatesAfterNewLeave Request', req);
      if (req) {
        this.homeservice.getcalenderconfigdates(req)
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
}