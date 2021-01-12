import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FaqPage } from './faq.page';
import { SharedHeaderModule } from 'src/app/controls/shared-header/shared-header.module';

const routes: Routes = [
  {
    path: '',
    component: FaqPage
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
  declarations: [FaqPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaqPageModule { }
