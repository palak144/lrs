import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController, PopoverController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { CalendarPopUpPage } from 'src/app/controls/calendar-pop-up/calendar-pop-up.page';
import { EmployeeLeaveDetailsModalComponent } from './employee-leave-details-modal/employee-leave-details-modal.component';
import { ManagerDashboardService } from './manager-dashboard.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.page.html',
  styleUrls: ['./manager-dashboard.page.scss'],
})
export class ManagerDashboardPage implements OnInit {

  // tslint:disable-next-line: variable-name
  _managerDashboardData: any;
  // tslint:disable-next-line: variable-name
  _startDateManagerDashboard: any;
  // tslint:disable-next-line: variable-name
  _endDateManagerDashboard: any;
  // tslint:disable-next-line: variable-name
  _startFullDateManagerDashboard: any;
  // tslint:disable-next-line: variable-name
  _endFullDateManagerDashboard: any;
  // tslint:disable-next-line: variable-name
  _startFullDateManagerDashboardForHTML: any;
  // tslint:disable-next-line: variable-name
  _endFullDateManagerDashboardForHTML: any;
  // tslint:disable-next-line: variable-name
  _managerDashboardDataJSON: any;
  // tslint:disable-next-line: variable-name
  _selectedLocationOptionManagerDashboard: any;
  // tslint:disable-next-line: variable-name
  _monthArray: any;
  // tslint:disable-next-line: variable-name
  _daysArray: any;
  // tslint:disable-next-line: variable-name
  _totalMonthsInvolved: any;
  // tslint:disable-next-line: variable-name
  _noOfTimesDatesSelected: any;
  // tslint:disable-next-line: variable-name
  _locationSelectedForSearch: any;
  employeeNameFilter;

  // tslint:disable-next-line: variable-name
  constructor(public _alertCtrl: AlertController, public _navCtrl: NavController, public _modalCtrl: ModalController,
    // tslint:disable-next-line: variable-name
    public _datepipe: DatePipe, public _global: GlobalService, public _managerDashboardService: ManagerDashboardService,
    // tslint:disable-next-line: variable-name
    public _popoverCtrl: PopoverController) {
    // this._global.showProgressBar();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this._global.location.replaceState('/');

    this.employeeNameFilter = '';
    this._selectedLocationOptionManagerDashboard = '';
    this._startDateManagerDashboard = '';
    this._endDateManagerDashboard = '';

  }

  ionViewDidEnter() {
    this._global.trackView('ManagerDashboardComponent', 'managerDashboardComponent');
    this._global.showProgressBarForOtherBrowser();
    this._global.setPageTitle('Manager Dashboard');
    this._noOfTimesDatesSelected = 0;
    this._global.showConsoleLog('ionViewDidEnter of ManagerDashboardComponent', '');

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

    this._daysArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    this.getManageboardDashboardData('defaultData');
  }

  getManageboardDashboardDataForSelectedDateRange() {
    this._global.showProgressBar();
    if (this._noOfTimesDatesSelected >= 2) {
      if (this._global.checkIfDataIsValid(this._startDateManagerDashboard) &&
        this._global.checkIfDataIsValid(this._endDateManagerDashboard)) {
        // Only vaild dates OR //valid location + valid dates
        if (this._startFullDateManagerDashboard > this._endFullDateManagerDashboard) {
          this._global.showDialogs(false, '\'Start date\' must be less than \'End date\'.');
        } else {
          this.getManageboardDashboardData('dateRange');
        }
      } else if (this._global.checkIfDataIsValid(this._selectedLocationOptionManagerDashboard)) {
        if ((!(this._global.checkIfDataIsValid(this._startDateManagerDashboard)) &&
          !(this._global.checkIfDataIsValid(this._endDateManagerDashboard)))) {
          // Only valid location
          this.getManageboardDashboardData('defaultData');
        } else if ((this._global.checkIfDataIsValid(this._startDateManagerDashboard) &&
          !(this._global.checkIfDataIsValid(this._endDateManagerDashboard))) ||
          (!(this._global.checkIfDataIsValid(this._startDateManagerDashboard) &&
            this._global.checkIfDataIsValid(this._endDateManagerDashboard)))) {
          // vaild location + (valid date: either of start & end dates)
          this._global.showDialogs(false, 'Please select Start and End dates.');
        }
      } else if ((!this._global.checkIfDataIsValid(this._selectedLocationOptionManagerDashboard)) &&
        (!(this._global.checkIfDataIsValid(this._startDateManagerDashboard)) &&
          !(this._global.checkIfDataIsValid(this._endDateManagerDashboard)))) {
        // No location + no dates
        this._global.showDialogs(false, 'Please select either Location or Start and End dates.');
      }
    } else {
      if (this._global.checkIfDataIsValid(this._selectedLocationOptionManagerDashboard)) {
        if ((!(this._global.checkIfDataIsValid(this._startDateManagerDashboard)) &&
          !(this._global.checkIfDataIsValid(this._endDateManagerDashboard)))) {
          // Only valid location
          this.getManageboardDashboardData('defaultData');
        } else if ((this._global.checkIfDataIsValid(this._startDateManagerDashboard) &&
          !(this._global.checkIfDataIsValid(this._endDateManagerDashboard))) ||
          (!(this._global.checkIfDataIsValid(this._startDateManagerDashboard) &&
            this._global.checkIfDataIsValid(this._endDateManagerDashboard)))) {
          // vaild location + (valid date: either of start & end dates)
          this._global.showDialogs(false, 'Please select Start and End dates.');
        }
      } else {
        this._global.showDialogs(false, 'Please select either Location or Start and End dates.');
      }
    }
  }

