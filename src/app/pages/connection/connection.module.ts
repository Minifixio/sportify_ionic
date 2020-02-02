import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionPageRoutingModule } from './connection-routing.module';

import { ConnectionPage } from './connection.page';

import { BluetoothListComponent } from '../../components/bluetooth/bluetooth-list.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionPageRoutingModule,
    SharedModule
  ],
  declarations: [ConnectionPage, BluetoothListComponent]
})
export class ConnectionPageModule {}
