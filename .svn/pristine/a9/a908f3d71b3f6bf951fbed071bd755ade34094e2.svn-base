import { Injectable } from '@angular/core';
/* import {firebase} from '@firebase/app';
import '@firebase/messaging'; */
import * as firebase from 'firebase';
import 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { LeaveApprovalDetailService } from '../pages/leave-approval/leave-approval-detail/leave-approval-detail.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  isFromNotification = false;
  leaveDataInfo: any;
  leaveToken: any;

  constructor(private router: Router, private global: GlobalService, private leaveApprovalService: LeaveApprovalDetailService) { }

  init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.serviceWorker.ready.then((registration) => {
        // Don't crash an error if messaging not supported
        if (!firebase.messaging.isSupported()) {
          resolve();
          return;
        }

        const messaging = firebase.messaging();

        // Register the Service Worker
        /*  messaging.useServiceWorker(registration); */
        // Initialize your VAPI key
        messaging.usePublicVapidKey(
          environment.firebase.vapidKey
        );

        // Optional and not covered in the article
        // Listen to messages when your app is in the foreground
        messaging.onMessage((payload) => {
          // console.log('Inside angular control, can launch any page');
          // console.log(payload);
          this.isFromNotification = true;

          this.leaveToken = payload.data.leaveToken;
          // console.log('leave token : ' + this.leaveToken);

          if (localStorage.AuthToken != null && localStorage.AuthToken != '') {
            this.getLeaveInfo();
          } else {
            this.global.pushNewPage('/login', '');
          }
          // this.isFromNotification = false;
        });
        // Optional and not covered in the article
        // Handle token refresh
        messaging.onTokenRefresh(() => {
          messaging.getToken().then(
            (refreshedToken: string) => {
              // console.log('Refreshed Token : ', refreshedToken);
              this.global.fcmToken = refreshedToken;
              this.global.registerDeviceToken();
            }).catch((err) => {
              console.error(err);
            });
        });

        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  getLeaveInfo() {
    const req = {
      leaveToken: this.leaveToken,
      user_id: this.global.getUserId(),
      authToken: this.global.getAuthToken()
    };

    if (req) {
      this.global.showConsoleLog('req', JSON.stringify(req));

      this.leaveApprovalService.getLeaveInfoFromNotification(req)
        .subscribe(leaveInfo => {
          this.successCallbackLeaveInfo(leaveInfo);
        },
          (error) => {
            this.global.showConsoleLog('error', error);
            this.global.showDialogs(false, error.ErrorMessage);
          });
    }
  }

  successCallbackLeaveInfo(dataFromApi) {
    if (dataFromApi.ErrorCode == 0) {
      if (dataFromApi.recorDetails != null) {
        this.global.setMenuBackVisibility(false, true);
        this.global.pushNewPage('/leave-approval-detail', {
          isFromEmail: true,
          leaveApprovalDetailObject: dataFromApi.recorDetails
        });
      }
    } else {
      this.global.pushNewPage('/leave-summary', '');

    }
  }

  requestPermission(): Promise<void> {
    // console.log('requestPermission called');
    return new Promise<void>(async (resolve) => {
      // console.log('new Promise ');
      /*   if (!Notification) {
          console.log("notication is false");
            resolve();
            return;
        }
        if (!firebase.messaging.isSupported()) {
          console.log("firebase not supported");
            resolve();
            return;
        } */
      try {
        const messaging = firebase.messaging();
        // tslint:disable-next-line: deprecation
        await messaging.requestPermission();

        this.global.fcmToken = await messaging.getToken();

        // alert('token' + token);
        // console.log('FCM token:', this.global.fcmToken);
      } catch (err) {
        // No notifications granted
        // console.log('No notifications granted :', err);
      }

      resolve();
    });
  }
}