  getManageboardDashboardData(defaultOrDateRange) {
    this._locationSelectedForSearch = this._selectedLocationOptionManagerDashboard;

    this._managerDashboardDataJSON = {
      user_id: this._global.getUserId(),
      authToken: this._global.getAuthToken(),
      userLocation: this._selectedLocationOptionManagerDashboard,
      fromDate: this._global.checkIfDataIsValid(this._startDateManagerDashboard) ? this._startDateManagerDashboard : '',
      toDate: this._global.checkIfDataIsValid(this._endDateManagerDashboard) ? this._endDateManagerDashboard : ''
    };


    this._managerDashboardService.getManageboardDashboardData(this._managerDashboardDataJSON)
      .then(
        (res) => {
          this._managerDashboardData = res;
          // console.log("res", this._managerDashboardData);

          if (this._global.checkIfDataIsValid(this._managerDashboardData) && this._managerDashboardData.ErrorCode == 0) {
            this._startFullDateManagerDashboardForHTML = this._startFullDateManagerDashboard;
            this._endFullDateManagerDashboardForHTML = this._endFullDateManagerDashboard;
            if (this._global.checkIfDataIsValid(this._managerDashboardData.managerLocation) &&
              !(this._global.checkIfDataIsValid(this._locationSelectedForSearch))) {
              this._selectedLocationOptionManagerDashboard = this._managerDashboardData.managerLocation.id;
              this._locationSelectedForSearch = this._selectedLocationOptionManagerDashboard;
            }
            this.updateJSONForHTML(defaultOrDateRange);
          } else {
            this._selectedLocationOptionManagerDashboard = '';
            this._locationSelectedForSearch = '';
            if (this._global.checkIfDataIsValid(this._managerDashboardData.managerLocation) &&
              !(this._global.checkIfDataIsValid(this._locationSelectedForSearch))) {
              this._selectedLocationOptionManagerDashboard = this._managerDashboardData.managerLocation.id;
              this._locationSelectedForSearch = this._selectedLocationOptionManagerDashboard;
            }
          }
          this._global.showConsoleLog('getManageboardDashboardData : _managerDashboardData', this._managerDashboardData);
        },
        (error) => {
          this._managerDashboardData = error;
          this._selectedLocationOptionManagerDashboard = this._managerDashboardData.managerLocation.id;
          this._locationSelectedForSearch = this._selectedLocationOptionManagerDashboard;
          if (this._global.checkIfDataIsValid(this._managerDashboardData) && this._managerDashboardData.ErrorCode == 3) {
            if (this._global.checkIfDataIsValid(this._managerDashboardData.locationList) &&
              this._managerDashboardData.locationList.length > 0 &&
              this._global.checkIfDataIsValid(this._managerDashboardData.managerLocation)) {
              this._managerDashboardData.locationList.forEach(element => {
                if (element.id == this._managerDashboardData.managerLocation.id) {
                  this._selectedLocationOptionManagerDashboard = element.id;
                  this._locationSelectedForSearch = this._selectedLocationOptionManagerDashboard;
                }
              });
            }
          }

          this._global.showConsoleLog('getManageboardDashboardData : error', this._managerDashboardData);
        }
      );
    this._global.hideProgressBar();
  }

