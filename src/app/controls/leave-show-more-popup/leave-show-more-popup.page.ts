import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-leave-show-more-popup',
  templateUrl: './leave-show-more-popup.page.html',
  styleUrls: ['./leave-show-more-popup.page.scss'],
})
export class LeaveShowMorePopupPage implements OnInit {

  // tslint:disable-next-line: variable-name
  _selectedLeaveObject: any;

  firstButtonTitle: any;
  secondButtonTitle: any;

  // tslint:disable-next-line: variable-name
  constructor(public _global: GlobalService, public modalController: ModalController, public popoverCtrl: PopoverController) {
    this._selectedLeaveObject = this._global.getNavData();
    // this._selectedLeaveObject = this.navParams.data;
    this._global.showConsoleLog('LeaveShowMorePopup:', this._selectedLeaveObject.fromPage + '|' + this._selectedLeaveObject);
    this._global.showConsoleLog('fromPage:', this._selectedLeaveObject.fromPage);

    if (this._selectedLeaveObject.fromPage === 'summary') {
      this.firstButtonTitle = 'Edit';
      this.secondButtonTitle = 'Delete';
    } else {
      this.firstButtonTitle = 'Approve';
      this.secondButtonTitle = 'Reject';
    }
  }

  ngOnInit() {
  }

  edit() {

    

    if (this._selectedLeaveObject.fromPage === 'summary') {
      this._global.showConsoleLog('LeaveShowMorePopup:edit:', 'Navigate to edit screen');
      this._selectedLeaveObject.isDelete = false;
    } else {
      this._global.showConsoleLog('LeaveShowMorePopup:delete:', ' Call apporve API');
      this._selectedLeaveObject.isApprove = true;
    }
    this.close();
  }

  delete() {
    
    // Call delete API
    if (this._selectedLeaveObject.fromPage === 'summary') {
      
      this._global.showConsoleLog('LeaveShowMorePopup:delete:', ' Call delete API');
      this._selectedLeaveObject.isDelete = true;
    } else {
      
      this._global.showConsoleLog('LeaveShowMorePopup:delete:', ' Call reject API');
      this._selectedLeaveObject.isApprove = false;
    }
    this.close();
  }

  close() {
    //this._global.setNavData('leave-show-more-popup', this._selectedLeaveObject);
    this.popoverCtrl.dismiss(this._selectedLeaveObject);
  }
}
