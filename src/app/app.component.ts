import { Component, HostListener } from '@angular/core';
import { Platform, AlertController, MenuController, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { HomeService } from './pages/home/home.service';
import { UsHomePage } from './pages/us-home/us-home.page';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  rootPage: any;
  params: any;

  userActivity;
  userInactive: Subject<any> = new Subject();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public global: GlobalService,
    // private fcm: FirebaseMessagingProvider,
    private homeService: HomeService,
    public alertCtrl: AlertController,
    private menuController: MenuController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private notificationsService: NotificationsService
  ) {

    localStorage.clear();

    this.userInactive.subscribe(() => {
      location.reload();
      this.global.showConsoleLog('User has been inactive for 20 mins', '');

    });

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.setupBackButtonBehavior();
      this.global.startTrackerWithId('UA-75821623-17');
    });

    this.params = new URLSearchParams(window.location.search);

    // this.global.showConsoleLog("URLData: ", this.params);
    if (this.global.checkIfDataIsValid(this.params)) {
      const staffID = this.params.get('staffID');
      const emailID = this.params.get('emailID');
      const token = this.params.get('token');

      if ((this.global.checkIfDataIsValid(staffID) && this.global.checkIfDataIsValid(emailID)) && this.global.checkIfDataIsValid(token)) {
        this.global.clearLocalStorage();
        this.ssoValidationAPICall(staffID, emailID, token);
      }
    } else {
      this.initializeApp();
    }

    // if (!this.global.checkIfDataIsValid(localStorage.fcmToken)) {
    //   this.global.showConsoleLog("MyApp-isFCMSupport:", fcm.isFCMSupport());
    //   if (fcm.isFCMSupport()) {
    //     this.fcm.enableNotifications();
    //   }
    // }
  }

  async ngOnInit() {
    firebase.initializeApp(environment.firebase);
    // console.log("firebase.initializeAp Done", environment.firebase);
    await this.notificationsService.init();
  }

  ngAfterViewInit() {
    this.platform.ready().then(async () => {
      // console.log("requestPermission once platform is ready", environment.firebase);
      /*  await this.notificationsService.requestPermission(); */
      this.statusBar.styleDefault();
      this.setupBackButtonBehavior();
    });
  }

  initializeApp() {
    this.global.generateKeyNew();

    this.global.generateKey().then(() => {
      if (this.global.checkIfDataIsValid(localStorage.UserId) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {

        this.setLocalStorageDataToAppData().then(() => {
          this.isPasswordChangedCheck();
        });

      } else {
        this.global.setMenuBackVisibility(false, false);
        this.rootPage = '/login';
      }

      // Set Profile Pic
      this.global.setUserProfilePic('assets/imgs/user_default.png');
    });
  }

  private setupBackButtonBehavior() {
    const g = this.global;
    const n = this.navCtrl;
    const r = this.global.router;
    // tslint:disable-next-line: only-arrow-functions
    window.addEventListener('pageshow', function (event) {
      const historyTraversal = event.persisted ||
        (typeof window.performance !== 'undefined' &&
          // tslint:disable-next-line: deprecation
          (window.performance.navigation.type == 2 ||
            // tslint:disable-next-line: deprecation
            window.performance.navigation.type == 1));

      if (historyTraversal) {
        g.clearLocalStorage();
        // n.navigateRoot('/login');
        // n.pop();
        r.navigate(['/login'], { skipLocationChange: true });
      }

      // window.onpopstate = () => {
      //   g.clearLocalStorage();
      //   r.navigateByUrl('/login', { skipLocationChange: true });
      //   n.navigateRoot('/login');
      //   n.pop();
      // };
    });
  }

  setLocalStorageDataToAppData() {

    const promise = new Promise((resolve) => {
      this.global.decryptMessage(localStorage.AuthToken, this.global.publicKey).then(plainTextAuthToken => {
        this.global.showConsoleLog('AuthToken ', plainTextAuthToken);
        this.global.setAuthToken(plainTextAuthToken);
        this.global.decryptMessage(localStorage.UserId, this.global.publicKey).then(plainTextUserId => {
          this.global.showConsoleLog('UserId ', plainTextUserId);
          this.global.setUserId(plainTextUserId);
          this.global.decryptMessage(localStorage.MailId, this.global.publicKey).then(plainTextMail => {
            this.global.showConsoleLog('MailId ', plainTextMail);
            this.global.setMailId(plainTextMail);
            this.global.decryptMessage(localStorage.FullName, this.global.publicKey).then(plainTextName => {
              this.global.showConsoleLog('FullName ', plainTextName);
              this.global.setFullName(plainTextName);
              resolve(true);
            });
          });
        });
      });
    });
    return promise;
  }

  openPage(page) {
    this.global.setSelectedFullDate_EndDate(null);
    this.global.setSelectedFullDate_LeaveBal(null);
    this.global.setSelectedFullDate_StartDate(null);
    this.global.setSelectedFullDate_WorkEndDate(null);
    this.global.setSelectedFullDate_WorkStartDate(null);

    this.menuClose();
    this.global.setMenuBackVisibility(true, false);

    if (page.component == 'HomePage') {
      this.global.setNavData(null);

      if ((localStorage.userCountry == this.global.usLocation) && (localStorage.managerViewOnly == 'false')) {
       
        this.global.pushNewPage('/us-home', '');
      } else if ((localStorage.userCountry == this.global.zenUkLocation) && (localStorage.managerViewOnly == 'false')) {
        this.global.pushNewPage('/uk-home', '');
      } else if ((localStorage.userCountry == this.global.zenLiveX) && (localStorage.managerViewOnly == 'false')) {
        this.global.pushNewPage('/live-x', '');
      } else if ((localStorage.userCountry == this.global.saLocation) && (localStorage.managerViewOnly == 'false')) {
        this.global.pushNewPage('/sa-home', '');
      } else if (localStorage.managerViewOnly == 'true') {
        this.global.pushNewPage('/leave-approval', '');
      } else {
        this.global.pushNewPage('/home', '');
      }
    } else if (page.component == 'LeaveSummaryPage') {
      this.global.pushNewPage('/leave-summary', '');
    } else if (page.component == 'ManagerDashboardComponent') {
      this.global.pushNewPage('/manager-dashboard', '');
    } else if (page.component == 'FAQPage') {
      this.global.pushNewPage('/faq', '');
    } else if (page.component == 'LeaveApprovalPage') {
      this.global.pushNewPage('/leave-approval', '');
    }
  }

  menuClose() {
    this.menuController.close();
  }

  isPasswordChangedCheck() {
    const req = {
      user_id: this.global.getUserId(),
      authToken: this.global.getAuthToken(),
      MailId: this.global.getMailId()
    };

    if (req) {
      this.global.showProgressBar();
      this.global.showConsoleLog('req', JSON.stringify(req));
      this.homeService.isPasswordChangedCheck(req)
        .subscribe(
          passwordChangeCheckData => {
            this.global.showConsoleLog('passwordChangeCheckData :', passwordChangeCheckData);
            if (passwordChangeCheckData.ErrorCode == 0) {
              this.getMenuAPICall();
            } else if (passwordChangeCheckData.ErrorCode == 1) {
              this.global.hideProgressBar();
              this.global.setMenuBackVisibility(false, false);
              this.rootPage = '/login';
            }
          },
          (error) => {
            this.global.hideProgressBar();
            this.global.showConsoleLog('error', error);
            this.global.showDialogs(false, error.ErrorMessage);
            this.global.setMenuBackVisibility(false, false);
            this.rootPage = '/login';
          });

    }
  }

  async logoutDialog() {
    const alert = await this.alertCtrl.create({
      header: this.global.ALART_TITLE,
      message: 'Are you sure do you want to logout?',
      backdropDismiss: true,
      buttons: [{
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          this.global.showConsoleLog('logoutDialog ', 'Logout');
          this.logout();
          this.global.defaultDataFlag = false;
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
      this.global.setMenuBackVisibility(false, false);
      this.menuController.close();
      this.notificationsService.isFromNotification = false;
      localStorage.clear();
      this.global.pushNewPage('/login', null);
    } else {
      this.global.showDialogs(false, dataFromApi.ErrorMessage);
    }
  }

  holidayCalendar() {

    window.open('https://my-leaves.zensar.com/Calendar_2020.pdf', '_blank');
  }


  getMenuAPICall() {
    this.global.getMenu()
      .subscribe(
        menuData => {
          this.global.hideProgressBar();
          this.global.showConsoleLog('menuData:', menuData);
          if (this.global.checkIfDataIsValid(menuData.MenuList) && menuData.MenuList.length > 0) {
            this.global.setSideMenuItems(menuData.MenuList);
            this.global.setMenuBackVisibility(true, false);
            this.global.setUserProfilePic(menuData.profilePicURL);
            if (localStorage.userCountry == this.global.usLocation) {
              
              this.rootPage = '/us-home';
            } else if (localStorage.userCountry == this.global.zenUkLocation) {
              this.rootPage = '/uk-home';
            } else if (localStorage.userCountry == this.global.zenLiveX) {
              this.rootPage = '/live-x';
            } else if (localStorage.userCountry == this.global.saLocation) {
              this.rootPage = '/sa-home';
            } else {
              this.rootPage = '/home';
            }
            this.global.showConsoleLog('userpicdata:', localStorage.profilePic);
          } else {
            this.global.clearLocalStorage();
            this.global.setMenuBackVisibility(false, false);
            this.rootPage = '/login';
          }
        },
        (error) => {
          this.global.clearLocalStorage();
          this.global.showConsoleLog('error', error);
          this.global.hideProgressBar();
          this.global.setMenuBackVisibility(false, false);
          this.rootPage = '/login';
        });
  }

  ssoValidationAPICall(staffID, emailID, token) {
    // this.global.generateKeyNew();
    this.global.showProgressBar();
    this.global.ssoValidation(staffID, emailID, token)
      .subscribe(
        ssoData => {
          this.global.showConsoleLog('ssoValidationAPICall:', ssoData);
          const tempThis = this;
          this.global.generateKeyNewForSSO(function() {
              console.log('public key gen');
              tempThis.successCallback(ssoData);
          });
          // this.global.generateKeyNew();
          // this.successCallback(ssoData);


        },
        (error) => {
          this.global.clearLocalStorage();
          this.global.showConsoleLog('error', error);
          this.global.hideProgressBar();
          this.global.setMenuBackVisibility(false, false);
          this.rootPage = '/login';
        });
  }

  successCallback(dataFromApi) {
    this.global.showConsoleLog('Verify API Data ', dataFromApi);
    if (dataFromApi.ErrorCode == 0) {
      this.global.showConsoleLog('Verify API Data ', dataFromApi.ErrorMessage);
      localStorage.userCountry = dataFromApi.userLocation;
      console.log('localStorage.userCountry : ' + localStorage.userCountry);
      localStorage.managerViewOnly = dataFromApi.managerViewOnly;

      this.setLocalStorageData(dataFromApi).then(returnData => {
        this.global.setUserFullName();
        this.global.showConsoleLog('Location Name ', localStorage.locationName);
        this.global.showConsoleLog('User is Manger ', localStorage.userRole);
        console.log('Location Name ', localStorage.locationName);
        console.log('User is Manger ', localStorage.userRole);

        this.global.getMenu()
          .subscribe(
            menuData => {
              this.global.hideProgressBar();
              this.global.showConsoleLog('menuData:', menuData);
              if (this.global.checkIfDataIsValid(menuData.MenuList) && menuData.MenuList.length > 0) {
                this.global.setSideMenuItems(menuData.MenuList);
                this.global.showConsoleLog("Login-RegDeviceToken", this.global.checkIfDataIsValid(localStorage.fcmToken) + " | " + this.global.checkIfDataIsValid(localStorage.AuthToken));
                this.global.setMenuBackVisibility(true, false);
                this.global.setUserProfilePic(menuData.profilePicURL);

                if (this.global.checkIfDataIsValid(localStorage.fcmToken) && this.global.checkIfDataIsValid(localStorage.AuthToken)) {
                  this.registerDeviceToken();
                } else if ((localStorage.userCountry == this.global.usLocation) && (localStorage.managerViewOnly == 'false')) {
           
                  this.global.pushNewPage('/us-home', '');
                } else if ((localStorage.userCountry == this.global.zenUkLocation) && (localStorage.managerViewOnly == 'false')) {
                  this.global.pushNewPage('/uk-home', '');
                } else if ((localStorage.userCountry == this.global.zenLiveX) && (localStorage.managerViewOnly == 'false')) {
                  this.global.pushNewPage('/live-x', '');
                } else if ((localStorage.userCountry == this.global.saLocation) && (localStorage.managerViewOnly == 'false')) {
                  this.global.pushNewPage('/sa-home', '');
                } else if (localStorage.managerViewOnly == 'true') {
                  this.global.pushNewPage('/leave-approval', '');
                } else {
                  this.global.pushNewPage('/home', '');
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
      this.global.pushNewPage('/login', '');
      this.global.showDialogs('', dataFromApi.ErrorMessage);
    }
  }

  setLocalStorageData(dataFromApi: any) {
    console.log('DataFromApi : ', dataFromApi);
    // this.global.generateKeyNew();

    const promise = new Promise((resolve) => {
      this.global.encryptMessage(dataFromApi.AuthToken, this.global.publicKey).then(cipherTextAuth => {
        localStorage.AuthToken = cipherTextAuth;


        this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextAuthToken => {
          console.log('localStorage.AuthToken : ', localStorage.AuthToken);
          this.global.setAuthToken(plainTextAuthToken);
        });
        // resolve(true);
        const staffID = this.params.get('staffID');
        this.global.encryptMessage((staffID), this.global.publicKey).then(cipherTextUserId => {
          localStorage.UserId = cipherTextUserId;
          this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextUserId => {
            this.global.setUserId(plainTextUserId);
          });

          this.global.encryptMessage((dataFromApi.MailId), this.global.publicKey).then(cipherTextMail => {
            localStorage.MailId = cipherTextMail;
            this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextMail => {
              this.global.setMailId(plainTextMail);
            });
            this.global.encryptMessage((dataFromApi.FullName), this.global.publicKey).then(cipherTextName => {
              localStorage.FullName = cipherTextName;
              this.global.decryptMessage((this.global.ciphertext), this.global.privateKey).then(plainTextName => {
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

  // setLocalStorageData(dataFromApi: any) {
  //   this.global.generateKeyNew();
  //   const promise = new Promise((resolve) => {
  //     alert('app component public key : ' + JSON.stringify(this.global.publicKey));
  //     this.global.encryptMessage(dataFromApi.AuthToken, this.global.publicKey).then(cipherTextAuth => {
  //       localStorage.AuthToken = cipherTextAuth;

  //       this.global.decryptMessage(localStorage.AuthToken, this.global.publicKey).then(plainTextAuthToken => {
  //         this.global.showConsoleLog('AuthToken ', plainTextAuthToken);
  //         this.global.setAuthToken(plainTextAuthToken);
  //       });

  //       const staffID = this.params.get('staffID');
  //       this.global.encryptMessage(staffID, this.global.publicKey).then(cipherTextUserId => {
  //         localStorage.UserId = cipherTextUserId;
  //         this.global.decryptMessage(localStorage.UserId, this.global.publicKey).then(plainTextUserId => {
  //           this.global.showConsoleLog('UserId ', plainTextUserId);
  //           this.global.setUserId(plainTextUserId);
  //         });

  //         this.global.encryptMessage(dataFromApi.MailId, this.global.publicKey).then(cipherTextMail => {
  //           localStorage.MailId = cipherTextMail;
  //           this.global.decryptMessage(localStorage.MailId, this.global.publicKey).then(plainTextMail => {
  //             this.global.showConsoleLog('MailId ', plainTextMail);
  //             this.global.setMailId(plainTextMail);
  //           });
  //           this.global.encryptMessage(dataFromApi.FullName, this.global.publicKey).then(cipherTextName => {
  //             localStorage.FullName = cipherTextName;
  //             this.global.decryptMessage(localStorage.FullName, this.global.publicKey).then(plainTextName => {
  //               this.global.showConsoleLog('FullName ', plainTextName);
  //               this.global.setFullName(plainTextName);
  //             });
  //             resolve(true);
  //           });
  //         });
  //       });
  //     });
  //   });
  //   return promise;
  // }

  registerDeviceToken() {
    const req = {
      user_id: this.global.getUserId(),
      authToken: this.global.getAuthToken(),
      deviceToken: localStorage.fcmToken
    };

    if (req) {
      this.homeService.registerDeviceToken(req)
        .subscribe(
          deviceTokenData => {
            this.global.showConsoleLog('Device Token Data :', deviceTokenData);
            if (deviceTokenData.ErrorCode == 0) {
              this.global.showConsoleLog('Device Registration', deviceTokenData.ErrorMessage);
            } else if (deviceTokenData.ErrorCode == 1) {
              this.global.showConsoleLog('Device Registration', deviceTokenData.ErrorMessage);
            }
            this.global.setMenuBackVisibility(true, false);

            if (localStorage.userCountry == this.global.usLocation) {
              
              this.rootPage = '/us-home';
            } else if (localStorage.userCountry == this.global.zenUkLocation) {
              this.rootPage = '/uk-home';
            } else if (localStorage.userCountry == this.global.zenLiveX) {
              this.rootPage = '/live-x';
            } else if (localStorage.userCountry == this.global.saLocation) {
              this.rootPage = '/sa-home';
            } else {
              this.rootPage = '/home';
            }
          },
          (error) => {
            this.global.showConsoleLog('error', error);
            this.global.showDialogs(false, error.ErrorMessage);
            this.global.setMenuBackVisibility(true, false);
            if (localStorage.userCountry == this.global.usLocation) {
              
              this.rootPage = '/us-home';
            } else if (localStorage.userCountry == this.global.zenUkLocation) {
              this.rootPage = '/uk-home';
            } else if (localStorage.userCountry == this.global.zenLiveX) {
              this.rootPage = '/live-x';
            } else if (localStorage.userCountry == this.global.saLocation) {
              this.rootPage = '/sa-home';
            } else {
              this.rootPage = '/home';
            }
          });
    }
  }

  setLogoutTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1200000);
    // this.userActivity = setTimeout(() => this.userInactive.next(undefined), 10000);
  }

  @HostListener('touchstart')
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setLogoutTimeout();
  }

}
