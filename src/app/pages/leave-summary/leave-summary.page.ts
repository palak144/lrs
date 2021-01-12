import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, NavController, PopoverController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { LeaveSummaryService } from './leave-summary.service';
import { UsHomePage } from '../us-home/us-home.page';
import { UkHomePage } from '../uk-home/uk-home.page';
import { LiveXPage } from '../live-x/live-x.page';
import { HomePage } from '../home/home.page';
import { LeaveShowMorePopupPage } from 'src/app/controls/leave-show-more-popup/leave-show-more-popup.page';
import { EmployeeLeaveDetailsModalComponent } from '../manager-dashboard/employee-leave-details-modal/employee-leave-details-modal.component';

@Component({
  selector: 'app-leave-summary',
  templateUrl: './leave-summary.page.html',
  styleUrls: ['./leave-summary.page.scss'],
})
export class LeaveSummaryPage implements OnInit {

  leaveHistory: any;
  tempLeaveHistory: any;
  leaveHistoryAPIResp: any;
  leaveHistoryLength: any;
  paginationButtonCount: any;
  recordCount: any = 15;
  pager: any = {};
  pagedItems: any[];
  pages: any = [];
  leaveApprovalStatus: any;
  appliedFilter = 'All';
  isHide: any = false;
  msgToUser: any;
  leaveDetailedHistory: any;

  // Array for employee data

  emp = {
    name: '',
    number: '',
    email: ''
  }

  selectOptions = [{ id: '1', value: 'All' }, { id: '2', value: 'Approved' }, { id: '3', value: 'Pending' }];

  // tslint:disable-next-line: max-line-length
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public datepipe: DatePipe, public global: GlobalService, public leavesummaryservice: LeaveSummaryService, public popoverCtrl: PopoverController, public zone: NgZone,
    public _modalCtrl: ModalController,) {
      
    this.leaveApprovalStatus = 'All';
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {
    
    this.msgToUser = 'Please wait...';
    this.global.showProgressBar();
    this.global.setMenuBackVisibility(true, false);
    this.global.trackView('LeaveSummaryPage', 'leaveSummaryPage');
    this.initializeApp();
  }

  initializeApp() {
    this.pagedItems = [];
    this.global.setPageTitle('Leave Summary');
    this.leaveSummery();
  }

  leaveSummery() {
    let req = {
      user_id: this.global.getUserId(),
      authToken: this.global.getAuthToken(),
      userLocation: localStorage.userCountry /*Changed by Bhushan, as per API doc ; 07-06-2019*/
      /* "location": localStorage.userCountry */
    }

    if (req) {
      this.global.showConsoleLog('leaveSummery - req', JSON.stringify(req));
      this.leavesummaryservice.leaveSummery(req)
        .subscribe(
          leavesummerydata => {
            this.leaveHistoryAPIResp = leavesummerydata;
            this.global.hideProgressBar();
            this.successCallback(leavesummerydata);
          },
          (error) => {
            this.msgToUser = 'No results to show';
            this.global.hideProgressBar();
            this.global.showConsoleLog('leaveSummery - error', error);
            this.global.showDialogs(false, error.ErrorMessage);
          });
    }
  }

  successCallback(dataFromApi) {  
    
    if (dataFromApi.ErrorCode == 0) {
     
        //this.leaveHistory = dataFromApi.leaveHistory;
      this.tempLeaveHistory = dataFromApi.leaveHistory;// temp array added for all.
       //change for work from anywhere
       this.tempLeaveHistory.forEach(v => {
        if (v.LEAVE_TYPE === "Work From Home") v.LEAVE_TYPE = "Work From Anywhere";
      });
      
      //this.global.showConsoleLog('successCallback - Leave History Any Array', this.leaveHistory);
      this.leaveHistoryLength = this.tempLeaveHistory.length;
      // this._notificationListData.notifications[i]['showComplete'] = false;   
      this.global.showConsoleLog('this.tempLeaveHistory', this.tempLeaveHistory);
      this.leaveDetailedHistory = dataFromApi.usersTotalLeaveCountYearly;
      // get employee data
      this.emp.name = dataFromApi.usersTotalLeaveCountYearly.employeeName;
      this.emp.number = dataFromApi.usersTotalLeaveCountYearly.employeeNumber;
      this.emp.email = dataFromApi.usersTotalLeaveCountYearly.employeeEmail;

      this.setPage(1);
      this.paginationCount();
    } else if (dataFromApi.ErrorCode == 3) {
      this.global.showConsoleLog('leaveSummery ErrorCode is 3 : ', dataFromApi);
      this.msgToUser = dataFromApi.ErrorMessage;
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      
      this.msgToUser = '';
      // this.global.showDialogGoToPage(LoginPage, dataFromApi.ErrorMessage);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  paginationCount() {
    this.pages = [];
    if (this.global.checkIfDataIsValid(this.recordCount) && this.global.checkIfDataIsValid(this.leaveHistoryLength)) {
      let remainder = this.leaveHistoryLength / this.recordCount;
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
    if (this.appliedFilter == 'All') {
      this.leaveHistory = this.filterItems('');
    } else {
      this.leaveHistory = this.filterItems(this.appliedFilter);
    }

    this.pager = this.leavesummaryservice.getPager(this.leaveHistory.length, page, this.recordCount);
    // get current page of items
    // this.pagedItems = this.leaveHistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.global.showConsoleLog('setPage - leaveHistory : ', this.leaveHistory);
    this.global.showConsoleLog('setPage - startIndex : ', this.pager.startIndex + ' | endIndex : ' + this.pager.endIndex);
    this.global.showConsoleLog('setPage - appliedFilter : ', this.appliedFilter);
    this.global.showConsoleLog('Filter - leaveHistory:', this.leaveHistory.length + '|' + JSON.stringify(this.leaveHistory));

    this.pagedItems = this.leaveHistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.msgToUser = (this.pagedItems.length == 0) ? 'No results to show' : null;
  }

  filterItems(searchTerm) {
    //this.zone.run(() => this.navCtrl.navigateBack('/leave-summary'));
    this.zone.run(() => this.global.router.navigate(['/leave-summary'], { skipLocationChange: true }));

    return this.tempLeaveHistory.filter((leave) => {
      // tslint:disable-next-line: max-line-length
      this.global.showConsoleLog('filterItems:', JSON.stringify(leave) + '=' + leave.APPROVAL_STATUS.toLowerCase().indexOf(searchTerm.toLowerCase()));
      return leave.APPROVAL_STATUS.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  getLeaveStatusType(value) {
    this.global.showConsoleLog('getLeaveStatusType - Approval Status Type:', value);
    this.appliedFilter = value;
    this.setPage(1);
    this.paginationCount();
  }

  async showMoreOption(leaveObject: any, ev) {
    leaveObject.fromPage = 'summary';
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
      event: ev,
      cssClass: 'leaveSummaaryPopover'
    });

    popover.onDidDismiss().then(async (data) => {
      this.global.showConsoleLog('showMoreOption-onDidDismiss:', data);
      if (this.global.checkIfDataIsValid(data.data)) {
        //this.initializeApp();
        if (data.data.isDelete) {  
          
          data.data.LEAVE_TYPE == "Work From Anywhere" ? data.data.LEAVE_TYPE = "Work From Home" : data.data.LEAVE_TYPE
          let alert = await this.alertCtrl.create({
            header: this.global.getAlertTitle(),
            /* subTitle: 'Do you want to reject this leave?', *///Changes by Bhushan : Purbali Observations - 10-04-2019
            message: 'Are you sure you want to delete this leave?',
            backdropDismiss: false,
            buttons: [{
              text: 'Ok',
              role: 'Ok',
              handler: () => {
                this.deleteLeave(data.data);
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
          // this.global.showConsoleLog('ZenLive XXXX ', data);
          this.global.setMenuBackVisibility(false, true);
          if (localStorage.userCountry.toLowerCase() == this.global.usLocation.toLowerCase()) {
            this.global.pushNewPage('/us-home', leaveObject);
          } else if (localStorage.userCountry == this.global.zenUkLocation) {
            this.global.pushNewPage('/uk-home', leaveObject);
          } else if ((localStorage.userCountry == this.global.zenLiveX) && (data.data.type == this.global.zenLiveX)) {
            this.global.pushNewPage('/live-x', leaveObject);
          } else if (localStorage.userCountry == this.global.saLocation) {
            this.global.pushNewPage('/sa-home', leaveObject);
          } else {
            this.global.pushNewPage('/home', leaveObject);
          }
        }
      }
    });

    // popover.present({
    //   ev: event
    // });

    await popover.present();
  }

  goToLeaveDetailPage(leaveData) {
    
    // ;
    this.global.defaultDataFlag = true;
    this.global.showConsoleLog('Live xxxx  obj 2', leaveData);
    this.global.showConsoleLog('goToLeaveDetailPage', '' + JSON.stringify(leaveData));
    // if (this.global.checkIfDataIsValid(leaveData) && leaveData.canBeCancelledByUser == true) {
    this.global.isFromSummaryPage = true;
    if (this.global.checkIfDataIsValid(leaveData)) {
      if (localStorage.userCountry == this.global.usLocation) {
        this.global.setMenuBackVisibility(false, true);
        
        this.global.pushNewPage('/us-home', leaveData);
      } else if (localStorage.userCountry == this.global.zenUkLocation) {
        this.global.setMenuBackVisibility(false, true);
        this.global.pushNewPage('/uk-home', leaveData);
      } else if ((localStorage.userCountry == this.global.zenLiveX) && (leaveData.type == this.global.zenLiveX)) {
        this.global.setMenuBackVisibility(false, true);
        this.global.pushNewPage('/live-x', leaveData);
      } else if (localStorage.userCountry == this.global.saLocation) {
        this.global.setMenuBackVisibility(false, true);
        this.global.pushNewPage('/sa-home', leaveData);
      } else {
        this.global.setMenuBackVisibility(false, true);
        this.global.pushNewPage('/home', leaveData);
      }
    }
    // else {
    //   this.global.showDialogs(false, "Error");
    // }
  }

  /*  processLeaveHistoryData() {
     for (let i = 0; i < this.tempLeaveHistory.length; i++) {
       this.tempLeaveHistory[i]['isShow'] = false;
     }
   } */


  deleteLeave(data) {
    let req;

    if (this.global.getLocalStorageUserCountry().toLowerCase() == this.global.usLocation.toLowerCase()) {
      req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        leave_start_date: data.START_DATE,
        leave_end_date: data.END_DATE,
        start_time: data.START_TIME,
        end_time: data.END_TIME,
        absence_hours: data.DURATION,
        leave_type: data.LEAVE_TYPE,
        idToEditLeave: data.id,
        userLocation: this.global.getLocalStorageUserCountry(),
        isFutureApproved: data.APPROVAL_STATUS == 'Approved' ? 'Y' : 'N',
        employee_number: data.EMPLOYEE_NUMBER,
      };
    } else {
      req = {
        user_id: this.global.getUserId(),
        authToken: this.global.getAuthToken(),
        leave_type: data.LEAVE_TYPE,
        leave_start_date: data.START_DATE,
        leave_end_date: data.END_DATE,
        absence_days: data.DURATION,
        employee_number: data.EMPLOYEE_NUMBER,
        idToEditLeave: data.id,
        userLocation: this.global.getLocalStorageUserCountry(),
        isFutureApproved: data.APPROVAL_STATUS == 'Approved' ? 'Y' : 'N'
      };
    }

    if (req) {
      this.global.showProgressBar();
      this.global.showConsoleLog('Leave Approve - req', JSON.stringify(req));
      this.leavesummaryservice.canceLeave(req)
        .subscribe(
          leavearejectdata => {
            // this.global.hideProgressBar();
            this.global.trackEvent(data.APPROVAL_STATUS == 'Approved' ? 'leaveCancellationRequest' : 'pendingLeaveCancelled', this.global.getLocalStorageUserCountry(), data.EMPLOYEE_NUMBER, 0);
            this.successDeleteLeaveCallback(leavearejectdata);
          },
          (error) => {
            this.global.hideProgressBar();
            this.global.showConsoleLog('Leave Reject Data - error', error);
            this.global.showDialogs(false, error.ErrorMessage);
          });
    }
  }

  successDeleteLeaveCallback(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog(' Delete Leave Response : ', dataFromApi);
      // this.initializeApp();
      this.showDialogs(dataFromApi.ErrorMessage);
    } else if (dataFromApi.ErrorCode == 5) {
      this.global.showDialogGoToPage('login', dataFromApi.ErrorMessage);
      localStorage.clear();
    } else {
      this.global.showConsoleLog(' Delete error Response : ', dataFromApi);
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  async showDialogs(message) {
    let alert = await this.alertCtrl.create({
      header: this.global.ALART_TITLE,
      message: message,
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

  async getDetailedLeaveSummary() {
    // this.global.showConsoleLog('singleAssociate', this.leaveDetailedHistory);

    const componentProps = this.global.setNavData(this.leaveDetailedHistory);
    const modalPage = await this._modalCtrl.create({
      component: EmployeeLeaveDetailsModalComponent,
      componentProps: { componentProps },
      backdropDismiss: true,
      cssClass: 'calendarModal'
    });
    modalPage.onDidDismiss().then(data => {
      if (this.global.checkIfDataIsValid(data.data)) {
        this.global.showConsoleLog('Modal dismissed with data:', data.data);
      }
    });

    await modalPage.present();
  }



}
