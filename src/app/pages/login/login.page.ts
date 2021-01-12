import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { LoginService } from './login.service';
import { HomeService } from '../home/home.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showBtn = false;
  deferredPrompt;

  user = {
    userId: '',
    password: ''
  };

  passwordType = 'password';
  passwordIcon = 'eye-off';

  // tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, public global: GlobalService, public loginservice: LoginService, public homeservice: HomeService,
    private notificationsService: NotificationsService) {
    this.global.setMenuBackVisibility(false, false);
    this.global.showConsoleLog('Local Storage', localStorage);
    this.global.showConsoleLog('Local Storage AuthToken', this.global.getAuthToken());
    this.global.showConsoleLog('Local Storage fcmToken', localStorage.fcmToken);
    this.global.trackView('LoginPage', 'loginPage');
  }

  ngOnInit() {
    this.notificationsService.requestPermission();
  }

  add_to_home() {
    // tslint:disable-next-line: no-
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome == 'accepted') {
          alert('User accepted the prompt');
        } else {
          alert('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
  }

  ionViewDidLoad() {
    this.global.location.replaceState('/');
    this.global.showConsoleLog('ionViewDidLoad LoginPage', '');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;

      // Update UI by showing a button to notify the user they can add to home screen
      this.showBtn = true;
    });

    window.addEventListener('appinstalled', () => {
      alert('installed');
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('display-mode is standalone');
    }
  }

  ionViewWillEnter() {
    this.global.location.replaceState('/');
    this.user.userId = '';
    this.user.password = '';
  }

  hideShowPassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon == 'eye-off' ? 'eye' : 'eye-off';
  }

  signIn() {
    // tslint:disable-next-line: triple-equals
    if (this.validateUserData() == true) {
      const req = {
        user_id: this.user.userId,
        password: this.user.password,
      };

      if (req) {
        this.global.showProgressBar();
        this.loginservice.signIn(req)
          .subscribe(
            loginservicedata => {
              this.global.hideProgressBar();
              this.global.trackEvent('userLogin', 'userLoggedIn', this.user.userId, 0);
              this.successCallback(loginservicedata);
              this.global.defaultDataFlag = false;
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      }
    }
  }

  successCallback(dataFromApi) {
    this.global.showConsoleLog('Verify API Data ', dataFromApi);

    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog('Verify API Data ', dataFromApi.ErrorMessage);

      localStorage.userCountry = dataFromApi.userLocation;
      localStorage.managerViewOnly = dataFromApi.managerViewOnly;

      // console.log('localStorage.userCountry : ', dataFromApi.userLocation);

      this.global.showConsoleLog('LocalStorage', localStorage);
      this.global.setUserCountry(localStorage.userCountry);
      this.global.showConsoleLog('User Country', this.global.getUserCountry());

      this.setLocalStorageData(dataFromApi).then(() => {
        this.global.setUserFullName();
        this.global.showConsoleLog('Location Name ', localStorage.locationName);
        this.global.showConsoleLog('User is Manger ', localStorage.userRole);

        this.global.getMenu()
          .subscribe(
            menuData => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('menuData:', menuData);
              if (this.global.checkIfDataIsValid(menuData.MenuList) && menuData.MenuList.length > 0) {
                this.global.setSideMenuItems(menuData.MenuList);

                if (this.global.checkIfDataIsValid(this.global.fcmToken) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
                  this.global.registerDeviceToken();
                }

                this.global.setMenuBackVisibility(true, false);
                this.global.setUserProfilePic(menuData.profilePicURL);

                if (localStorage.userCountry == this.global.usLocation) {
                  if (this.notificationsService.isFromNotification) {
                    this.notificationsService.getLeaveInfo();
                    this.notificationsService.isFromNotification = false;
                  } else {
                    
                    this.global.pushNewPage('/us-home', '');
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (localStorage.userCountry == this.global.zenUkLocation) {
                  if (this.notificationsService.isFromNotification) {
                    this.notificationsService.getLeaveInfo();
                    this.notificationsService.isFromNotification = false;
                  } else {
                    
                    this.global.pushNewPage('/uk-home', '');
                  }
                } else if (localStorage.userCountry == this.global.zenLiveX) {
                  if (this.notificationsService.isFromNotification) {
                    this.notificationsService.getLeaveInfo();
                    this.notificationsService.isFromNotification = false;
                  } else {
                    this.global.pushNewPage('/live-x', '');
                  }
                } else if (localStorage.userCountry == this.global.saLocation) {
                  if (this.notificationsService.isFromNotification) {
                    this.notificationsService.getLeaveInfo();
                    this.notificationsService.isFromNotification = false;
                  } else {
                    this.global.pushNewPage('/sa-home', '');
                  }
                } else {
                  if (this.notificationsService.isFromNotification) {
                    this.notificationsService.getLeaveInfo();
                    this.notificationsService.isFromNotification = false;
                  } else {
                    this.global.pushNewPage('/home', '');
                  }
                }
              } else {
                this.global.clearLocalStorage();
                this.global.showDialogs(false, this.global.NETWORK_ERROR);
              }
            },
            (error) => {
              this.global.hideProgressBar();
              this.global.clearLocalStorage();
              this.global.showConsoleLog('error', error);
              this.global.showDialogs(false, error.ErrorMessage);
            });
      });

    } else {
      this.global.hideProgressBar();
      this.global.showDialogs('', dataFromApi.ErrorMessage);
    }
  }

  keyDownFunction(event) {
    // tslint:disable-next-line: triple-equals
    if (event.keyCode == 13) {
      // tslint:disable-next-line: triple-equals
      if (this.validateUserData() == true) {
        this.signIn();
      }
    }
  }

  setLocalStorageData(dataFromApi: any) {
    const promise = new Promise((resolve) => {
      this.global.encryptMessage(dataFromApi.AuthToken, this.global.publicKey).then(cipherTextAuth => {
        localStorage.AuthToken = cipherTextAuth;

        this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextAuthToken => {
          this.global.showConsoleLog('AuthToken ', plainTextAuthToken);
          this.global.setAuthToken(plainTextAuthToken);
        });
        // resolve(true);
        this.global.encryptMessage((this.user.userId), this.global.publicKey).then(cipherTextUserId => {
          localStorage.UserId = cipherTextUserId;
          this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextUserId => {
            this.global.showConsoleLog('UserId ', plainTextUserId);
            this.global.setUserId(plainTextUserId);
          });

          this.global.encryptMessage((dataFromApi.MailId), this.global.publicKey).then(cipherTextMail => {
            localStorage.MailId = cipherTextMail;
            this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextMail => {
              this.global.showConsoleLog('MailId ', plainTextMail);
              this.global.setMailId(plainTextMail);
            });
            this.global.encryptMessage((dataFromApi.FullName), this.global.publicKey).then(cipherTextName => {
              localStorage.FullName = cipherTextName;
              this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextName => {
                this.global.showConsoleLog('FullName ', plainTextName);
                this.global.setFullName(plainTextName);
              });
              resolve(true);
            });
          });
        });
      });

    });

    return promise;
  }

  validateUserData() {
    // tslint:disable-next-line: triple-equals
    if (this.checkUserNamePassword(this.user.userId) == true) {
      // tslint:disable-next-line: triple-equals
      if (this.checkUserNamePassword(this.user.password) == true) {
        return true;
      } else {
        this.global.showDialogs(false, 'Please enter your Password');
      }
    } else {
      this.global.showDialogs(false, 'Please enter your Username');
    }
  }

  checkUserNamePassword(str) {
    // tslint:disable-next-line: triple-equals
    if (str != undefined && str != null && str != '' && str != 'Username' && str != 'UserID' && str != 'Password') {
      return true;
    } else {
      return false;
    }
  }
}
