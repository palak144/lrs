import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { LeaveApprovalDetailPage } from './leave-approval-detail/leave-approval-detail.page';
import { LeaveApprovalService } from './leave-approval.service';
import { LeaveApprovalDetailService } from './leave-approval-detail/leave-approval-detail.service';
import { LeaveShowMorePopupPage } from 'src/app/controls/leave-show-more-popup/leave-show-more-popup.page';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.page.html',
  styleUrls: ['./leave-approval.page.scss'],
})
export class LeaveApprovalPage implements OnInit {

  leaveHistory: any;
  leaveHistoryLength: any;
  paginationButtonCount: any;
  recordCount: any;
  pager: any = {};
  pagedItems: any[];
  tempPagedArray: any[];
  pages: any = [];
  isHide: any = false;
  searchText: string;

  // tslint:disable-next-line: max-line-length
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public datepipe: DatePipe, public global: GlobalService, public leaveApprovalService: LeaveApprovalService, public popoverCtrl: PopoverController, public leaveApprovalDetailService: LeaveApprovalDetailService, public zone: NgZone) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
    let dataFromPreviousPage;
    //dataFromPreviousPage = this.navParams.get('navParamsFromPreviousPage');

    if (this.global.checkIfDataIsValid(dataFromPreviousPage) && dataFromPreviousPage.ErrorCode == 1) {
      this.global.showDialogs(false, dataFromPreviousPage.ErrorMessage);
    }

    this.global.trackView("LeaveApprovalPage", "leaveApprovalPage");
    this.initializeApp();
  }

  initializeApp() {
    this.global.showProgressBar();
    this.tempPagedArray = [];
    this.global.setPageTitle('Leave Approval');
    this.pendingLeaveApprovals();
    this.recordCount = 15;
    this.paginationCount();
    this.global.hideProgressBar();
  }

  pendingLeaveApprovals() {
    const req = {
      user_id: this.global.getUserId(),
      authToken: this.global.getAuthToken(),
      userLocation: localStorage.userCountry
    };

    if (req) {
      this.global.showConsoleLog('req', JSON.stringify(req));
      this.leaveApprovalService.pendingLeavesApprovals(req)
        .subscribe(
          pendingLeaveSummaryData => {
            this.successCallback(pendingLeaveSummaryData);
          },
          (error) => {
            this.global.showConsoleLog('error', error);
            this.global.showDialogs(false, error.ErrorMessage);
          });
    }
  }

  successCallback(dataFromApi) {
    
    if (this.global.checkIfDataIsValid(dataFromApi)) {
      if (dataFromApi.ErrorCode == 0) {
        this.leaveHistory = dataFromApi.pendingApprovalLeaves;
         //change for work from anywhere
       this.leaveHistory.forEach(v => {
        if (v.LEAVE_TYPE === "Work From Home") v.LEAVE_TYPE = "Work From Anywhere";
      });
        this.leaveHistoryLength = this.leaveHistory.length;
        this.setPage(1);
        this.paginationCount();
      } else if (dataFromApi.ErrorCode == 3) {
        this.pagedItems = [];
        //this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      } else if (dataFromApi.ErrorCode == 5) {
        this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
        localStorage.clear();
      } else {
        // this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
        this.global.showDialogs(false, dataFromApi.ErrorMessage);

      }
      this.zone.run(() => this.global.router.navigate(['/leave-approval'], { skipLocationChange: true }));
    }
  }

  getRecordsCount(value) {
    this.recordCount = value;
    // this.from = 0;
    // this.to = value;
    this.paginationCount();

    this.setPage(1);
  }

  paginationCount() {
    this.pages = [];
    if (this.global.checkIfDataIsValid(this.recordCount) && this.global.checkIfDataIsValid(this.leaveHistoryLength)) {
      const remainder = this.leaveHistoryLength / this.recordCount;
      this.global.showConsoleLog('Remainder', remainder);
      if (remainder > 0) {
        this.paginationButtonCount = Math.round(remainder + 1);
      } else {
        this.paginationButtonCount = 1;
      }

      for (var v = 1; v <= this.paginationButtonCount; v++) {
        this.pages[v - 1] = v;
      }
      this.global.showConsoleLog('Pagination Button Count', this.paginationButtonCount + JSON.stringify(this.pages));
    }
  }

  setPage(page: number) {
    // get pager object from service
    
    this.pager = this.leaveApprovalService.getPager(this.leaveHistory.length, page, this.recordCount);
    // get current page of items
    /*Bug fixes by Bhushan : 07-03-2019*/
    // this.pagedItems = this.leaveHistory.slice(this.pager.startIndex, this.pager.endIndex + 1);

    let tempPagedItems;
    tempPagedItems = this.leaveHistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
    tempPagedItems.forEach(element => {
      if (this.global.checkIfDataIsValid(element.startDateTimeStamp)) {
        element.START_DATE = this.datepipe.transform(element.startDateTimeStamp * 1000, 'dd-MMM-yyyy');
      }

      if (this.global.checkIfDataIsValid(element.endDateTimeStamp)) {
        element.END_DATE = this.datepipe.transform(element.endDateTimeStamp * 1000, 'dd-MMM-yyyy');
      }
    });

    tempPagedItems.forEach(element => {
      element.showLeaveCancelledMessage = false;
    });
    this.pagedItems = tempPagedItems;
    this.tempPagedArray = this.pagedItems;
    this.global.showConsoleLog('Paged items: ', this.pagedItems);
  }

  getUserSpecificLeaves() {
    
    this.pagedItems = this.filterData();
  }

  filterData() {
    return this.tempPagedArray.filter((leave) => {
      return leave.EMPLOYEE_NAME.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
    });
  }

  goToApprovalDetailPage(leaveData) {
    this.global.showConsoleLog('goToApprovalDetailPage', leaveData);

    this.global.isFromLeaveApprovalPage = true;

    if (this.global.checkIfDataIsValid(this.leaveHistory)) {
      this.global.setMenuBackVisibility(false, true);
      this.global.pushNewPage('/leave-approval-detail', {
        isFromEmail: true,
        leaveApprovalDetailObject: leaveData
      });
    } else {
      this.global.showDialogs(false, 'Error');
    }
  }

  async showMoreOption(leaveObject: any, ev) {
    leaveObject.fromPage = 'approval';

    // let popover = this.popoverCtrl.create(LeaveShowMorePopup, leaveObject, {
    //   showBackdrop: true,
    //   enableBackdropDismiss: true
    // });

    const componentProps = this.global.setNavData(leaveObject);

    const popover = await this.popoverCtrl.create({
      component: LeaveShowMorePopupPage,
      componentProps: { componentProps },
      showBackdrop: true,
      backdropDismiss: true,
      event: ev
    });

    popover.onDidDismiss().then(async (dataFromPopUp) => {
      this.global.showConsoleLog('showMoreOption-onDidDismiss:', dataFromPopUp);
      if (this.global.checkIfDataIsValid(dataFromPopUp) && (dataFromPopUp.data.fromPage == 'approval')) {
        //this.initializeApp();
        if (dataFromPopUp.data.isApprove) {
          dataFromPopUp.data.LEAVE_TYPE == "Work From Anywhere" ? dataFromPopUp.data.LEAVE_TYPE = "Work From Home" : dataFromPopUp.data.LEAVE_TYPE

          //call approval api
          if (dataFromPopUp.data.is_cancel_request == '1') {
            const alert = await this.alertCtrl.create({
              header: this.global.getAlertTitle(),
              message: 'Do you want to approve this cancellation of leave?',
              backdropDismiss: false,
              buttons: [{
                text: 'Ok',
                role: 'Ok',
                handler: () => {
                  // if(dataFromPopUp.is_cancel_request == '1') {
                  this.approveLeaveCancellation(dataFromPopUp);
                  // } else {
                  //   this.approve(dataFromPopUp);
                  // }
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
          } else {
            const alert = await this.alertCtrl.create({
              header: this.global.getAlertTitle(),
              message: 'Do you want to approve this leave?',
              backdropDismiss: false,
              buttons: [{
                text: 'Ok',
                role: 'Ok',
                handler: () => {
                  this.approve(dataFromPopUp);
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
        } else {
          /*Suggestion by Ashvini : 26-03-19*/
          const alert = await this.alertCtrl.create({
            header: this.global.getAlertTitle(),
            message: 'Please provide your comments.',
            inputs: [
              {
                name: 'managerComments',
                placeholder: 'Comments',
                type: 'text'
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: data => {
                  this.global.showConsoleLog('Cancel clicked', '');
                }
              },
              {
                text: 'Reject',
                handler: data => {
                  if (this.global.checkIfDataIsValid(data.managerComments)) {
                    dataFromPopUp.data.manager_comments = data.managerComments;
                    this.rejectLeave(dataFromPopUp);
                  } else {
                    //alert.setSubTitle('Please provide your comments.*');
                    return false;
                  }
                }
              }
            ]
          });
          alert.present();
        }
      }
    });

    // popover.present({
    //   ev: event
    // });

    await popover.present();

  }

  approve(data) {
    
    if (this.global.checkIfDataIsValid(data.data)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        leave_start_date: data.data.START_DATE,
        leave_end_date: data.data.END_DATE,
        employee_leave_comments: data.data.employee_leave_comments,
        absence_hours: (data.data.location == 'US') ? data.data.DURATION : '',
        absence_days: (data.data.location !== 'US') ? data.data.DURATION : '',
        leave_type: data.data.LEAVE_TYPE,
        leave_sub_type: data.data.leave_sub_type,
        start_day_half_day: this.global.checkIfDataIsValid(data.data.start_day_half_day) ? data.data.start_day_half_day : '',
        end_day_half_day: this.global.checkIfDataIsValid(data.data.end_day_half_day) ? data.data.end_day_half_day : '',
        employee_number: data.data.EMPLOYEE_NUMBER,
        idToEditLeave: data.data.id,
        approver_id: data.data.APPROVER_ID,
        start_time: (data.data.location == 'US') ? data.data.START_TIME : '',
        end_time: (data.data.location == 'US') ? data.data.END_TIME : '',
        userLocation: data.data.location
      };

      this.global.showConsoleLog('Approve Request', req);

      if (req) {
        this.global.showProgressBar();
        this.global.showConsoleLog('Leave Approve - req', JSON.stringify(req));
        this.leaveApprovalDetailService.approveLeave(req)
          .subscribe(
            leaveapprovedata => {
              this.global.hideProgressBar();
              this.global.trackEvent("leaveApproved", data.location, data.id, 0);
              this.successApproveCallback(leaveapprovedata);
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('Leave Approve - error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  approveLeaveCancellation(data) {
    
    if (this.global.checkIfDataIsValid(data.data)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        leave_start_date: data.data.START_DATE,
        leave_end_date: data.data.END_DATE,
        // "isFutureApproved":"Y",
        isFutureApproved: data.data.APPROVAL_STATUS == 'Approved' ? 'Y' : 'N',
        employee_leave_comments: data.data.employee_leave_comments,
        manager_comments: data.data.manager_comments,
        absence_hours: (data.data.location == 'US') ? data.data.DURATION : '',
        absence_days: (data.data.location != 'US') ? data.data.DURATION : '',
        leave_type: data.data.LEAVE_TYPE,
        leave_sub_type: this.global.checkIfDataIsValid(data.data.leave_sub_type) ? data.data.leave_sub_type : '', /*After discussion with Sandeep, Bhushan assigned proper values to leave_sub_type : 22-02-2019*/
        start_day_half_day: this.global.checkIfDataIsValid(data.data.start_day_half_day) ? data.data.start_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to start_day_half_day : 22-02-2019*/
        // end_day_half_day: data.data.LEAVE_TYPE == 'Compensatory Leave' ? data.data.start_day_half_day : data.data.end_day_half_day, /*After discussion with Sandeep, Bhushan assigned proper values to end_day_half_day : 22-02-2019*/
        end_day_half_day: data.data.LEAVE_TYPE == 'Compensatory Leave' ? data.data.start_day_half_day :  this.global.checkIfDataIsValid(data.data.end_day_half_day) ? data.data.end_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to end_day_half_day : 22-02-2019*/
        employee_number: data.data.EMPLOYEE_NUMBER,
        approver_id: data.data.APPROVER_ID, /*Corrected the attribute name : Bhushan 22-02-2019*/
        start_time: (data.data.location == 'US') ? data.data.START_TIME : '',
        end_time: (data.data.location == 'US') ? data.data.END_TIME : '',
        userLocation: data.data.location,
        idToEditLeave: data.data.id
      }
      if (req) {
        this.global.showProgressBar();
        this.leaveApprovalDetailService.approveLeaveCancellation(req)
          .then(
            leaveapprovedata => {
              this.global.hideProgressBar();
              this.global.trackEvent("leaveCancellationApproved", data.location, data.id, 0);
              this.successApproveCallback(leaveapprovedata);
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('approveLeaveCancellation - error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successApproveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog(' Approve Date Leave Response : ', dataFromApi);
      this.showDialogs(dataFromApi.ErrorMessage);
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showConsoleLog(' Approve Date Leave Response : ', dataFromApi);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  rejectLeave(data) {
    
    if (this.global.checkIfDataIsValid(data.data)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        leave_start_date: data.data.START_DATE,
        leave_end_date: data.data.END_DATE,
        employee_leave_comments: data.data.employee_leave_comments,
        manager_comments: data.data.manager_comments,
        absence_hours: (data.data.location == 'US') ? data.data.DURATION : '',
        absence_days: (data.data.location !== 'US') ? data.data.DURATION : '',
        leave_type: data.data.LEAVE_TYPE,
        leave_sub_type: data.data.leave_sub_type,
        start_day_half_day: this.global.checkIfDataIsValid(data.data.start_day_half_day) ? data.data.start_day_half_day : '',
        end_day_half_day: this.global.checkIfDataIsValid(data.data.end_day_half_day) ? data.data.start_day_half_day : '',
        employee_number: data.data.EMPLOYEE_NUMBER,
        approver_id: data.data.APPROVER_ID,
        start_time: (data.data.location == 'US') ? data.data.START_TIME : '',
        end_time: (data.data.location == 'US') ? data.data.END_TIME : '',
        userLocation: data.data.location
      };

      this.global.showConsoleLog('rejectLeave - req json', req);

      if (req) {
        this.global.showProgressBar();
        this.leaveApprovalDetailService.rejectLeave(req)
          .subscribe(
            leavearejectdata => {
              this.global.hideProgressBar();
              this.global.trackEvent("leaveRejected", data.location, data.id, 0);
              this.global.showConsoleLog('leavearejectdata', leavearejectdata);
              this.successRejectApproveCallback(leavearejectdata);
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('Leave Reject Data - error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successRejectApproveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog(' Reject Data Leave Response : ', dataFromApi);
      this.showDialogs(dataFromApi.ErrorMessage);
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showConsoleLog(' Reject Data Leave Response : ', dataFromApi);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  async showDialogs(message) {
    const alert = await this.alertCtrl.create({
      header: this.global.ALART_TITLE,
      message,
      backdropDismiss: false,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          this.global.showConsoleLog('OK clicked', '');
          this.initializeApp();
        }
      }]
    });
    await alert.present();
  }
}
