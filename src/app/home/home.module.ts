import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxGaugeModule } from 'ngx-gauge';

import { HomePage } from './home.page';

import { GaugeComponent } from '../gauge/gauge.component';
import { BluetoothComponent } from '../bluetooth/bluetooth.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxGaugeModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, GaugeComponent, BluetoothComponent]
})
export class HomePageModule {}
