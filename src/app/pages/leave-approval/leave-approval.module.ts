import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LeaveApprovalPage } from './leave-approval.page';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';
import { LeaveApprovalEmployeeFilterPipe } from './leave-approval-employee-filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: LeaveApprovalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedHeaderModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveApprovalPage, LeaveApprovalEmployeeFilterPipe]
})
export class LeaveApprovalPageModule { }
