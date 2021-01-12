import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UkHomePage } from './uk-home.page';
import { CalendarModule } from 'ion4-calendar';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';

const routes: Routes = [
  {
    path: '',
    component: UkHomePage
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
  declarations: [UkHomePage]
})
export class UkHomePageModule { }
