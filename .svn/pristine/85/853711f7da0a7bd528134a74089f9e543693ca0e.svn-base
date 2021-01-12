import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LeaveApprovalDetailPage } from './leave-approval-detail.page';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';

const routes: Routes = [
  {
    path: '',
    component: LeaveApprovalDetailPage
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
  declarations: [LeaveApprovalDetailPage]
})
export class LeaveApprovalDetailPageModule {}
