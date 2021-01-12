import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GlobalService } from './services/global.service';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'faq', loadChildren: './pages/faq/faq.module#FaqPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'leave-approval', loadChildren: './pages/leave-approval/leave-approval.module#LeaveApprovalPageModule' },
  { path: 'leave-summary', loadChildren: './pages/leave-summary/leave-summary.module#LeaveSummaryPageModule' },
  { path: 'live-x', loadChildren: './pages/live-x/live-x.module#LiveXPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'uk-home', loadChildren: './pages/uk-home/uk-home.module#UkHomePageModule' },
  { path: 'us-home', loadChildren: './pages/us-home/us-home.module#UsHomePageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'calendar-pop-up', loadChildren: './controls/calendar-pop-up/calendar-pop-up.module#CalendarPopUpPageModule' },
  // tslint:disable-next-line: max-line-length
  { path: 'leave-show-more-popup', loadChildren: './controls/leave-show-more-popup/leave-show-more-popup.module#LeaveShowMorePopupPageModule' },
  { path: 'expandable-section', loadChildren: './controls/expandable-section/expandable-section.module#ExpandableSectionPageModule' },
  // tslint:disable-next-line: max-line-length
  { path: 'leave-approval-detail', loadChildren: './pages/leave-approval/leave-approval-detail/leave-approval-detail.module#LeaveApprovalDetailPageModule' },
  { path: 'sa-home', loadChildren: './pages/sa-home/sa-home.module#SaHomePageModule' },
  { path: 'manager-dashboard', loadChildren: './pages/manager-dashboard/manager-dashboard.module#ManagerDashboardPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(public global: GlobalService) {
    this.global.router.navigate(['/login'], { skipLocationChange: true });
  }
}
