import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveShowMorePopupPage } from './leave-show-more-popup.page';


const routes: Routes = [
  {
    path: '',
    component: LeaveShowMorePopupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveShowMorePopupPage]
})
export class LeaveShowMorePopupPageModule {}
