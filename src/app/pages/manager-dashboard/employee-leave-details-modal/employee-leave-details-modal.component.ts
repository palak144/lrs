import { Component, OnInit } from '@angular/core';
import { ManagerDashboardService } from '../manager-dashboard.service';
import { GlobalService } from 'src/app/services/global.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-employee-leave-details-modal',
  templateUrl: './employee-leave-details-modal.component.html',
  styleUrls: ['./employee-leave-details-modal.component.scss'],
})
export class EmployeeLeaveDetailsModalComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  _singleAssociateObject: any;
  // tslint:disable-next-line: variable-name
  _employeeDetailsDataJson: any;
  // tslint:disable-next-line: variable-name
  _employeeDetailsData: any;
  // tslint:disable-next-line: variable-name
  _monthArray: any;

  // tslint:disable-next-line: variable-name
  constructor(public modalController: ModalController, public _global: GlobalService,
    public _managerDashboardService: ManagerDashboardService) {
    this._singleAssociateObject = this._global.getNavData();
  }

  ngOnInit() { }

  ionViewDidEnter() {
    // this._global.showConsoleLog('this._singleAssociateObject', this._singleAssociateObject);
    this._global.trackView("EmployeeLeaveDetailsModalComponent", this._singleAssociateObject.employeeNumber);
    this._monthArray = [
      {
        monthName: 'Jan',
        monthId: 1,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Feb',
        monthId: 2,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Mar',
        monthId: 3,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Apr',
        monthId: 4,
        isInSelectedDateRange: false
      },
      {
        monthName: 'May',
        monthId: 5,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Jun',
        monthId: 6,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Jul',
        monthId: 7,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Aug',
        monthId: 8,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Sep',
        monthId: 9,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Oct',
        monthId: 10,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Nov',
        monthId: 11,
        isInSelectedDateRange: false
      },
      {
        monthName: 'Dec',
        monthId: 12,
        isInSelectedDateRange: false
      }
    ];
    this._global.showConsoleLog('month Array', this._monthArray);
    
    if (this._singleAssociateObject.employeeID != this._global.getUserId()) {
      
      this.getEmployeeDetailsData();
    } else {
      
      this._employeeDetailsData = this._singleAssociateObject;
    }
    // this.getEmployeeDetailsData();
  }
  getEmployeeDetailsData() {
    this._employeeDetailsDataJson = {
      user_id: this._global.getUserId(),
      authToken: this._global.getAuthToken(),
      employeeID: this._singleAssociateObject.employeeNumber,
      employeeEmail: this._singleAssociateObject.employeeEmail,
      employeeLocation: this._singleAssociateObject.userLocation
    };

    this._managerDashboardService.getEmployeeDetailsData(this._employeeDetailsDataJson)
      .then(
        (res) => {
          
          this._employeeDetailsData = res;

          this._global.showConsoleLog('getManageboardDashboardData : _employeeDetailsData', this._employeeDetailsData);
        },
        (error) => {
          this._global.showConsoleLog('getManageboardDashboardData : error', error);
        }
      );
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getLeaveTypeWiseLeaveCountForThisMonth(singleMonth, singleLeaveTypeDetails) {
    let leaveCountForCurrentMonth = 0;
    singleLeaveTypeDetails.monthWiseUse.forEach(element => {

      // tslint:disable-next-line: radix
      if (parseInt(element.monthId) == parseInt(singleMonth.monthId)) {
        leaveCountForCurrentMonth = element.leaveTakenInMonth;
      }
    });
    return leaveCountForCurrentMonth;
  }
  
  getLeaveCountForThisMonth(singleMonth) {
    let totalLeaveCountForThisMonth = 0;
    
    this._employeeDetailsData.leaveTypeWiseDetails.forEach(singleLeaveTypeWiseDetails => {
      singleLeaveTypeWiseDetails.monthWiseUse.forEach(element => {

        // tslint:disable-next-line: radix
        if (parseInt(element.monthId) == parseInt(singleMonth.monthId)) {
          totalLeaveCountForThisMonth = totalLeaveCountForThisMonth + element.leaveTakenInMonth;
        }
      });
    });
    return totalLeaveCountForThisMonth;
  }

  getTotalLeaves(singleLeaveTypeDetails) {
    let totalCountForEmployee = 0;
    this._global.showConsoleLog('leaveTypeDetails', singleLeaveTypeDetails);
    singleLeaveTypeDetails.leaveTypeWiseDetails.forEach(element => {
      totalCountForEmployee = totalCountForEmployee + element.totalLeaves;
      this._global.showConsoleLog('totalCountForEmployee:-', totalCountForEmployee);
    });
    return totalCountForEmployee;
  }
}
