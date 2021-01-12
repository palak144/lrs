import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LiveXPage } from './live-x.page';
import { CalendarModule } from 'ion4-calendar';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';

const routes: Routes = [
  {
    path: '',
    component: LiveXPage
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
  declarations: [LiveXPage]
})
export class LiveXPageModule { }