  updateJSONForHTML(defaultOrDateRange) {

    if (defaultOrDateRange == 'defaultData') {
      // tslint:disable-next-line: radix
      this._startFullDateManagerDashboardForHTML = new Date(parseInt(this._managerDashboardData.teamLeavesData[0].monthWiseLeaves[0].year),
        this.getMonthIndexOfSpecificMonth(this._managerDashboardData.teamLeavesData[0].monthWiseLeaves[0]), 1);

      // tslint:disable-next-line: radix
      this._endFullDateManagerDashboardForHTML = new Date(parseInt(this._managerDashboardData.teamLeavesData[0].monthWiseLeaves[0].year),
        this.getMonthIndexOfSpecificMonth(this._managerDashboardData.teamLeavesData[0].monthWiseLeaves[0]) + 1, 0);

    }

    if (this._global.checkIfDataIsValid(this._startFullDateManagerDashboardForHTML) &&
      this._global.checkIfDataIsValid(this._endFullDateManagerDashboardForHTML)) {

      // Valid FromTo Dates
      if (this._endFullDateManagerDashboardForHTML.getMonth() == this._startFullDateManagerDashboardForHTML.getMonth()) {
        this._totalMonthsInvolved = 1;
        this._monthArray[this._startFullDateManagerDashboardForHTML.getMonth()].isInSelectedDateRange = true;

        this._managerDashboardData.teamLeavesData.forEach((singleAssociate, associateIndex) => {
          this.updateParticularMonthForAllDays('sameMonth', associateIndex, 0, singleAssociate.monthWiseLeaves[0]);
        });
      } else if (this._endFullDateManagerDashboardForHTML.getMonth() > this._startFullDateManagerDashboardForHTML.getMonth()) {
        this.calculateTotalMonthsInvolved();

        // tslint:disable-next-line: variable-name
        let _tempThis;
        _tempThis = this;

        this._managerDashboardData.teamLeavesData.forEach((singleAssociate, associateIndex) => {
          this._global.showConsoleLog('################### employeeName : ' + singleAssociate.employeeName,
            ' (associateIndex: ' + associateIndex + ') has leave in ' +
            singleAssociate.monthWiseLeaves.length + ' months in selected date range.');

          if (singleAssociate.monthWiseLeaves.length < this._totalMonthsInvolved) {
            // Not on leave for few months OR NO leave at all
            this._global.showConsoleLog(singleAssociate.employeeName, ' : Not on leave for few months OR No leave at all');

            if (this._global.checkIfDataIsValid(singleAssociate.monthWiseLeaves) && singleAssociate.monthWiseLeaves.length > 0) {
              this._global.showConsoleLog(singleAssociate.employeeName, ' has some leaves in selected date range');

              // tslint:disable-next-line: max-line-length
              if (_tempThis._monthArray[_tempThis._startFullDateManagerDashboardForHTML.getMonth()].monthId == singleAssociate.monthWiseLeaves[0].monthId) {
                this._global.showConsoleLog('first month is same : ', singleAssociate.monthWiseLeaves[0].monthName);
                const totalDaysInCurrentMonth = _tempThis.getTotalDaysInSpecificMonth(singleAssociate.monthWiseLeaves[0]);

                if (singleAssociate.monthWiseLeaves[0].dayWiseLeavesInMonth.length == totalDaysInCurrentMonth) {
                  this._global.showConsoleLog(singleAssociate.employeeName, ' is on leave for whole ' +
                    singleAssociate.monthWiseLeaves[0].monthName + ' month');
                } else {
                  this._global.showConsoleLog(singleAssociate.employeeName, ' is on leave for ' +
                    singleAssociate.monthWiseLeaves[0].dayWiseLeavesInMonth.length + ' days');
                  this.updateParticularMonthForAllDays('firstMonth', associateIndex, 0, singleAssociate.monthWiseLeaves[0]);
                  this._global.showConsoleLog(singleAssociate.employeeName, ' : Done with firstMonth.');
                  for (let i = 1; i < this._totalMonthsInvolved; i++) {
                    this._global.showConsoleLog('this._totalMonthsInvolved', this._totalMonthsInvolved);
                    // Check that how many months are not there with at least one leave
                    // Till the second month of associate's leave data, add blank months
                    this.updateParticularMonthForAllDays(this._totalMonthsInvolved - i == 1 ? 'lastMonth' : 'middleMonth',
                      associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                  }
                }
              } else {
                this._global.showConsoleLog(singleAssociate.employeeName, ' : First month is not same : look further');
                // Check for first month of associate
                // Get the Index of month of start date of date range
                // TODO: auto fill/create earlier months
                // tslint:disable-next-line: radix
                for (let i = parseInt(this._startFullDateManagerDashboardForHTML.getMonth());
                  i < this.getMonthIndexOfSpecificMonth(singleAssociate.monthWiseLeaves[0]); i++) {
                  let tempObj = {};
                  this._global.showConsoleLog('identified month', this._monthArray[i]);
                  tempObj = {
                    monthId: this._monthArray[i].monthId,
                    monthName: this._monthArray[i].monthName,
                    year: '',
                    dayWiseLeavesInMonth: []
                  };

                  this._global.showConsoleLog('Add earlier blank months' + i + ' : tempObj : ', tempObj);

                  // tslint:disable-next-line: radix
                  if (i == parseInt(this._startFullDateManagerDashboardForHTML.getMonth())) {
                    this.updateParticularMonthForAllDays('firstMonth', associateIndex, i, tempObj);
                  } else if (this.getMonthIndexOfSpecificMonth(singleAssociate.monthWiseLeaves[0]) - i == 1) {
                    this.updateParticularMonthForAllDays('lastMonth', associateIndex, i, tempObj);
                  } else {
                    this.updateParticularMonthForAllDays('lastMonth', associateIndex, i, tempObj);
                  }
                }
              }
            } else {
              for (let i = 0; i < this._totalMonthsInvolved; i++) {
                if (i == 0) {
                  this._global.showConsoleLog('i ==', '0');
                  this.updateParticularMonthForAllDays('firstMonth', associateIndex, 0, singleAssociate.monthWiseLeaves[i]);
                } else if (this._totalMonthsInvolved - i == 1) {
                  this._global.showConsoleLog('this._totalMonthsInvolved - i ==', '1');
                  this.updateParticularMonthForAllDays('middleMonth', associateIndex, 0, singleAssociate.monthWiseLeaves[i]);
                } else {
                  this._global.showConsoleLog('else', '');
                  this.updateParticularMonthForAllDays('lastMonth', associateIndex, 0, singleAssociate.monthWiseLeaves[i]);
                }
              }
            }
          } else {
            this._global.showConsoleLog('some else part goes here', this._totalMonthsInvolved - singleAssociate.monthWiseLeaves.length);
            if (singleAssociate.monthWiseLeaves.length == 0) {
              this._global.showConsoleLog(singleAssociate.employeeName, 'This associate has NOT taken a single leave in selected range');

              for (let i = 0; i < this._totalMonthsInvolved; i++) {
                if (i == 0) {
                  this.updateParticularMonthForAllDays('firstMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                } else if (this._totalMonthsInvolved - i == 1) {
                  this.updateParticularMonthForAllDays('lastMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                } else {
                  this.updateParticularMonthForAllDays('middleMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                }
              }
            } else {
              if (this._totalMonthsInvolved - singleAssociate.monthWiseLeaves.length == 0) {
                this._global.showConsoleLog(singleAssociate.employeeName, 'This associate has leave in every month of selected range');

                for (let i = 0; i < this._totalMonthsInvolved; i++) {
                  if (i == 0) {
                    this.updateParticularMonthForAllDays('firstMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                  } else if (this._totalMonthsInvolved - i == 1) {
                    this.updateParticularMonthForAllDays('lastMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                  } else {
                    this.updateParticularMonthForAllDays('middleMonth', associateIndex, i, singleAssociate.monthWiseLeaves[i]);
                  }
                }
              }
            }
          }
          this._global.showConsoleLog('after current associate, complete data', this._managerDashboardData);
        });
      }
    }
  }

  calculateTotalMonthsInvolved() {
    let currentIndex = this._startFullDateManagerDashboardForHTML.getMonth();
    this._totalMonthsInvolved = 0;
    do {
      this._totalMonthsInvolved++;
      this._monthArray[currentIndex].isInSelectedDateRange = true;
      currentIndex++;
    } while (currentIndex <= this._endFullDateManagerDashboardForHTML.getMonth());
    this._global.showConsoleLog('_totalMonthsInvolved', this._totalMonthsInvolved);
  }

  updateParticularMonthForAllDays(monthPlace, associateIndex, monthIndex, currentMonthWiseLeaves) {
    this._global.showConsoleLog('currentMonthWiseLeaves', currentMonthWiseLeaves);
    this._global.showConsoleLog(this._managerDashboardData.teamLeavesData[associateIndex].employeeName +
      ' ==> monthPlace : ' + monthPlace, ' : associateIndex : ' + associateIndex + ' : monthIndex : ' + monthIndex);
    let tempJson;
    const tempDayWiseLeavesInMonth = [];

    for (let i = this.getStartingValueOfTotalDays(monthPlace);
      i <= this.getEndingValueOfTotalDays(monthPlace, currentMonthWiseLeaves); i++) {
      tempJson = {
        dayId: i,
        year: this._global.checkIfDataIsValid(this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) &&
          this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves.length > 0 ?
          this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].year : '',

        leaveType: this._global.checkIfDataIsValid(this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) &&
          this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves.length > 0 ?
          // tslint:disable-next-line: max-line-length
          this.getLeaveTypeForSpecificDayForSpecificMonth(i, this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) : 'normalDay',

        halfDay: this._global.checkIfDataIsValid(this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) &&
          this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves.length > 0 ?
          // tslint:disable-next-line: max-line-length
          this.getHalfdayForSpecificDayForSpecificMonth(i, this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) : 'normalday'
      };
      tempDayWiseLeavesInMonth.push(tempJson);
    }
    this._global.showConsoleLog('tempDayWiseLeavesInMonth', tempDayWiseLeavesInMonth);
    if (this._global.checkIfDataIsValid(this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]) &&
      // tslint:disable-next-line: max-line-length
      this._global.checkIfDataIsValid(this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].dayWiseLeavesInMonth) &&
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].dayWiseLeavesInMonth.length > 0) {
      // Valid monthwiseleave object is present
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].dayWiseLeavesInMonth = tempDayWiseLeavesInMonth;
    } else {
      // No monthwiseleave object is present. Create new one.
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex] = [];
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].dayWiseLeavesInMonth = [];

      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].monthId = currentMonthWiseLeaves.monthId;
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].monthName = currentMonthWiseLeaves.monthName;
      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].year = currentMonthWiseLeaves.year;

      this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex].dayWiseLeavesInMonth = tempDayWiseLeavesInMonth;
      this._global.showConsoleLog('newly isnerted monthwiseleave object',
        this._managerDashboardData.teamLeavesData[associateIndex].monthWiseLeaves[monthIndex]);
    }
  }

  getStartingValueOfTotalDays(monthPlace) {
    switch (monthPlace) {
      case 'firstMonth':
      case 'sameMonth':
        return this._startFullDateManagerDashboardForHTML.getDate();
      case 'middleMonth':
      case 'lastMonth':
        return 1;
    }
  }

  getEndingValueOfTotalDays(monthPlace, currentMonthWiseLeaves) {
    switch (monthPlace) {
      case 'firstMonth':
      case 'middleMonth':
        return this.getTotalDaysInSpecificMonth(currentMonthWiseLeaves);
      case 'lastMonth':
      case 'sameMonth':
        return this._endFullDateManagerDashboardForHTML.getDate();
    }
  }

  getLeaveTypeForSpecificDayForSpecificMonth(dayId, currentMonthWiseLeaves) {
    this._global.showConsoleLog('getLeaveTypeForSpecificDayForSpecificMonth : dayId : ' + dayId + ' currentMonthWiseLeaves : ',
      currentMonthWiseLeaves);
    let leaveType = 'normalDay';
    if (this._global.checkIfDataIsValid(currentMonthWiseLeaves.dayWiseLeavesInMonth) &&
      currentMonthWiseLeaves.dayWiseLeavesInMonth.length > 0) {

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < currentMonthWiseLeaves.dayWiseLeavesInMonth.length; i++) {
        // tslint:disable-next-line: radix
        if (parseInt(currentMonthWiseLeaves.dayWiseLeavesInMonth[i].dayId) == parseInt(dayId)) {
          leaveType = currentMonthWiseLeaves.dayWiseLeavesInMonth[i].leaveType;
        }
      }
    }
    return leaveType;
  }

  getHalfdayForSpecificDayForSpecificMonth(dayId, currentMonthWiseLeaves) {
    this._global.showConsoleLog('getLeaveTypeForSpecificDayForSpecificMonth : dayId : ' + dayId + ' currentMonthWiseLeaves : ',
      currentMonthWiseLeaves);
    let halfDay = 'normalDay';
    if (this._global.checkIfDataIsValid(currentMonthWiseLeaves.dayWiseLeavesInMonth) &&
      currentMonthWiseLeaves.dayWiseLeavesInMonth.length > 0) {

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < currentMonthWiseLeaves.dayWiseLeavesInMonth.length; i++) {
        // tslint:disable-next-line: radix
        if (parseInt(currentMonthWiseLeaves.dayWiseLeavesInMonth[i].dayId) == parseInt(dayId)) {
          halfDay = currentMonthWiseLeaves.dayWiseLeavesInMonth[i].halfDay;
        }
      }
    }
    return halfDay;
  }
  getMonthIndexOfSpecificMonth(monthWiseLeaveObject) {
    let monthIndex;
    if (this._global.checkIfDataIsValid(monthWiseLeaveObject)) {
      this._monthArray.forEach((element, index) => {
        if (element.monthId == monthWiseLeaveObject.monthId) {
          monthIndex = index;
        }
      });
    }
    return monthIndex;
  }

  getTotalDaysInSpecificMonth(monthWiseLeaveObject) {
    switch (this.getMonthIndexOfSpecificMonth(monthWiseLeaveObject)) {
      case 3:
      case 5:
      case 8:
      case 10:
        return 30;
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      case 1:
        return this.checkIfMonthIsInLeapYear(monthWiseLeaveObject.year) ? 29 : 28;
    }
  }

  async openCalendarForManagerDashboard(from) {
    const dataToPass = {
      selectedDate: new Date(),
      from: ''
    };

    dataToPass.from = from;

    //const componentProps = this._global.setNavData(dataToPass);

    const modalPage = await this._modalCtrl.create({
      component: CalendarPopUpPage,
      componentProps: { dataToPass },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'calendarModal'
    });

    modalPage.onDidDismiss().then(data => {
      this._noOfTimesDatesSelected++;

      if (this._global.checkIfDataIsValid(data)) {
        if (from == 'startDateManagerDashboard') {
          data.data = new Date(data.data);
          this._startFullDateManagerDashboard = data.data;

          if (!isNaN(data.data)) { this._startDateManagerDashboard = this._datepipe.transform(data.data, 'dd-MMM-yyyy'); }

          this._global.showConsoleLog('this._startFullDateManagerDashboard', this._startFullDateManagerDashboard);
        } else {
          data.data = new Date(data.data);
          this._endFullDateManagerDashboard = data.data;

          if (!isNaN(data.data)) { this._endDateManagerDashboard = this._datepipe.transform(data.data, 'dd-MMM-yyyy'); }

          this._global.showConsoleLog('this._endFullDateManagerDashboard', this._endFullDateManagerDashboard.getDate());
        }
      }
    });

    await modalPage.present();
  }

  checkIfMonthIsInLeapYear(year) {
    // If a year is multiple of 400,
    // then it is a leap year
    if (year % 400 == 0) {
      return true;
    }

    // Else If a year is muliplt of 100,
    // then it is not a leap year
    if (year % 100 == 0) {
      return false;
    }

    // Else If a year is muliplt of 4,
    // then it is a leap year
    if (year % 4 == 0) {
      return true;
    }
    return false;
  }

  async openEmployeeLeaveDetailsPopup(singleAssociate) {
    this._global.showConsoleLog('singleAssociate', singleAssociate);

    // const dataToPass = {
    //   singleAssociate
    // };

    const componentProps = this._global.setNavData(singleAssociate);

    const modalPage = await this._modalCtrl.create({
      component: EmployeeLeaveDetailsModalComponent,
      componentProps: { componentProps },
      backdropDismiss: true,
      cssClass: 'calendarModal'
    });

    modalPage.onDidDismiss().then(data => {
      if (this._global.checkIfDataIsValid(data.data)) {
        this._global.showConsoleLog('Modal dismissed with data:', data.data);
      }
    });

    await modalPage.present();
  }

  getLocationBasedClass() {
    switch (this._locationSelectedForSearch) {
      case 'Zensar Technologies India': return 'indiaLocation';
      case 'Zensar Technologies US': return 'usLocation';
      case 'Zensar Technologies South Africa': return 'saLocation';
      case 'Zensar Technologies UK': return 'ukLocation';
    }
  }
}
