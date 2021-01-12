import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { LeaveApprovalDetailService } from './leave-approval-detail.service';
import { LeaveApprovalPage } from '../leave-approval.page';
import * as moment from 'moment';
import { HomeService } from '../../home/home.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-leave-approval-detail',
  templateUrl: './leave-approval-detail.page.html',
  styleUrls: ['./leave-approval-detail.page.scss'],
})
export class LeaveApprovalDetailPage implements OnInit {

  leaveInfo: any;
  leaveInfoObject: any;
  canBeCancelled: boolean = false;
  isFlexiLeave: boolean = false;
  paramsFromPrevPage: any;

  // tslint:disable-next-line: max-line-length
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public global: GlobalService, public leaveApprovalService: LeaveApprovalDetailService, public homeservice: HomeService, public notificationService: NotificationsService) {
    this.resetForm();
  }

  private resetForm() {
    this.leaveInfo = {
      startDate: '',
      endDate: '',
      leaveStatus: '',
      leaveType: '',
      leaveSubtype: '',
      leaveDuration: '',
      startHalfDay: '',
      endHalfDay: '',
      employee_Comments: '',
      absence_days: '',
      employee_name: '',
      employee_ID: '',
      career_stream: '',
      practice: '',
      manager_comments: '',
      attachment_file_name: '',
      attachment_file_link: '',
      location: ''
    };

    this.leaveInfoObject = this.global.getNavData().leaveApprovalDetailObject;
    this.global.showConsoleLog('Leave Approval Object ', this.leaveInfoObject);
    // console.log('Leave Approval Object 1', this.leaveInfoObject);
    this.leaveCancelCheck();
    this.initializeData();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.resetForm();
    this.global.trackView('LeaveApprovalDetailPage', this.leaveInfoObject.id);
    this.paramsFromPrevPage = this.global.getNavData().leaveApprovalDetailObject;
    this.paramsFromPrevPage.isFromEmail = this.global.getNavData().isFromEmail;

    if (this.global.checkIfDataIsValid(this.paramsFromPrevPage) && this.paramsFromPrevPage.isFromEmail == true) {
      this.global.setMenuBackVisibility(false, true);
      this.global.setPageTitle('Leave Approval');
      this.leaveBalance();
      this.getMenusForFromEmailUser();
    }
  }

  getMenusForFromEmailUser() {
    this.global.getMenu()
      .subscribe(
        menuData => {
          this.global.showConsoleLog('menuData:', menuData);
          if (this.global.checkIfDataIsValid(menuData.MenuList) && menuData.MenuList.length > 0) {
            this.global.setSideMenuItems(menuData.MenuList);
            if (this.global.checkIfDataIsValid(localStorage.fcmToken) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
              // this.registerDeviceToken();
            }
            this.global.setUserProfilePic(menuData.profilePicURL);
          } else {
            this.global.clearLocalStorage();
            this.global.showDialogs(false, this.global.NETWORK_ERROR);
          }
        },
        (error) => {
          this.global.clearLocalStorage();
          this.global.showConsoleLog('error', error);
          this.global.showDialogs(false, error.ErrorMessage);
        });
  }

  ionViewWillEnter() {
    this.initializeData();
    this.global.location.replaceState('/');
  }

  leaveBalance() {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      const req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        checkBalanceDate: moment(new Date(), 'DD-MMM-YYYY'),
        userLocation: localStorage.userCountry
      };

      if (req) {
        // this.global.showProgressBar();
        this.global.showConsoleLog('req', JSON.stringify(req));
        this.homeservice.calculateLeaves(req)
          .subscribe(
            calculateserviceData => {
              this.successCallbackLeaveBalance(calculateserviceData);
            },
            (error) => {
              // this.global.hideProgressBar();
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successCallbackLeaveBalance(dataFromApi) {
    this.global.showConsoleLog('Verify API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {
      this.global.encryptMessage(dataFromApi.locationName, this.global.publicKey).then(cipherTextLocation => {
        localStorage.locationName = cipherTextLocation;

        this.global.decryptMessage(this.global.ciphertext, this.global.privateKey).then(plainTextLocation => {
          this.global.showConsoleLog('Location ', plainTextLocation);
          this.global.setUserLocation(plainTextLocation);
        });
      });
    }
  }

  leaveCancelCheck() {
    if (this.global.checkIfDataIsValid(this.leaveInfoObject)) {
      this.canBeCancelled = this.leaveInfoObject.canBeRejected;
      this.global.showConsoleLog('Can Be Cancelled :', this.canBeCancelled);
    }
  }

  initializeData() {
    if (this.global.checkIfDataIsValid(this.leaveInfoObject)) {
      this.leaveInfo.employee_name = this.leaveInfoObject.EMPLOYEE_NAME;
      this.leaveInfo.employee_ID = this.leaveInfoObject.EMPLOYEE_NUMBER;
      this.leaveInfo.career_stream = this.leaveInfoObject.EMPLOYEE_NUMBER;
      this.leaveInfo.practice = this.leaveInfoObject.EMPLOYEE_NUMBER;

      this.leaveInfo.startDate = this.leaveInfoObject.START_DATE;
      this.leaveInfo.endDate = this.leaveInfoObject.END_DATE;
      this.leaveInfo.leaveStatus = this.leaveInfoObject.LEAVE_STATUS;
      this.leaveInfo.leaveDuration = this.leaveInfoObject.DURATION;

      if (this.leaveInfoObject.employee_leave_comments != null || this.leaveInfoObject.employee_leave_comments != undefined) {
        this.leaveInfo.employee_Comments = this.leaveInfoObject.employee_leave_comments;
      } else {
        this.leaveInfo.employee_Comments = '';
      }

      this.leaveInfo.leaveType = this.leaveInfoObject.LEAVE_TYPE;
      this.leaveInfo.startHalfDay = this.leaveInfoObject.start_day_half_day; /*Approval Bug fixes by Bhushan : 05-03-2019*/
      this.leaveInfo.endHalfDay = this.leaveInfoObject.end_day_half_day; /*Approval Bug fixes by Bhushan : 05-03-2019*/
      // tslint:disable-next-line: max-line-length
      this.leaveInfo.is_cancel_request = this.global.checkIfDataIsValid(this.leaveInfoObject.is_cancel_request) ? this.leaveInfoObject.is_cancel_request : '';
      // tslint:disable-next-line: max-line-length
      this.leaveInfo.cancelRequestMessage = this.global.checkIfDataIsValid(this.leaveInfoObject.cancelRequestMessage) ? this.leaveInfoObject.cancelRequestMessage : '';
      this.leaveInfo.attachment_file_link = this.leaveInfoObject.attachment_file_name;

      if (this.global.checkIfDataIsValid(this.leaveInfoObject.attachment_file_name)) {
        const index = this.leaveInfoObject.attachment_file_name.indexOf('s/');
        this.leaveInfo.attachment_file_name = this.leaveInfoObject.attachment_file_name.substring(index + 2);
      }

      if (this.notificationService.isFromNotification) {
        this.leaveInfo.location = this.leaveInfoObject.userLocation;
      } else {
        this.leaveInfo.location = this.leaveInfoObject.location;
      }

      //console.log('this.leaveInfo.location', this.leaveInfo.location);
    }
  }

  async reject() {
    if (this.global.checkIfDataIsValid(this.leaveInfoObject)) {
      if (this.global.checkIfDataIsValid(this.leaveInfo.manager_comments)) {
        const alert = await this.alertCtrl.create({
          header: this.global.getAlertTitle(),
          message: 'Do you want to reject this leave?',
          backdropDismiss: false,
          buttons: [{
            text: 'Ok',
            role: 'Ok',
            handler: () => {
              const req = {
                isFutureApproved: this.leaveInfoObject.APPROVAL_STATUS == 'Approved' ? 'Y' : 'N',
                absence_hours: (this.leaveInfo.location == 'US') ? this.leaveInfo.leaveDuration : '',
                absence_days: (this.leaveInfo.location != 'US') ? this.leaveInfo.leaveDuration : '',
                start_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.START_TIME : '',
                end_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.END_TIME : '',
                userLocation: this.leaveInfo.location,
                user_id: this.global.getUserId(),
                authToken: this.global.getAuthToken(),
                leave_start_date: this.leaveInfo.startDate,
                leave_end_date: this.leaveInfo.endDate,
                employee_leave_comments: this.leaveInfo.employee_Comments,
                employee_number: this.leaveInfoObject.EMPLOYEE_NUMBER,
                leave_type: this.leaveInfo.leaveType,
                leave_sub_type: this.global.checkIfDataIsValid(this.leaveInfoObject.leave_sub_type) ? this.leaveInfoObject.leave_sub_type : '', /*After discussion with Sandeep, Bhushan assigned proper values to leave_sub_type : 22-02-2019*/
                start_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.start_day_half_day) ? this.leaveInfoObject.start_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to start_day_half_day : 22-02-2019*/
                end_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.end_day_half_day) ? this.leaveInfoObject.end_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to end_day_half_day : 22-02-2019*/
                approver_id: parseInt(this.leaveInfoObject.APPROVER_ID), /*Corrected the attribute name : Bhushan 22-02-2019*/
                manager_comments: this.leaveInfo.manager_comments,
                idToEditLeave: this.leaveInfoObject.id
              }

              if (req) {
                this.global.showProgressBar();
                this.leaveApprovalService.rejectLeave(req)
                  .subscribe(
                    leavearejectdata => {
                      this.global.hideProgressBar();
                      this.global.trackEvent('leaveRejected', this.leaveInfoObject.location, this.leaveInfoObject.id, 0);
                      this.successRejectApproveCallback(leavearejectdata);
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
            }
          }]
        });
        alert.present();
      } else {
        this.global.showDialogs(false, 'Please provide your comments.');
      }
    }
  }

  async successRejectApproveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog(' Reject Data Leave Response : ', dataFromApi);
      /*this.global.showDialogs(false, dataFromApi.ErrorMessage);
      this.global.pushNewPage(LeaveApprovalPage, '');*/

      const alert = await this.alertCtrl.create({
        header: this.global.getAlertTitle(),
        message: dataFromApi.ErrorMessage,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.global.setMenuBackVisibility(true, false);

            if (this.paramsFromPrevPage.isFromEmail == true) {
              this.global.pushNewPage('/leave-approval', '');
            } else {
              this.global.popPageFromStack();
            }
          }
        }]
      });
      await alert.present();
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  async approve() {
    if (this.leaveInfo.is_cancel_request == '1') {
      this.approveLeaveCancellation();
    } else {
      if (this.global.checkIfDataIsValid(this.leaveInfoObject)) {
        // if(this.global.checkIfDataIsValid(this.leaveInfoObject.manager_comments)) {
        const alert = await this.alertCtrl.create({
          header: this.global.getAlertTitle(),
          message: 'Do you want to approve this leave?',
          backdropDismiss: false,
          buttons: [{
            text: 'Ok',
            role: 'Ok',
            handler: () => {
              const req = {
                employee_number: this.leaveInfoObject.EMPLOYEE_NUMBER,
                user_id: this.global.getUserId(),
                authToken: this.global.getAuthToken(),
                leave_start_date: this.leaveInfo.startDate,
                leave_end_date: this.leaveInfo.endDate,
                employee_leave_comments: this.leaveInfo.employee_Comments,
                // "absence_days": this.leaveInfo.leaveDuration,
                absence_hours: (this.leaveInfo.location == 'US') ? this.leaveInfo.leaveDuration : '',
                absence_days: (this.leaveInfo.location != 'US') ? this.leaveInfo.leaveDuration : '',
                leave_type: this.leaveInfo.leaveType,
                leave_sub_type: this.global.checkIfDataIsValid(this.leaveInfoObject.leave_sub_type) ? this.leaveInfoObject.leave_sub_type : '', /*After discussion with Sandeep, Bhushan assigned proper values to leave_sub_type : 22-02-2019*/
                start_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.start_day_half_day) ? this.leaveInfoObject.start_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to start_day_half_day : 22-02-2019*/
                end_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.end_day_half_day) ? this.leaveInfoObject.end_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to end_day_half_day : 22-02-2019*/
                approver_id: parseInt(this.leaveInfoObject.APPROVER_ID), /*Corrected the attribute name : Bhushan 22-02-2019*/
                manager_comments: this.leaveInfo.manager_comments,
                start_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.START_TIME : '',
                end_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.END_TIME : '',
                idToEditLeave: this.leaveInfoObject.id, /*Suggested by Hrishikesh : 11-03-2019*/
                userLocation: this.leaveInfo.location
              };
              // this.global.showConsoleLog('Approve Request', req);
              // console.log('Approve Request' + JSON.stringify(req));
              if (req) {
                this.global.showProgressBar();
                this.leaveApprovalService.approveLeave(req)
                  .subscribe(
                    leaveapprovedata => {
                      this.global.hideProgressBar();
                      let tempResp;
                      tempResp = leaveapprovedata;
                      if (this.global.checkIfDataIsValid(tempResp) && tempResp.ErrorCode == 0) {
                        this.global.trackEvent('leaveApproved', this.leaveInfoObject.location, this.leaveInfoObject.id, 0);
                      }
                      this.successApproveCallback(leaveapprovedata);
                    },
                    (error) => {
                      this.global.hideProgressBar();
                      this.global.showConsoleLog('Leave Approve - error', error);
                      this.global.showDialogs(false, error.ErrorMessage);
                    });
              }
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }]
        });
        await alert.present();
        /* } else {
          this.global.showDialogs(false, 'Please provide your comments.');        
        } */
      }
    }
  }

  async approveLeaveCancellation() {
    const alert = await this.alertCtrl.create({
      header: this.global.getAlertTitle(),
      message: ' Do you want to approve this cancellation of leave ?',
      backdropDismiss: false,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          const req = {
            employee_number: this.leaveInfoObject.EMPLOYEE_NUMBER,
            user_id: this.global.getUserId(),
            authToken: this.global.getAuthToken(),
            leave_start_date: this.leaveInfo.startDate,
            leave_end_date: this.leaveInfo.endDate,
            employee_leave_comments: this.leaveInfo.employee_Comments,
            // "absence_days": this.leaveInfo.leaveDuration,
            absence_hours: (this.leaveInfo.location == 'US') ? this.leaveInfo.leaveDuration : '',
            absence_days: (this.leaveInfo.location != 'US') ? this.leaveInfo.leaveDuration : '',
            leave_type: this.leaveInfo.leaveType,
            leave_sub_type: this.global.checkIfDataIsValid(this.leaveInfoObject.leave_sub_type) ? this.leaveInfoObject.leave_sub_type : '', /*After discussion with Sandeep, Bhushan assigned proper values to leave_sub_type : 22-02-2019*/
            start_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.start_day_half_day) ? this.leaveInfoObject.start_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to start_day_half_day : 22-02-2019*/
            end_day_half_day: this.global.checkIfDataIsValid(this.leaveInfoObject.end_day_half_day) ? this.leaveInfoObject.end_day_half_day : '', /*After discussion with Sandeep, Bhushan assigned proper values to end_day_half_day : 22-02-2019*/
            approver_id: parseInt(this.leaveInfoObject.APPROVER_ID), /*Corrected the attribute name : Bhushan 22-02-2019*/
            manager_comments: this.leaveInfo.manager_comments,
            start_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.START_TIME : '',
            end_time: (this.leaveInfo.location == 'US') ? this.leaveInfoObject.END_TIME : '',
            idToEditLeave: this.leaveInfoObject.id, /*Suggested by Hrishikesh : 11-03-2019*/
            userLocation: this.leaveInfo.location
          }

          if (req) {
            this.global.showProgressBar();
            // console.log('Approve Detail Page : Req' + req);
            this.leaveApprovalService.approveLeaveCancellation(req)
              .then(
                leaveapprovedata => {
                  let tempResp;
                  tempResp = leaveapprovedata;
                  if (this.global.checkIfDataIsValid(tempResp) && tempResp.ErrorCode == 0) {
                    this.global.trackEvent('leaveCancellationApproved', this.leaveInfoObject.location, this.leaveInfoObject.id, 0);
                  }
                  this.global.hideProgressBar();
                  this.successApproveCallback(leaveapprovedata);
                },
                (error) => {
                  this.global.hideProgressBar();
                  this.global.showConsoleLog('approveLeaveCancellation - error', error);
                  this.global.showDialogs(false, error.ErrorMessage);
                });
          }
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await alert.present();
    /* } else {
      this.global.showDialogs(false, 'Please provide your comments.');        
    } */
  }

  successApproveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.clearFeedBack();
      this.global.showConsoleLog(' Approve Date Leave Response : ', dataFromApi);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
      this.global.setMenuBackVisibility(true, false);
      this.global.pushNewPage('/leave-approval', '');
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('/login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  openFile(someURL) {
    window.open(someURL);
  }


  clearFeedBack() {
    this.leaveInfo.employee_name = '';
    this.leaveInfo.employee_ID = '';
    this.leaveInfo.career_stream = '';
    this.leaveInfo.practice = '';

    this.leaveInfo.startDate = '';
    this.leaveInfo.endDate = '';
    this.leaveInfo.leaveStatus = '';
    this.leaveInfo.leaveDuration = '';
    this.leaveInfo.employee_Comments = '';
    this.leaveInfo.leaveType = '';
  }

  ionViewDidLeave() {
    this.clearFeedBack();
  }
}
