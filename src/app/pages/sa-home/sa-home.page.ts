import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CalendarComponentOptions, CalendarController } from 'ion4-calendar';
import { AlertController, NavController, ModalController, ToastController, IonContent } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { DatePipe } from '@angular/common';
import { SaHomeService } from './sa-home.service';
import { LeaveSummaryService } from '../leave-summary/leave-summary.service';
import * as moment from 'moment';
import { LeaveSummaryPage } from '../leave-summary/leave-summary.page';
import { LoginPage } from '../login/login.page';
import { CalendarPopUpPage } from 'src/app/controls/calendar-pop-up/calendar-pop-up.page';

@Component({
  selector: 'app-sa-home',
  templateUrl: './sa-home.page.html',
  styleUrls: ['./sa-home.page.scss'],
})
export class SaHomePage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  currDate: any;
  leaveInfo: any;
  startDate: string;
  endDate: string;
  date: string;
  type: 'string';
  isEditable = false;
  sickLeave: any;
  annualLeave: any;
  fileName: any;

  leaveOnlyCancellable = false;
  leaveCancellableEditable = false;
  leaveOnlyEditable = false;
  leaveObjectFromSummary = false;

  configArray: any;
  monthChangeDate: any;
  dateInputForHolidayList: any;
  swipeMissCount: any;
  calendarCurrentMonth: any;
  isMale = true;

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

  tempDateFromHolidayList;

  options: CalendarComponentOptions;
  editleaveInfoObject: any;
  // tslint:disable-next-line: variable-name
  historyDate_LeaveBal: any;
  // tslint:disable-next-line: variable-name
  historyDate_startDate: any;
  // tslint:disable-next-line: variable-name
  historyDate_endDate: any;
  // tslint:disable-next-line: variable-name
  historyDate_childBirthDate: any;
  // tslint:disable-next-line: variable-name
  historyDate_childAdoptionDate: any;
  isSelectedDateIsClickable = false;
  flagsForButtonsVisibility: any;
  leaveTypeInCurrentUse: any;
  fileToUpload: File = null;
  currDateToDisplay: string;
  isEdgeBrowser: any;
  isFirefoxBrowser: any;
  monthData: any;
  flag = true;
  newMonthDate: any;
  homeMessage: any;

  // tslint:disable-next-line: max-line-length
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public global: GlobalService, public datepipe: DatePipe, public sahomeservice: SaHomeService, public leavesummary: LeaveSummaryService, public calendarCtrl: CalendarController, public modalController: ModalController, public toastCtrl: ToastController, private changeRef: ChangeDetectorRef, public zone: NgZone) {
    this.resetForm();
    this.getHomePageNoticeMessage();
    this.fileName = 'No file chosen';
  }

  private resetForm() {
    this.isEdgeBrowser = /Edge\/\d./i.test(navigator.userAgent);
    this.isFirefoxBrowser = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.flagsForButtonsVisibility = 'clearPreview';

    this.leaveInfo = {
      startDate: '',
      endDate: '',
      leaveType: '',
      leaveSubType: '',
      startHalfDay: '',
      endHalfDay: '',
      employee_Comments: '',
      absence_days: '',
      idToEditLeave: '',
      editLeaveRequest: '',
      attachment_file_name: '',
      attachedFileLink: '',
      isFutureApproved: '',
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
    this.global.showConsoleLog('Current Date', this.currDate);
    this.global.showConsoleLog('Local Storage', localStorage);
    this.global.showConsoleLog('Local Storage AuthToken', this.global.getAuthToken());
    this.global.showConsoleLog('Local Storage fcmToken', localStorage.fcmToken);

    if (this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.global.trackView('LeaveSummaryPageDetail', this.editleaveInfoObject.id);
    } else {
      this.global.trackView('SaHomePage', 'page-sa-home');
    }

    this.global.showConsoleLog('isback:', this.global.getMenuIcon() + ' | ' + this.global.getBackIcon());
    this.global.setSelectedFullDate_StartDate(null);
    this.global.setSelectedFullDate_EndDate(null);
    this.global.setSelectedFullDate_LeaveBal(null);
    this.global.setSelectedFullDate_WorkEndDate(null);
    this.global.setSelectedFullDate_WorkStartDate(null);
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

  getHomePageNoticeMessage() {
    this.global.getHomePageMessage()
      .subscribe(
        res => {
          this.homeMessage = res.SA;
          this.global.showConsoleLog('homeMessage', this.homeMessage.SA);
        }
      );
  }

  getPreview() {
    this.leaveInfo.leaveType == "Work From Home" ? this.leaveInfo.leaveType = "Work From Anywhere" : this.leaveInfo.leaveType
    if ((this.validateLeave() == true) && (!this.leaveObjectFromSummary)) {
      if (this.leaveInfo.leaveType == 'Sick Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.absence_days > 2)) {
          if (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) {
            this.validLeaveContinue();
          } else {
            this.global.showDialogs(false, 'As leave duration is more than 2 days, attachment is mandatory.');
          }
        } else {
          this.validLeaveContinue();
        }
      } else if (this.leaveInfo.leaveType == 'Advance Sick Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.absence_days > 2)) {
          if (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) {
            this.validLeaveContinue();
          } else {
            this.global.showDialogs(false, 'As leave duration is more than 2 days, attachment is mandatory.');
          }
        } else {
          this.validLeaveContinue();
        }
      } else if (this.leaveInfo.leaveType == 'Parental Adoption Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Parental Adoption Leave, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Commissioning Parental') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Commissioning Parental, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Maternity Leave ZA') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Maternity Leave ZA, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Parental Leave ZA') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Parental Leave, Spouse name is mandatory.');
        }
      } else {
        this.validLeaveContinue();
      }
    } else if ((this.validateLeave() == true) && (this.leaveObjectFromSummary == true)) {
      if (this.leaveInfo.leaveType == 'Sick Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.absence_days > 2)) {
          if (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) {
            this.validLeaveContinue();
          } else {
            this.global.showDialogs(false, 'As leave duration is more than 2 days, attachment is mandatory.');
          }
        } else {
          this.validLeaveContinue();
        }
      } else if (this.leaveInfo.leaveType == 'Advance Sick Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.absence_days > 2)) {
          if (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name)) {
            this.validLeaveContinue();
          } else {
            this.global.showDialogs(false, 'As leave duration is more than 2 days, attachment is mandatory.');
          }
        } else {
          this.validLeaveContinue();
        }
      } else if (this.leaveInfo.leaveType == 'Parental Adoption Leave') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Parental Adoption Leave, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Commissioning Parental') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Commissioning Parental, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Maternity Leave ZA') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.attachedFileLink) ||
          (this.global.checkIfDataIsValid(this.fileToUpload) && this.global.checkIfDataIsValid(this.fileToUpload.name))) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'As it is Maternity Leave ZA, attachment is mandatory.');
        }
      } else if (this.leaveInfo.leaveType == 'Parental Leave ZA') {
        if (this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
          this.validLeaveContinue();
        } else {
          this.global.showDialogs(false, 'Spouse name not selected.');
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

  openFile(fileURL) {
    window.open(fileURL);
  }

  initializeData(data) {
    if (data == null) {
      this.clearLeaveForm();
    }

    this.global.showConsoleLog('initializeData 1: data', data);

    if (this.global.checkIfDataIsValid(data)) {
      this.leaveObjectFromSummary = true;

      this.leaveInfo.startHalfDay = data.start_day_half_day;
      this.leaveInfo.startDate = data.START_DATE;
      this.leaveInfo.endDate = data.END_DATE;
      this.leaveInfo.absence_days = data.DURATION;
      this.leaveInfo.employee_Comments = data.employee_leave_comments;
      this.leaveInfo.leaveType = data.LEAVE_TYPE;
      this.leaveInfo.leaveSubtype = data.leave_sub_type;
      this.leaveInfo.endHalfDay = data.end_day_half_day;
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

      if (this.global.checkIfDataIsValid(this.leaveTypeInCurrentUse) &&
        this.global.checkIfDataIsValid(data.LEAVE_TYPE) &&
        (this.leaveTypeInCurrentUse == data.LEAVE_TYPE)) {
        this.calculateDuration('');
      }
    }

    if (this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.global.showConsoleLog('initializeData 2: data', data);

      this.leaveObjectFromSummary = true;

      let startDate_ExpectedFormat, endDate_ExpectedFormat, childAdoptionDate_ExpectedFormat, childBirthDueDate_ExpectedFormat, childAdoptionBirthDueDate_ExpectedFormat;
      startDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.startDateTimeStamp * 1000, 'dd-MMM-yyyy');
      endDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.endDateTimeStamp * 1000, 'dd-MMM-yyyy');
      childAdoptionDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.start_day_half_dayTimestamp * 1000, 'dd-MMM-yyyy');
      childBirthDueDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.start_day_half_dayTimestamp * 1000, 'dd-MMM-yyyy');
      childAdoptionBirthDueDate_ExpectedFormat = this.datepipe.transform(this.editleaveInfoObject.end_day_half_dayTimestamp * 1000, 'dd-MMM-yyyy');
      this.editleaveInfoObject.START_DATE = startDate_ExpectedFormat;
      this.editleaveInfoObject.END_DATE = endDate_ExpectedFormat;
      if (this.editleaveInfoObject.LEAVE_TYPE == 'Adoption Leave' || this.editleaveInfoObject.LEAVE_TYPE == 'Additional Adoption Leave') {
        this.leaveInfo.startHalfDay = childAdoptionDate_ExpectedFormat;
      } else if (this.editleaveInfoObject.LEAVE_TYPE == 'Commissioning Parental') {
        this.leaveInfo.startHalfDay = childBirthDueDate_ExpectedFormat;
      } else if (this.editleaveInfoObject.LEAVE_TYPE == 'Parental Adoption Leave') {
        this.leaveInfo.endHalfDay = childAdoptionBirthDueDate_ExpectedFormat;
        this.leaveInfo.startHalfDay = childAdoptionDate_ExpectedFormat
      }
      this.global.showConsoleLog('this.editleaveInfoObject', this.editleaveInfoObject);

      this.leaveInfo.startDate = this.editleaveInfoObject.START_DATE;
      this.leaveInfo.endDate = this.editleaveInfoObject.END_DATE;

      if (this.editleaveInfoObject.start_day_half_day != null && this.editleaveInfoObject.start_day_half_day != '') {
        this.leaveInfo.startHalfDay = this.editleaveInfoObject.start_day_half_day;
      } else {
        this.leaveInfo.startHalfDay = '';
      }

      this.leaveInfo.endHalfDay = this.editleaveInfoObject.end_day_half_day;
      this.leaveInfo.absence_days = this.editleaveInfoObject.DURATION;

      if (this.editleaveInfoObject.employee_leave_comments != null || this.editleaveInfoObject.employee_leave_comments != undefined) {
        this.leaveInfo.employee_Comments = this.editleaveInfoObject.employee_leave_comments;
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

      // tslint:disable-next-line: max-line-length
      this.flagsForButtonsVisibility = this.getFlagValueForButtonsVisibility(this.editleaveInfoObject.canBeEditedByUser, this.editleaveInfoObject.canBeCancelledByUser);
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
            absence_days: this.editleaveInfoObject.DURATION,
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
    alert.present();
  }

  async successDeleteLeaveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog('successDeleteLeaveCallback Response : ', dataFromApi.ErrorMessage);
      this.global.trackEvent(this.editleaveInfoObject.APPROVAL_STATUS == 'Approved' ?
        'approvedLeaveCancelled' : 'pendingLeaveCancelled', 'SA', this.editleaveInfoObject.id, 0);
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
      this.global.showConsoleLog(' Delete Leave Error : ', dataFromApi.ErrorMessage);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  calculateDurationStartDateHalfDay() {
    if (this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
      this.calculateDuration('');
    }
  }

  calculateDurationEndDateHalfDay() {
    if (this.global.checkIfDataIsValid(this.leaveInfo.endHalfDay)) {
      this.calculateDuration('');
    }
  }

  openStartDateCalendar() {
    this.openCalendarModal('startDate');
  }

  goToSummary() {
    this.global.pushNewPage(LeaveSummaryPage, '');
  }

  openEndDateCalendar() {
    this.openCalendarModal('endDate');
  }

  openChildBirthDueDate() {
    this.openCalendarModal('childBirthDueDate');
  }


  openChildAdoptionBirthDueDate() {
    this.openCalendarModal('childAdoptionBirthDueDate');
  }

  openChildAdoptionDateCalendar() {
    this.openCalendarModal('childAdoptionDate');
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

  onChange(value) {
    this.global.showConsoleLog('Basic Calender', value);
  }

  checkNameContactDescription(str) {
    if (str != undefined && str != null && str != '' && str != '' && str != 'null') {
      return true;
    } else {
      return false;
    }
  }

  confirmLeave() {
    if (this.validateLeave() == true) {
      this.calculateDuration(false);
    }
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

  calCulateBalanceLeaves() {
    this.openCalendarModal('LeaveBal');
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
        this.sahomeservice.calculateLeaves(req)
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
      this.sickLeave = dataFromApi.SickLeave;
      this.annualLeave = dataFromApi.AnnualLeave;
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
  checkIfStartDayHalfDay(){
    
  return  this.leaveInfo.leaveType == 'Sick Leave' || this.leaveInfo.leaveType == "Advance Sick Leave" || this.leaveInfo.leaveType == "Annual Leave" ?  this.leaveInfo.startHalfDay : '' 
 }
 checkIfEndDayHalfDay(){
  
return  this.leaveInfo.leaveType == 'Sick Leave' || this.leaveInfo.leaveType == "Advance Sick Leave" || this.leaveInfo.leaveType == "Annual Leave" ?  this.leaveInfo.endHalfDay : '' 
}
  applyLeave() {
    
    this.leaveInfo.leaveType == "Work From Anywhere" ? this.leaveInfo.leaveType = "Work From Home" : this.leaveInfo.leaveType

    if (this.validateLeave() == true) {

      const formData = new FormData();

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
      formData.append('start_day_half_day', this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay) ?  this.checkIfStartDayHalfDay() : '');
      formData.append('end_day_half_day', this.global.checkIfDataIsValid(this.leaveInfo.endHalfDay) ?  this.checkIfEndDayHalfDay() : '');
      formData.append('leave_start_date', this.leaveInfo.startDate);
      formData.append('leave_end_date', this.leaveInfo.endDate);
      formData.append('idToEditLeave', ((this.global.checkIfDataIsValid(this.editleaveInfoObject)) &&
        (this.global.checkIfDataIsValid(this.editleaveInfoObject.id))) ? this.leaveInfo.idToEditLeave : '');
      formData.append('leave_type', this.leaveInfo.leaveType);
      formData.append('leave_sub_type', this.leaveInfo.leaveType == 'Parental Leave ZA' ? 'Parental Leave ZA' : '');
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
      this.sahomeservice.submitFile(formData)
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
        this.global.trackEvent('leaveApplied', 'SA', this.global.getUserId(), 0);
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
        alert.present();
      } else {
        this.global.trackEvent('leaveEdited', 'SA', this.global.getUserId(), 0);
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

  monthChange(changeValue) {
    this.global.showConsoleLog('New Month', changeValue);
    this.newMonthDate = changeValue.newMonth.string;
    this.monthChangeDate = this.newMonthDate;
    this.dateInputForHolidayList = changeValue.newMonth.string;
    this.global.showConsoleLog('New Month Date Formatted', this.newMonthDate);
    this.configureCalendar();
    this.getCalenderConfigDates(this.newMonthDate);
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
        this.sahomeservice.getcalenderconfigdates(req)
          .subscribe(
            configDatesData => {
              this.successCallbackConfigDates(configDatesData);
              this.monthData = configDatesData;
              this.global.hideProgressBar();
              this.global.showConsoleLog('Config Dates', configDatesData);
            },
            (error) => {
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  getCalenderConfigDatesAfterNewLeave(cDate) {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        userLocation: localStorage.userCountry,
        checkBalanceDate: cDate
      };

      this.global.showConsoleLog('getCalenderConfigDatesAfterNewLeave Request', req);
      if (req) {
        this.sahomeservice.getcalenderconfigdates(req)
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

  successCallbackConfigDates(dataFromApi) {
    this.global.showConsoleLog('Config Dates API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog('Success:', dataFromApi.ErrorMessage);
      this.configArray = dataFromApi.daysConfig;
      this.swipeMissCount = dataFromApi.SwipeMissCount;
      this.calendarCurrentMonth = dataFromApi.currentMonth;
      this.getCalConfigData();
      this.global.showConsoleLog('Get Config Array ', this.configArray);
      this.global.showConsoleLog('Swipe Miss Count :', this.swipeMissCount);

    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
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
    }


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
            case 'Sick_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Sick_Leave marked';
              break;
            }
            case 'Annual_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Annual_Leave marked';
              break;
            }
            case 'Other_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Other_Leave marked';
              break;
            }
            case 'Fixed_Holiday': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Fixed_Holiday marked';
              break;
            }
            case 'Advance_Sick_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Advance_Sick_Leave marked';
              break;
            }
            case 'Optional_Holidays': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Optional_Holidays marked';
              break;
            }
            case 'Other_Leave': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Other_Leave marked';
              break;
            }
            case 'Work_From_Home': {
              document.getElementsByClassName('days-btn')[applyStyle[j]].className = 'days-btn Work_From_Home marked';
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

  onDateSelect(value) {
    if (!this.global.checkIfDataIsValid(this.editleaveInfoObject)) {
      this.clearLeaveForm();
      this.isEditable = false;
      this.isSelectedDateIsClickable = true;
      const calendarDate = moment(new Date(value.time)).format('DD-MMM-YYYY');
      if (this.configArray.length > 0) {
        this.configArray.forEach(element => {
          if (calendarDate == element.EdgeFormatDate) {
            if ((element.canBeEditedByUser == true || element.cssClass == 'Swipe_Miss')) {
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
            START_DATE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ?
              this.tempDateFromHolidayList.START_DATE : calendarDate,
            END_DATE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ? this.tempDateFromHolidayList.END_DATE : calendarDate,
            LEAVE_TYPE: this.global.checkIfDataIsValid(this.tempDateFromHolidayList) ? this.tempDateFromHolidayList.LEAVE_TYPE : '',
            leave_sub_type: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.leave_sub_type))) ?
              this.tempDateFromHolidayList.leave_sub_type : '',
            start_day_half_day: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.start_day_half_day))) ?
              this.tempDateFromHolidayList.start_day_half_day : '',
            end_day_half_day: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.end_day_half_day))) ?
              this.tempDateFromHolidayList.end_day_half_day : '',
            employee_leave_comments: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.employee_leave_comments))) ?
              this.tempDateFromHolidayList.employee_leave_comments : '',
            DURATION: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.DURATION))) ? this.tempDateFromHolidayList.DURATION : '',
            id: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.id))) ? this.tempDateFromHolidayList.id : '',
            attachment_file_name: (this.global.checkIfDataIsValid(this.tempDateFromHolidayList) &&
              (this.global.checkIfDataIsValid(this.tempDateFromHolidayList.attachment_file_name))) ?
              this.tempDateFromHolidayList.attachment_file_name : ''
          };

          this.isEditable = true;
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
    this.fileName = this.fileToUpload.name;
  }


  // Check Selected Leave Type
  selectedLeaveType(leaveType) {
    
    this.leaveInfo.leaveType == "Work From Anywhere" ? this.leaveInfo.leaveType = "Work From Home" : this.leaveInfo.leaveType   
    this.calculateDuration('');

    this.leaveTypeInCurrentUse = this.leaveInfo.leaveType;

    this.leaveInfo.startDate = this.global.checkIfDataIsValid(this.leaveInfo.startDate) ? this.leaveInfo.startDate : '';
    this.leaveInfo.endDate = this.global.checkIfDataIsValid(this.leaveInfo.endDate) ? this.leaveInfo.endDate : '';

    this.fileName = '';
    delete this.fileToUpload;

    if ((leaveType == 'Annual Leave' || leaveType == 'Sick Leave' || leaveType == 'Work From Home') &&
      this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
      this.calculateDuration('');
    }

    // Apdoption Date Mandatory 
    if ((leaveType == 'Parental Adoption Leave') &&
      this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
      this.calculateDuration('');
    }

    // Child BirthDate Mandatory 
    if ((leaveType == 'Commissioning Parental') &&
      this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
      this.calculateDuration('');
    }

    // Only StartDate & endDate 
    if ((leaveType == 'Family Responsibility Leave' ||
      leaveType == 'Advance Sick Leave' ||
      leaveType == 'Loss of Pay' ||
      leaveType == 'Parental Leave ZA' ||
      leaveType == 'Work From Home'||
      leaveType == 'Maternity Leave ZA') &&
      this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
      this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
      this.calculateDuration('');
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
            leave_sub_type: this.leaveInfo.leaveSubtype,
            start_day_half_day: this.leaveInfo.startHalfDay,
            end_day_half_day: this.leaveInfo.endHalfDay,
            idToEditLeave: this.leaveInfo.idToEditLeave
          };

          this.global.showConsoleLog('Request', req);
          if (req) {
            this.global.showProgressBar();
            this.sahomeservice.calculateDuration(req)
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

  clearLeaveForm() {
    this.leaveInfo.absence_days = '';
    this.leaveInfo.employee_Comments = '';
    this.leaveInfo.endDate = '';
    this.leaveInfo.endHalfDay = '';
    this.leaveInfo.leaveDuration = '';
    this.leaveInfo.leaveType = '';
    this.leaveInfo.startDate = '';
    this.leaveInfo.startHalfDay = '';
    this.leaveInfo.idToEditLeave = '';
    delete this.fileToUpload;
    this.editleaveInfoObject = null;
    this.tempDateFromHolidayList = null;
    this.zone.run(() => this.global.router.navigate(['/sa-home'], { skipLocationChange: true }));
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

    if (from == 'childBirthDueDate') {
      if (this.leaveInfo.start_day_half_day != '' && this.leaveInfo.start_day_half_day != undefined) {
        const startDayHalfDay = this.leaveInfo.start_day_half_day.split('-');
        const startDayHalfMonthNum = this.getMonthNumber(startDayHalfDay[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(startDayHalfDay[2]), startDayHalfMonthNum, parseInt(startDayHalfDay[0]));
      }
    }

    if (from == 'childAdoptionBirthDueDate') {
      if (this.leaveInfo.end_day_half_day != '' && this.leaveInfo.end_day_half_day != undefined) {
        const endDayHalfDay = this.leaveInfo.end_day_half_day.split('-');
        const endDayHalfMonthNum = this.getMonthNumber(endDayHalfDay[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(endDayHalfDay[2]), endDayHalfMonthNum, parseInt(endDayHalfDay[0]));
      }
    }

    if (from == 'childAdoptionDate') {
      if (this.leaveInfo.end_day_half_day != '' && this.leaveInfo.end_day_half_day != undefined) {
        const endDayHalfDay = this.leaveInfo.end_day_half_day.split('-');
        const endDayHalfMonthNum = this.getMonthNumber(endDayHalfDay[1]);
        // tslint:disable-next-line: radix
        dataToPass.selectedDate = new Date(parseInt(endDayHalfDay[2]), endDayHalfMonthNum, parseInt(endDayHalfDay[0]));
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
      cssClass: 'calendarModal'
    });

    modalPage.onDidDismiss().then(data => {
      if (this.global.checkIfDataIsValid(data.data)) {
        if (from == 'startDate') {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.startDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          if ((this.leaveInfo.leaveType == 'Annual Leave' ||
            this.leaveInfo.leaveType == 'Family Responsibility Leave' ||
            this.leaveInfo.leaveType == 'Loss of Pay' ||
            this.leaveInfo.leaveType == 'Sick Leave' ||
            this.leaveInfo.leaveType == 'Parental Leave ZA' ||
            this.leaveInfo.leaveType == 'Advance Sick Leave' ||
            this.leaveInfo.leaveType == 'Work From Home' ||
            this.leaveInfo.leaveType == 'Maternity Leave ZA') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate)) {
            this.calculateDuration('');
          }

          // Apdoption Date Mandatory 
          if ((this.leaveInfo.leaveType == 'Parental Adoption Leave') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay) &&
            this.global.checkIfDataIsValid(this.leaveInfo.endHalfDay)) {
            this.calculateDuration('');
          }

           // Child BirthDate Mandatory 
          if ((this.leaveInfo.leaveType == 'Commissioning Parental') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
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
        } else if (from == 'childBirthDueDate') {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.startHalfDay = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          if ((this.leaveInfo.leaveType == 'Commissioning Parental') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate)) {
            this.calculateDuration('');
          }
        } else if (from == 'childAdoptionBirthDueDate') {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) {
            this.leaveInfo.endHalfDay = this.datepipe.transform(data.data, 'dd-MMM-yyyy');
          }

          if ((this.leaveInfo.leaveType == 'Parental Adoption Leave') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.endHalfDay)) {
            this.calculateDuration('');
          }
        } else if (from == 'childAdoptionDate') {
          this.leaveInfo.startHalfDay = this.datepipe.transform(data.data, 'dd-MMM-yyyy');

          if ((this.leaveInfo.leaveType == 'Parental Adoption Leave') &&
            this.global.checkIfDataIsValid(this.leaveInfo.endDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
            this.calculateDuration('');
          }
        } else {
          data.data = new Date(data.data);

          if (!isNaN(data.data.getTime())) { this.leaveInfo.endDate = this.datepipe.transform(data.data, 'dd-MMM-yyyy'); }

          if ((this.leaveInfo.leaveType == 'Annual Leave' ||
            this.leaveInfo.leaveType == 'Family Responsibility Leave' ||
            this.leaveInfo.leaveType == 'Loss of Pay' ||
            this.leaveInfo.leaveType == 'Sick Leave' ||
            this.leaveInfo.leaveType == 'Parental Leave ZA' ||
            this.leaveInfo.leaveType == 'Advance Sick Leave' ||
            this.leaveInfo.leaveType == 'Work From Home' ||
            this.leaveInfo.leaveType == 'Maternity Leave ZA') &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate)) {
            this.calculateDuration('');
          }

          // Apdoption Date Mandatory
          if ((this.leaveInfo.leaveType == 'Parental Adoption Leave') &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay) &&
            this.global.checkIfDataIsValid(this.leaveInfo.endHalfDay)) {
            this.calculateDuration('');
          }

           // Child BirthDate Mandatory
          if ((this.leaveInfo.leaveType == 'Commissioning Parental') &&
            this.global.checkIfDataIsValid(this.leaveInfo.startDate) &&
            this.global.checkIfDataIsValid(this.leaveInfo.startHalfDay)) {
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
