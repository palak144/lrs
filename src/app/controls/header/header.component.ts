import { Component, OnInit } from '@angular/core';
import { LoginPage } from 'src/app/pages/login/login.page';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  rootPage: any = LoginPage;
  app: any;


  constructor(public global: GlobalService, public alertCtrl: AlertController, private notificationsService: NotificationsService
  ) {

    this.global.showConsoleLog('constructor of leave management header', '');

  }

  ngOnInit() {
    this.global.showConsoleLog('ngOnInit of leave management header', '');
  }

  ionViewDidLoad() {
    this.global.showConsoleLog('ionViewDidLoad leave management header', '');
  }


  logoutDialog(): void {
    const alert = this.alertCtrl.create({
      header: this.global.ALART_TITLE,
      message: 'Are you sure do you want to logout?',
      backdropDismiss: true,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          this.global.showConsoleLog('logoutDialog ', 'Logout');
          this.logout();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.global.showConsoleLog('logoutDialog ', 'Cancel');
        }
      }], cssClass: 'alertCustomCss'
    });
    alert.then(x => x.present());
  }

  logout() {
    if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
      this.global.showProgressBar();
      this.global.logoutAPI()
        .subscribe(
          loginservicedata => {
            this.global.hideProgressBar();
            this.successLogoutCallback(loginservicedata);
          },
          (error) => {
            this.global.hideProgressBar();
            this.global.showConsoleLog('error', error);
            this.global.showDialogs(false, error.ErrorMessage);
          });
    }
  }

  successLogoutCallback(dataFromApi) {
    this.global.showConsoleLog('Verify API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {
      this.global.pushNewPage('/login', '');
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  headerBackButtonClicked() {
    if (this.global.isFromLeaveApprovalPage || this.notificationsService.isFromNotification) {
      this.global.setMenuBackVisibility(true, false);
      this.global.isFromLeaveApprovalPage = false;
  
      if(this.notificationsService.isFromNotification) {
        this.notificationsService.isFromNotification = false ;
      }

      this.global.router.navigate(['/leave-approval'], { skipLocationChange: true });
    } else {
      // this.global.navCtrl.back();
      this.global.router.navigate(['/leave-summary'], { skipLocationChange: true });
    }
  }
}

