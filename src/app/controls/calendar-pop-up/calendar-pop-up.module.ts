import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CalendarPopUpPage } from './calendar-pop-up.page';
import { CalendarModule } from 'ion4-calendar';

const routes: Routes = [
  {
    path: '',
    component: CalendarPopUpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CalendarPopUpPage]
})
export class CalendarPopUpPageModule { }
