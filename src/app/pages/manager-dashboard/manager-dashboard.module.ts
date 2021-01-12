import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ManagerDashboardPage } from './manager-dashboard.page';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';
import { ManagerDashboardFilterPipe } from './manager-dashboard-filter.pipe';
import { CalendarModule } from 'ion4-calendar';

const routes: Routes = [
  {
    path: '',
    component: ManagerDashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    SharedHeaderModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ManagerDashboardPage, ManagerDashboardFilterPipe]
})
export class ManagerDashboardPageModule { }
