import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BluetoothListPageRoutingModule } from './bluetooth-list-routing.module';

import { BluetoothListPage } from './bluetooth-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BluetoothListPageRoutingModule
  ],
  declarations: [BluetoothListPage]
})
export class BluetoothListPageModule {}
