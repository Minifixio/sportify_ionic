import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BluetoothListPage } from './bluetooth-list.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BluetoothListPageRoutingModule {}
