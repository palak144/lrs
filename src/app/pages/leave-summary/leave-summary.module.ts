import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {NgxPrintModule} from 'ngx-print';
import { LeaveSummaryPage } from './leave-summary.page';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';

const routes: Routes = [
  {
    path: '',
    component: LeaveSummaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedHeaderModule,
    RouterModule.forChild(routes),
    NgxPrintModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [LeaveSummaryPage]
})
export class LeaveSummaryPageModule { }
