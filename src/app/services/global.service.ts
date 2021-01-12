import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do'; /*it is an operator*/
import 'rxjs/add/operator/catch'; /*it is an operator*/
import 'rxjs/add/operator/catch'; /*it is an operator*/
// import { EncryptionService } from 'angular-encryption-service';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
declare var ga;

@Injectable()
export class GlobalService {

  /*DB54735 and AS48013 are reporting to PM81209 and they are females. : Rahul Soans - 24-04-2019*/

  // tslint:disable-next-line: max-line-length
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController, public http: HttpClient, public location: Location, public router: Router) {
  }

  private navData: any;
  public fcmToken: any;
  public ALART_TITLE = 'Information';
  public NETWORK_ERROR = 'Network Error';
  private loader: any;
  private isDevMode = false;
  public usLocation = 'ZENUS';
  public usLocationValue2 = 'US';
  // public ukLocation = 'UK';
  public zenUkLocation = 'ZENUK';
  public zenUk = 'UK';
  public zenLiveX = 'Livex';
  public saLocation = 'ZENSA';
  // public usLocation: string = 'US';

  // Development URL
  public apiBaseURL = 'https://dev-my-leaves.zensar.com/api/';
  public faqBaseURL = 'https://dev-my-leaves.zensar.com/faqData.json';
  public faqBaseURLUs = 'https://dev-my-leaves.zensar.com/faqDataUS.json';
  public faqBaseURLUk = 'https://dev-my-leaves.zensar.com/faqDataUK.json';
  public faqBaseURLLiveX = 'https://dev-my-leaves.zensar.com/faqDataLivex.json';
  public homeMessageJson = 'https://dev-my-leaves.zensar.com/homePageMsg.json';

  // Production URL
  // public apiBaseURL = 'https://my-leaves.zensar.com/api/';
  // public faqBaseURL = 'https://my-leaves.zensar.com/faqData.json';
  // public faqBaseURLUs = 'https://my-leaves.zensar.com/faqDataUS.json';
  // public faqBaseURLUk = 'https://my-leaves.zensar.com/faqDataUK.json';
  // public faqBaseURLLiveX = 'https://my-leaves.zensar.com/faqDataLivex.json';
  // public homeMessageJson = 'https://my-leaves.zensar.com/homePageMsg.json';


  pageTitle: any;
  public userFullName: any;
  public locationName: any;
  public leaveInfo: any;
  public isLeaveEditable = false;
  private sideMenuItems: any;
  public profilePic: any;
  public userCountry: any;
  public defaultDataFlag: boolean;
  public isFromLeaveApprovalPage: boolean;
  public isFromSummaryPage: boolean;
  public isFromApporvalPage: boolean;

  private menuIcon = false;
  private backIcon = false;
  // tslint:disable-next-line: variable-name
  private selectedFullDate_StartDate: any;
  // tslint:disable-next-line: variable-name
  private selectedFullDate_LeaveBal: any;
  // tslint:disable-next-line: variable-name
  private selectedFullDate_EndDate: any;
  // tslint:disable-next-line: variable-name
  private selectedFullDate_WorkStartDate: any;
  // tslint:disable-next-line: variable-name
  private selectedFullDate_WorkEndDate: any;

  //
  configArray: any;
  swipeMissCount: any;
  calendarCurrentMonth: any;
  cryptKey: CryptoKey;
  private authToken: any;
  private userId: any;
  private mailId: any;
  private fullName: any;

  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };

  // **********NEW CODE********************/

  publicKey: CryptoKey;
  privateKey: CryptoKey;

  ciphertext: any;
  secretKey = 'lmsKey';

  // /**
  // *
  // * @param dataToBeValidated Check data is valid or not.
  // */
  checkIfDataIsValid(dataToBeValidated): boolean {
    // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line: triple-equals
    return (dataToBeValidated != null &&
      // tslint:disable-next-line: triple-equals
      dataToBeValidated != 'null' &&
      // tslint:disable-next-line: triple-equals
      dataToBeValidated != undefined &&
      // tslint:disable-next-line: triple-equals
      dataToBeValidated != '' &&
      // tslint:disable-next-line: triple-equals
      dataToBeValidated != '') ? true : false;
  }


  // /**
  // * true to pushback old screen
  // * Common alert dialog with ok button on error keep on same screen or back to previous screen.
  // * @param action
  // * @param message
  // */
  async showDialogs(action, message) {
    if (message != null && message != '') {
      const alert = await this.alertCtrl.create({
        header: this.ALART_TITLE,
        message,
        backdropDismiss: !action,
        buttons: [{
          text: 'Ok',
          role: 'Ok',
          handler: () => {
          }
        }]
      });
      await alert.present();
    }
  }

  showDialogGoToPage(pageName, message) {
    if (message != null && message != '') {
      const alert = this.alertCtrl.create({
        header: this.ALART_TITLE,
        message,
        backdropDismiss: false,
        buttons: [{
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            // tslint:disable-next-line: triple-equals
            if (pageName == 'login') {
              this.clearLocalStorage();
            }
            this.pushNewPage(pageName, '');
          }
        }]
      });
      alert.then(x => x.present());
    }
  }

  async showProgressBar() {
    this.loader = await this.loadingCtrl.create({
      duration: 5000,
      message: 'Please Wait...',
      spinner: 'dots'
    });
    this.loader.present();
  }

  async hideProgressBar() {
    if (this.loader != null) {
      await this.loader.dismiss();
    }
  }

  async showProgressBarForOtherBrowser() {
    this.loader = await this.loadingCtrl.create({
      duration: 5000,
      message: 'Please Wait...',
      spinner: 'dots'
    });
    this.loader.present();
  }

  /* Requires minimum two params : msg, data */
  showConsoleLog(messageToShow, extraParam) {
    // tslint:disable-next-line: triple-equals
    if (this.isDevMode == true) {
    }
  }


  checkIfAuthTokenIsValid(): boolean {
    return this.checkIfDataIsValid(localStorage.AuthToken);
  }


  getLeaveApplyData(): any {
    return this.leaveInfo;
  }


  setLeaveApplyData(leaveInfo: any) {
    this.leaveInfo = leaveInfo;
  }
  setPageTitle(pTitle) {
    this.pageTitle = pTitle;
  }

  getPageTitle() {
    return this.pageTitle;
  }

  setUserFullName() {
    if (this.checkIfDataIsValid(localStorage.FullName)) {
      return this.userFullName = localStorage.FullName;
    }
  }
  getUserFullName() {
    return this.userFullName;
  }
  // /**
  // * Function is  use to go back to old screen.
  // */
  popPageFromStack() {
    
    // this.appCtrl.getRootNav().pop();
    //this.navCtrl.pop();
    this.router.navigate(['/leave-summary'], { skipLocationChange: true });
  }

  /**
   * new function created to avoid pushing same screen.
   * Requires class name of the page to be pushed & navParams, if any
   */
  pushNewPage(classNameToBePushed, navParamsToBePassed) {
    
    if (this.checkIfDataIsValid(navParamsToBePassed)) {
      this.router.navigate([classNameToBePushed], { skipLocationChange: true });
      this.setNavData(navParamsToBePassed);
    } else {
      this.router.navigate([classNameToBePushed], { skipLocationChange: true });
    }
  }

  handleError(err: HttpErrorResponse) {
    this.showConsoleLog('handleError ', err.message);
    // tslint:disable-next-line: deprecation
    return Observable.throw(err.message);
  }

  logoutAPI(): Observable<any> {
    const req = {
      user_id: this.getUserId(),
      authToken: this.getAuthToken()
    };

    return this.http.post<any>(this.apiBaseURL + 'logOut', req, this.httpOptions)
      .do((data) => {
        this.showConsoleLog('Sign Out Data : ', data);
        this.clearLocalStorage();
      })
      .catch(this.handleError);
  }

  getMenu(): Observable<any> {


    const req = {
      user_id: this.getUserId(),
      authToken: this.getAuthToken(),
      MailId: this.getMailId(),
      userLocation: localStorage.userCountry,
      managerViewOnly: localStorage.managerViewOnly
    };

    return this.http.post<any>(this.apiBaseURL + 'menuList', req, this.httpOptions)
      .do((data) => {
        this.showConsoleLog('getMenu: ', data);
      })
      .catch(this.handleError);
  }


  ssoValidation(staffID, emailID, token): Observable<any> {
    const req = {
      staffID,
      token,
      emailID
    };

    return this.http.post<any>(this.apiBaseURL + 'zenhelpsso', req, this.httpOptions)
      .do((data) => {
        this.showConsoleLog('ssoValidation: ', data);
      })
      .catch(this.handleError);
  }

  setSideMenuItems(sMenu) {
    this.sideMenuItems = sMenu;
  }

  getSideMenuItems() {
    return this.sideMenuItems;
  }

  setUserLocation(location: any) {
    this.locationName = location;
  }

  getUserLocation() {
    return this.locationName;
  }

  setUserCountry(country: any) {
    this.userCountry = country;
  }

  getUserCountry() {
    return this.userCountry;
  }

  setUserProfilePic(src) {
    if (this.checkIfDataIsValid(src)) {
      this.profilePic = src;
    } else {
      this.profilePic = 'assets/imgs/user_default.png';
    }
  }

  getUserProfilePic() {
    return this.profilePic;
  }

  clearLocalStorage() {
    localStorage.AuthToken = '';
    localStorage.UserId = '';
    localStorage.password = '';
    localStorage.fcmToken = '';
    localStorage.MailId = '';
    localStorage.FullName = '';
    localStorage.locationName = '';
    localStorage.userCountry = '';
    localStorage.managerID = '';
    localStorage.manager2UpID = '';
    this.setUserProfilePic('assets/imgs/user_default.png');
    this.setConfigArray(null);
  }

  setConfigArray(data) {
    this.configArray = data;
  }

  getConfigArray() {
    return this.configArray;
  }

  setSwipeMissCount(data) {
    this.swipeMissCount = data;
  }

  getSwipeMissCount() {
    return this.swipeMissCount;
  }

  setCalendarCurrentMonth(data) {
    this.calendarCurrentMonth = data;
  }

  getCalendarCurrentMonth() {
    return this.calendarCurrentMonth;
  }

  generateKey() {
    // tslint:disable-next-line: prefer-const
    let keyForGeneratingCryptKey = 'lmsKey';
    const promise = new Promise((resolve) => {
      return this.generateKeyNew();

      // return this.encryptionService.generateKey(keyForGeneratingCryptKey).then(key => {
      //   this.cryptKey = key;
      //   this.showConsoleLog('this.cryptKey : ', key);
      //   resolve(true);
      // });
    });

    return promise;
  }

  // doEncryptData(dataToEncrypt): Promise<string> {
  //   // console.log('Global service : doEncryptData enter');
  //   // this.showConsoleLog('data to encrypt : ', dataToEncrypt);
  //   // console.log('dataToEncrypt: ', dataToEncrypt);
  //   // console.log('Global service : doEncryptData exit');
  //   // console.log('cryptKey : ', this.cryptKey);
  //   // return this.encryptionService.encrypt(dataToEncrypt, this.cryptKey);
  //   return null;
  // }
  // doDecryptData(cipherText: any): any {
  //   // this.showConsoleLog('data to decrypt : ', cipherText);
  //   // return this.encryptionService.decrypt(cipherText, this.cryptKey);
  //   return null;
  // }


  // ************** NEW CODE ****************/
  generateKeyNew() {
    const promise = new Promise(() => {
      window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      ).then((keyPair) => {
        this.publicKey = keyPair.publicKey;
        //console.log('pk : ', this.publicKey);
        this.privateKey = keyPair.privateKey;
      });
    });

    return promise;
  }

  generateKeyNewForSSO(callback: Function) {
    const promise = new Promise(() => {
      window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      ).then((keyPair) => {
        this.publicKey = keyPair.publicKey;
        //console.log('pk : ', this.publicKey);
        this.privateKey = keyPair.privateKey;
        callback();
      });
    });

    return promise;
  }

  async encryptMessage(dataToEncrypt, publicKey): Promise<ArrayBuffer> {
    this.ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
        // @ts-ignore
        hash: 'SHA-256',
      },
      publicKey,
      this.stringToArrayBuffer(dataToEncrypt)
    );

    const buffer = new Uint8Array(this.ciphertext, 0, 5);

    return buffer;
  }

  async decryptMessage(cipherText, privateKey): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
        // @ts-ignore
        hash: 'SHA-256',
      },
      privateKey,
      cipherText
    );

    return this.arrayBufferToString(decrypted);
  }

  arrayBufferToString(bufferData) {
    return String.fromCharCode.apply(null, new Uint16Array(bufferData));
  }

  stringToArrayBuffer(str) {
    const bufferData = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(bufferData);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufferData;
  }

  // ***************************************/

  setAuthToken(token: any) {
    this.authToken = token;
  }
  getAuthToken(): any {
    return this.authToken;
  }
  setUserId(id: any) {
    this.userId = id;
  }
  getUserId(): any {
    return this.userId;
  }
  setMailId(id: any) {
    this.mailId = id;
  }
  getMailId(): any {
    return this.mailId;
  }
  setFullName(name: any) {
    this.fullName = name;
  }
  getFullName(): any {
    return this.fullName;
  }

  setMenuIcon(isMenuShow: any) {
    this.menuIcon = isMenuShow;
  }
  getMenuIcon(): any {
    return this.menuIcon;
  }

  setBackIcon(isBackShow: any) {
    this.backIcon = isBackShow;
  }
  getBackIcon(): any {
    return this.backIcon;
  }

  setMenuBackVisibility(isMenuShow, isBackShow) {
    this.setMenuIcon(isMenuShow);
    this.setBackIcon(isBackShow);
  }

  setSelectedFullDate_StartDate(selectedDate) {/*Added by Bhushan : 20-02-2019*/
    this.selectedFullDate_StartDate = selectedDate;
  }

  getSelectedFullDate_StartDate() {/*Added by Bhushan : 20-02-2019*/
    return this.selectedFullDate_StartDate;
  }

  setSelectedFullDate_LeaveBal(selectedDate) {/*Added by Bhushan : 20-02-2019*/
    this.selectedFullDate_LeaveBal = selectedDate;
  }

  getSelectedFullDate_LeaveBal() {/*Added by Bhushan : 20-02-2019*/
    return this.selectedFullDate_LeaveBal;
  }

  setSelectedFullDate_EndDate(selectedDate) {/*Added by Bhushan : 20-02-2019*/
    this.selectedFullDate_EndDate = selectedDate;
  }

  getSelectedFullDate_EndDate() {/*Added by Bhushan : 20-02-2019*/
    return this.selectedFullDate_EndDate;
  }

  setAlertTitle(title) {/*Added by Bhushan : 28-02-2019*/
    this.ALART_TITLE = title;
  }

  getAlertTitle() {/*Added by Bhushan : 28-02-2019*/
    return this.ALART_TITLE;
  }

  setSelectedFullDate_WorkStartDate(selectedDate) {/*Added by Bhushan : 08-03-2019*/
    this.selectedFullDate_WorkStartDate = selectedDate;
  }

  getSelectedFullDate_WorkStartDate() {/*Added by Bhushan : 08-03-2019*/
    return this.selectedFullDate_WorkStartDate;
  }

  setSelectedFullDate_WorkEndDate(selectedDate) {/*Added by Bhushan : 08-03-2019*/
    this.selectedFullDate_WorkEndDate = selectedDate;
  }

  getSelectedFullDate_WorkEndDate() {/*Added by Bhushan : 08-03-2019*/
    return this.selectedFullDate_WorkEndDate;
  }

  getLocalStorageUserCountry() {
    return localStorage.userCountry;
  }

  public setNavData(navData) {
    this.navData = navData;
  }

  getNavData() {
    return this.navData;
  }

  cleanNavData() {
    this.navData = null;
  }

  getHomePageMessage(): Observable<any> {
    return this.http.post<any>(this.homeMessageJson, this.httpOptions)
      .do((data) => {
        this.showConsoleLog('this.homeMessage:', data)
      })
      .catch(this.handleError)
  }

  /*Added by Ajinkya for Google Analytics: 09-01-2020*/

  setTracker(tracker) {
    if (!localStorage.getItem('ga:UA-75821623-17')) {
      localStorage.setItem('ga:UA-75821623-17', tracker.get('UA-75821623-17'));
    }
  }

  startTrackerWithId(id) {
    ga('create', {
      storage: 'none',
      trackingId: id,
      clientId: localStorage.getItem('ga:UA-75821623-17')
    });
    ga('set', 'checkProtocolTask', null);
    ga('set', 'transportUrl', 'https://www.google-analytics.com/collect');
    ga(this.setTracker);
  }

  trackView(pageUrl: string, screenName: string) {
    /* pageUrl: selector used for class, screenName: name of class */

    /*
   pageUrl: className
   screenName: selector
   */
    ga('set', {
      page: pageUrl,
      title: screenName
    });
    ga('send', 'pageview');
  }

  trackEvent(category, action, label?, value?) {
    /* 'video', 'play', videoUrl, id */ //Video 9139536458
    /* 'document', 'view', fileUrl, nodeId */ //File
    /* 'tag', 'selected'/'deselected'), tag.name, tag.id */ //Home page - tag selected
    /* 'events', 'view', "https://www.zensar.com/about-us/media/events", 1 */ //Zensar Events
    /* 'search', 'searchDetails', searchResultDetailsResponse.title, searchResultDetailsResponse.nid */ //Details of search item
    /* 'search', 'gotResult_' + SearchResult.length/'noResult', searchKey, SearchResult.length/0 */ //Search list
    /* 'quiz', 'submitted', fullName + '_' + quiz_id, quiz_id */ //Quiz submitted
    /* 'socialWall', 'postCreated', localStorage.Email, '' */ //Posted on social wall
    ga('send', 'event', {
      eventCategory: category,
      eventLabel: label,
      eventAction: action,
      eventValue: value
    });
  }

  registerDeviceToken() {
    const req = {
      user_id: this.getUserId(),
      authToken: this.getAuthToken(),
      deviceToken: this.fcmToken
    };

    if (req) {
      this.registerFcmToken(req)
        .subscribe(
          deviceTokenData => {
            this.showConsoleLog('Device Token Data :', deviceTokenData);
            // tslint:disable-next-line: triple-equals

            if (deviceTokenData.ErrorCode == 0) {
              this.showConsoleLog('Device Registration', deviceTokenData.ErrorMessage);
              // tslint:disable-next-line: triple-equals
            } else if (deviceTokenData.ErrorCode == 1) {
              this.showConsoleLog('Device Registration', deviceTokenData.ErrorMessage);
            }
          },
          (error) => {
            this.showConsoleLog('error', error);
          });
    }
  }

  registerFcmToken(req): Observable<any> {
    return this.http.post<any>(this.apiBaseURL + 'registerDeviceToken', req, this.httpOptions)
      .do((data) => {
        this.showConsoleLog('User Device Token :', data);
      })
      .catch(this.handleError);
  }
}
