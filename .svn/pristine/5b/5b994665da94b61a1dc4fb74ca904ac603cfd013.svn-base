import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CalendarModule } from 'ion4-calendar';
import { HttpClientModule } from '@angular/common/http';
import {NgxPrintModule} from 'ngx-print';
import { LeaveSummaryPageModule } from './pages/leave-summary/leave-summary.module';
import { GlobalService } from './services/global.service';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginPageModule } from './pages/login/login.module';
import { LoginService } from './pages/login/login.service';
import { HomeService } from './pages/home/home.service';
import { HomePageModule } from './pages/home/home.module';
import { FaqPageModule } from './pages/faq/faq.module';
import { LeaveApprovalPageModule } from './pages/leave-approval/leave-approval.module';
import { UkHomePageModule } from './pages/uk-home/uk-home.module';
import { UsHomePageModule } from './pages/us-home/us-home.module';
import { LiveXPageModule } from './pages/live-x/live-x.module';
import { CalendarPopUpPageModule } from './controls/calendar-pop-up/calendar-pop-up.module';
import { LeaveApprovalDetailPageModule } from './pages/leave-approval/leave-approval-detail/leave-approval-detail.module';
import { LeaveShowMorePopupPageModule } from './controls/leave-show-more-popup/leave-show-more-popup.module';
import { SaHomeService } from './pages/sa-home/sa-home.service';
import { UkHomeService } from './pages/uk-home/uk-home.service';
import { UsHomeService } from './pages/us-home/us-home.service';
import { LiveXService } from './pages/live-x/live-x.service';
// tslint:disable-next-line: max-line-length
import { EmployeeLeaveDetailsModalComponent } from './pages/manager-dashboard/employee-leave-details-modal/employee-leave-details-modal.component';
import { NotificationsService } from './services/notifications.service';


@NgModule({
  declarations: [AppComponent, EmployeeLeaveDetailsModalComponent],
  entryComponents: [
    EmployeeLeaveDetailsModalComponent
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LoginPageModule,
    HomePageModule,
    LeaveSummaryPageModule,
    FaqPageModule,
    LeaveApprovalPageModule,
    UsHomePageModule,
    UkHomePageModule,
    LiveXPageModule,
    CalendarModule,
    CalendarPopUpPageModule,
    LeaveShowMorePopupPageModule,
    LeaveApprovalDetailPageModule,
    NgxPrintModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    GlobalService,
    StatusBar,
    SplashScreen,
    LoginService,
    HomeService,
    SaHomeService,
    UkHomeService,
    UsHomeService,
    LiveXService,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
